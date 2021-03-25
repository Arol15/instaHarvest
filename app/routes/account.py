import json
from datetime import datetime
from dateutil import tz
from flask import Blueprint, request, url_for, session
from app import db
from app.models import User
from app.utils.security import ts, auth_required
from app.utils.email_support import send_email
from app.config import Config
from app.utils.security import auth_required, reauth_required

import boto3

bp = Blueprint("account", __name__, url_prefix="/api/account")


@bp.route("/get_profile_private", methods=["POST"])
@auth_required
def get_profile():
    user_id = session["id"]
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return {}, 404
    res = user.to_dict_private()
    return res, 200


@bp.route("/<string:addr>")
def get_profile_public(addr):
    user = User.query.filter_by(profile_addr=addr).first()
    if user is None:
        return {}, 404
    res = user.to_dict_public()
    return res, 200


@bp.route("/change_pass", methods=["PATCH"])
@reauth_required
def change_pass():
    data = request.get_json()
    user_id = session["id"]
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return {}, 404
    if user.check_password(data["password"]):
        return {"error": "New password can't be the same as an old one"}, 404
    user.change_password(data["password"])
    db.session.add(user)
    db.session.commit()
    return {"msg": "Password updated"}, 200


@bp.route("/edit_profile", methods=["PATCH"])
@auth_required
def edit_profile():
    """
    Can update only `first_name`, `last_name`, `image_url`, `address`,
    `address`, `city`, `state`, `zip_code`

    """
    data = request.get_json()
    user_id = session["id"]
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return {}, 404
    for key, value in data.items():
        if key == "us_state":
            key = "state"
        setattr(user, key, value)
    db.session.add(user)
    db.session.commit()
    return {"msg": "Profile updated"}, 200


@bp.route("/edit_username", methods=["PATCH"])
@reauth_required
def edit_username():
    data = request.get_json()
    user_id = session["id"]
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return {}, 404
    username = data["username"]
    if User.query.filter_by(username=username).first():
        return {"error": f"The user with username {username} already exists"}, 409
    user.username = username
    db.session.add(user)
    db.session.commit()
    return {"msg": "Username updated"}, 200


@bp.route("/edit_profile_address", methods=["PATCH"])
@auth_required
def edit_profile_address():
    data = request.get_json()
    user_id = session["id"]
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return {}, 404
    new_profile_addr = data["profile_addr"]
    if User.query.filter_by(profile_addr=new_profile_addr).first():
        return {"error": f"This address already exists"}, 409
    user.profile_addr = new_profile_addr
    db.session.add(user)
    db.session.commit()
    return {"msg": "Profile address updated"}, 200


@bp.route("/request_change_email", methods=["POST"])
@reauth_required
def edit_email():
    data = request.get_json()
    user_id = session["id"]
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return {}, 404
    now = datetime.utcnow()
    time_diff = now - user.confirm_email_sent
    if time_diff.seconds < 14400:
        return {"error": f"Sorry, you can resend request in {(14400 - time_diff.seconds) // 60} minutes"}, 406
    new_email = data["new_email"]
    if User.query.filter_by(email=new_email).first():
        return {"error": f"The user with email {new_email} already exists"}, 409
    email_token = ts.dumps([new_email, user.email], salt="email-change")
    confirm_url = url_for(".change_email", token=email_token, _external=True)
    subject = "InstaHarvest email change verification"
    send_email(new_email, subject, "confirmation_email",
               user=user, confirm_url=confirm_url)

    subject = "InstaHarvest email change notification"
    send_email(user.email, subject, "change_email_notification",
               user=user, new_email=new_email)
    user.confirm_email_sent = now
    db.session.add(user)
    db.session.commit()
    return {"msg": f"A confirmation e-mail was sent to your {new_email} address. Please follow the instructions in the e-mail to confirm your new email"}, 200


@bp.route("/confirm/<token>")
def change_email(token):
    try:
        new_email, old_email = ts.loads(
            token, salt="email-change", max_age=86400)
    except:
        return redirect(f"{Config.BASE_URL}/404", code=302)

    user = User.query.filter_by(email=old_email).first()
    if user is None:
        redirect(f"{Config.BASE_URL}/404", code=302)
    user.email = new_email
    db.session.add(user)
    db.session.commit()

    return redirect(f"{Config.BASE_URL}/profile", code=302)


# @bp.route("/files")
# def files():
#     s3_resource = boto3.resource("s3")
#     my_bucket = s3_resource.Bucket(Config.S3_BUCKET_NAME)
#     summaries = my_bucket.objects.all()
#     for o in summaries:
#         print(o.key)
#     return {"message": "bucket printed successfully"}, 200


@bp.route("/update_profile_image_file", methods=["POST"])
@auth_required
def edit_profile_image_file():
    user_id = session["id"]
    file = request.files["file"]

    file.filename = f"{user_id}_image_url.{file.filename.split('.')[-1]}"
    s3_resource = boto3.resource("s3")
    my_bucket = s3_resource.Bucket(Config.S3_BUCKET_NAME)
    my_bucket.Object(file.filename).put(Body=file, ACL="public-read")
    user = User.query.filter(User.id == user_id).first()
    if user is None:
        return {}, 404
    user.image_url = f"https://instaharvest.s3.us-east-2.amazonaws.com/{my_bucket.Object(file.filename).key}"
    db.session.add(user)
    db.session.commit()
    return {"message": "Image uploaded",
            "image_url": user.image_url}, 200


@bp.route("/update_profile_image_url", methods=["POST"])
@auth_required
def edit_profile_image_url():
    user_id = session["id"]
    image_url = request.json.get("url")
    user = User.query.filter(User.id == user_id).first()
    if user is None:
        return {}, 404
    user.image_url = image_url
    db.session.add(user)
    db.session.commit()
    return {"message": "Image url saved",
            "image_url": user.image_url}, 200


@bp.route("/delete_profile_image", methods=["POST"])
@auth_required
def delete_profile_image():
    user_id = session["id"]
    user = User.query.filter(User.id == user_id).first()
    if user is None:
        return {}, 404

    user.image_url = Config.PROFILE_IMAGE
    db.session.add(user)
    db.session.commit()

    return {"message": "Image deleted",
            "image_url": user.image_url}, 200


@bp.route("/update_back_image_file", methods=["POST"])
@auth_required
def edit_back_image_file():
    user_id = session["id"]
    file = request.files["file"]
    file.filename = f"{user_id}_image_back_url.{file.filename.split('.')[-1]}"
    s3_resource = boto3.resource("s3")
    my_bucket = s3_resource.Bucket(Config.S3_BUCKET_NAME)
    my_bucket.Object(file.filename).put(Body=file, ACL="public-read")
    user = User.query.filter(User.id == user_id).first()
    if user is None:
        return {}, 404
    user.image_back_url = f"https://instaharvest.s3.us-east-2.amazonaws.com/{my_bucket.Object(file.filename).key}"
    db.session.add(user)
    db.session.commit()
    return {"message": "Image uploaded",
            "image_back_url": user.image_back_url}, 200


@bp.route("/update_back_image_url", methods=["POST"])
@auth_required
def edit_back_image_url():
    user_id = session["id"]
    image_back_url = request.json.get("url")
    user = User.query.filter(User.id == user_id).first()
    if user is None:
        return {}, 404
    user.image_back_url = image_back_url
    db.session.add(user)
    db.session.commit()
    return {"message": "Image url saved",
            "image_back_url": user.image_back_url}, 200


@bp.route("/delete_back_image", methods=["POST"])
@auth_required
def delete_back_image():
    user_id = session["id"]
    user = User.query.filter(User.id == user_id).first()
    if user is None:
        return {}, 404

    user.image_back_url = Config.PROFILE_BACK_IMAGE
    db.session.add(user)
    db.session.commit()

    return {"message": "Image deleted",
            "image_back_url": user.image_back_url}, 200
