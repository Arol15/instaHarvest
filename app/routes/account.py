import logging
import os
from datetime import datetime
from flask import Blueprint, request, url_for, session, current_app, redirect
from app import db
from app.models import User, Address
from app.utils.security import ts, auth_required
from app.utils.email_support import send_email
from app.utils.security import auth_required, reauth_required
from app.utils.image import save_image

bp = Blueprint("account", __name__)


@bp.route("/get_profile_private", methods=["POST"])
@auth_required
def get_profile():
    user_id = session["id"]
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return {}, 404
    res = user.to_dict_private()
    return res, 200


@bp.route("/get_user_addresses", methods=["POST"])
@auth_required
def get_user_addresses():
    user_id = session["id"]
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return {}, 404
    addresses = user.addresses.all()
    addr_list = [address.to_dict() for address in addresses]
    return {"msg": "addresses",  "list": addr_list}, 200


@bp.route("/edit_user_address", methods=["POST", "DELETE", "PATCH"])
@auth_required
def edit_user_address():
    user_id = session["id"]
    data = request.get_json()

    if request.method == "POST":
        lon = data["lon"]
        lat = data["lat"]
        user = User.query.filter_by(id=user_id).first()
        if user is None:
            return {}, 404
        address = user.addresses.filter_by(
            lon=lon, lat=lat).first()
        if address:
            return {"error": "Address already exists"}, 409
        address = Address(user_id=user_id,
                          primary_address=False,
                          state=data["state"],
                          city=data["city"],
                          country=data["country"],
                          lat=lat,
                          lon=lon,
                          address=data["address"],
                          zip_code=data["zip_code"] if data["zip_code"] else None)
        db.session.add(address)
        db.session.commit()
        address_id = address.id
        return {
            "msg": "Address has been added",
            "address_id": address_id
        }, 201

    if request.method == "DELETE":
        address_id = data["address_id"]
        address = Address.query.filter_by(id=address_id).first()
        if user_id != address.user_id:
            return {}, 403
        n_products = address.products.count()
        if n_products > 0:
            return {"error": f"You can not delete this address. You have {n_products} product{'s' if n_products > 1 else ''} connected to it."}, 404
        db.session.delete(address)
        db.session.commit()
        return {"msg": "Address has been deleted"}, 200

    if request.method == "PATCH":
        address_id = data["address_id"]
        address = Address.query.filter_by(id=address_id).first()
        if user_id != address.user_id:
            return {}, 403
        prev_prim_address = address.user.addresses.filter_by(
            primary_address=True).first()
        if prev_prim_address is None:
            return {}, 404
        prev_prim_address.primary_address = False
        address.primary_address = True
        db.session.add(prev_prim_address)
        db.session.add(address)
        db.session.commit()
        return {"msg": "Primary address has been changed"}, 200


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
    Can update only `first_name`, `last_name`
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
        return redirect(f"{current_app.config['BASE_URL']}/404", code=302)

    user = User.query.filter_by(email=old_email).first()
    if user is None:
        return redirect(f"{current_app.config['BASE_URL']}/404", code=302)
    user.email = new_email
    db.session.add(user)
    db.session.commit()

    return redirect(f"{current_app.config['BASE_URL']}/profile", code=302)


@bp.route("/edit_profile_image", methods=["POST", "DELETE"])
@auth_required
def edit_profile_image():
    user_id = session["id"]
    user = User.query.filter_by(id=user_id).first()
    if request.method == "POST":
        uploaded_file = request.files.getlist("file")[0]

        image_url = save_image(uploaded_file, user.uuid,
                               "profile_img")
        if image_url == "NOT_ALLOWED":
            return {"error": "Uploaded file has not allowed format"}, 404
        elif image_url == "NOT_SAVED":
            return {"error": "Something went wrong. Uploaded image has not been saved"}, 404
        user.image_url = image_url
        db.session.add(user)
        db.session.commit()
        return {"msg": "Image uploaded",
                "image_url": user.image_url}, 200

    elif request.method == "DELETE":
        url = user.image_url
        path = os.path.join(
            current_app.config["USERS_FOLDER"], user.uuid, url.split('/')[-1])
        try:
            os.remove(path)
        except:
            logging.warning(
                f"File {url.split('/')[-1]} in folder {user.uuid} has not been deleted")
        user.image_url = current_app.config['PROFILE_IMAGE']

        db.session.add(user)
        db.session.commit()
        return {"msg": "Image deleted",
                "image_url": user.image_url}, 200


@bp.route("/edit_back_image", methods=["POST", "DELETE"])
@auth_required
def edit_back_image():
    user_id = session["id"]
    user = User.query.filter_by(id=user_id).first()

    if request.method == "POST":
        uploaded_file = request.files.getlist("file")[0]

        image_url = save_image(uploaded_file, user.uuid,
                               "profile_back_img", base_width=2000)
        if image_url == "NOT_ALLOWED":
            return {"error": "Uploaded file has not allowed format"}, 404
        elif image_url == "NOT_SAVED":
            return {"error": "Something went wrong. Uploaded image has not been saved"}, 404

        user.image_back_url = image_url
        db.session.add(user)
        db.session.commit()

        return {"msg": "Image uploaded",
                "image_back_url": user.image_back_url}, 200

    elif request.method == "DELETE":
        url = user.image_back_url
        path = os.path.join(
            current_app.config["USERS_FOLDER"], user.uuid, url.split('/')[-1])
        try:
            os.remove(path)
        except:
            pass

        user.image_back_url = current_app.config['PROFILE_BACK_IMAGE']
        db.session.add(user)
        db.session.commit()

        return {"msg": "Image deleted",
                "image_back_url": user.image_back_url}, 200
