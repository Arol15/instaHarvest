import json
import os
from uuid import uuid4
from datetime import datetime
from dateutil import tz
from flask import Blueprint, request, url_for, redirect, session, current_app
from app import db
from app.models import User, Address
from app.utils.security import ts, auth_required
from app.utils.email_support import send_email

bp = Blueprint("auth", __name__)


@bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    # for key, value in data.items():
    #     if not value:
    #         data[key] = None
    email = data["email"]
    username = request.json.get("username", None)
    image_url = current_app.config['PROFILE_IMAGE']
    image_back_url = current_app.config['PROFILE_BACK_IMAGE']
    if User.query.filter_by(email=email).first():
        return {"error": f"The user with email {email} already exists"}, 409
    if username and User.query.filter_by(username=username).first():
        return {"error": f"The user with username {username} already exists"}, 409
    email_verified = False
    uuid = str(uuid4())
    profile_addr = uuid[:13]
    now = datetime.utcnow()
    # create user's folder
    user_folder = os.path.join(current_app.config['USERS_FOLDER'], uuid)
    try:
        os.mkdir(user_folder)
    except OSError:
        print(f"Creation of the directory for user {uuid} failed")

    user = User(username=username,
                uuid=uuid,
                first_name=data["first_name"],
                password=data["password"],
                email=email,
                email_verified=email_verified,
                image_url=image_url,
                image_back_url=image_back_url,
                profile_addr=profile_addr,
                confirm_email_sent=now)
    db.session.add(user)
    db.session.commit()

    address = Address(user_id=user.id,
                      primary_address=True,
                      state=data["state"],
                      city=data["city"],
                      country=data["country"],
                      lat=data["lat"],
                      lon=data["lon"],
                      address=data["address"],
                      zip_code=data["zip_code"] if data["zip_code"] else None)
    db.session.add(address)
    db.session.commit()

    session["id"] = user.id
    session["date"] = now
    # Send confirmation email

    email_token = ts.dumps(email, salt="email-confirm")
    confirm_url = url_for(".confirm_email", token=email_token, _external=True)
    subject = "InstaHarvest - Confirm your account"
    send_email(email, subject, "confirmation_email",
               user=user, confirm_url=confirm_url)
    return user.to_dict_auth(), 201


@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    login = data["login"]
    if "@" in login:
        user = User.query.filter_by(email=login).first()
        if user is None:
            return {"error": f"The user with email {login} does not exist"}, 401
    else:
        user = User.query.filter_by(username=login).first()
        if user is None:
            return {"error": f"The user with username {login} does not exist"}, 401
    if user.check_password(data["password"]):
        session["id"] = user.id
        session["date"] = datetime.utcnow()
    else:
        return {"error": "Wrong password"}, 401

    return user.to_dict_auth(), 200


@bp.route("/logout", methods=["POST"])
def logout():
    session.pop("id", default=None)
    return {}, 200


@bp.route("/resend_email", methods=["POST"])
@auth_required
def resend_email():
    user_id = session["id"]
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return {}, 404
    now = datetime.utcnow()
    time_diff = now - user.confirm_email_sent
    if time_diff.seconds < 14400:
        return {"error": f"Sorry, you can resend confirmation email in {(14400 - time_diff.seconds) // 60 + 1} minutes"}, 406
    email = user.email
    email_token = ts.dumps(email, salt="email-confirm")
    confirm_url = url_for(".confirm_email", token=email_token, _external=True)
    subject = "InstaHarvest - Confirm your account"
    send_email(email, subject, "confirmation_email",
               user=user, confirm_url=confirm_url)

    user.confirm_email_sent = now
    db.session.add(user)
    db.session.commit()
    return {"msg": "A confirmation email has been sent"}, 200


@bp.route("/reset_password", methods=["POST"])
def reset_password():
    email = request.json.get("email")
    user = User.query.filter_by(email=email).first()
    if user is None:
        return {"error": f"The user with email {email} does not exist"}, 401
    email_token = ts.dumps(email, salt="pass-reset")
    confirm_url = f"{current_app.config['BASE_URL']}/reset-password-confirm/{email_token}"
    subject = "InstaHarvest - Password Reset"
    send_email(email, subject, "reset_password",
               user=user, confirm_url=confirm_url)
    return {"msg": "A reset password email has been sent"}, 200


@bp.route("/confirm/<token>")
def confirm_email(token):
    try:
        email = ts.loads(token, salt="email-confirm", max_age=86400)
    except:
        return redirect(f"{current_app.config['BASE_URL']}/404", code=302)
    user = User.query.filter_by(email=email).first()
    if user is None:
        return redirect(f"{current_app.config['BASE_URL']}/404", code=302)
    user.email_verified = True
    db.session.add(user)
    db.session.commit()
    return redirect(f"{current_app.config['BASE_URL']}/profile", code=302)


@bp.route("/reset_password_confirm", methods=["POST"])
def reset_password_confirm():
    data = request.get_json()
    try:
        email = ts.loads(data["token"], salt="pass-reset", max_age=86400)
    except:
        return {"error": "The token is not valid or expired"}, 406

    user = User.query.filter_by(email=email).first()
    if user is None:
        return {"error": "Can not find the user"}, 404
    user.change_password(data["password"])
    db.session.add(user)
    db.session.commit()
    return {"msg": "A new password has been saved"}, 200
