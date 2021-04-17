import pytest
from app import create_app, db
from app.models import User
from flask import Flask, session, current_app
from datetime import datetime, timedelta
from .config import *


def test_get_profile_private(client):
    login(client, USER1, PASSWORD)
    rv = client.post("/api/account/get_profile_private")
    resp = rv.get_json()
    assert resp["username"] == USER1
    assert resp["first_name"] == "Name1"
    assert resp["last_name"] == None
    assert resp["image_url"] == current_app.config["PROFILE_IMAGE"]
    assert resp["image_back_url"] == current_app.config["PROFILE_BACK_IMAGE"]
    assert resp["email"] == EMAIL1
    assert resp["profile_addr"] == "profile-address"
    assert resp["email_verified"] == False
    assert resp["us_state"] == "Texas"
    assert resp["city"] == "Austin"
    assert resp["zip_code"] == None
    assert resp["address"] == ""
    assert get_date() in resp["created_at"]


def test_get_profile_public(client):
    rv = client.get("/api/account/profile-address")
    resp = rv.get_json()
    assert resp["first_name"] == "Name1"
    assert resp["image_url"] == current_app.config["PROFILE_IMAGE"]
    assert resp["profile_addr"] == "profile-address"
    assert resp["image_back_url"] == current_app.config["PROFILE_BACK_IMAGE"]
    assert resp["email_verified"] == False
    assert get_date() in resp["created_at"]
    assert resp["us_state"] == "Texas"
    assert resp["city"] == "Austin"


def test_change_pass(client):
    login(client, USER1, PASSWORD)

    # Password change with the same password
    rv = client.patch("/api/account/change_pass", json={"password": PASSWORD})
    assert int(rv.status[:3]) == 404
    assert rv.get_json()[
        "error"] == "New password can't be the same as an old one"

    # Password change with a new password
    rv = client.patch("/api/account/change_pass", json={"password": "abc"})
    assert int(rv.status[:3]) == 200
    assert rv.get_json()[
        "msg"] == "Password updated"

    logout(client)

    # Login with an old password
    rv = login(client, USER1, PASSWORD)
    assert int(rv.status[:3]) == 401

    # Login with a new passowrd
    rv = login(client, USER1, "abc")
    assert int(rv.status[:3]) == 200


def test_edit_profile(client):
    login(client, USER1, PASSWORD)
    profile_fields = {
        "first_name": "new-name",
        "last_name": "new-last-name",
        "image_url": "new-image-url",
        "image_back_url": "new-image-back-url"}

    for field, value in profile_fields.items():
        rv = client.patch("/api/account/edit_profile", json={field: value})
        assert int(rv.status[:3]) == 200
        assert rv.get_json()["msg"] == "Profile updated"

        rv = client.post("/api/account/get_profile_private")
        resp = rv.get_json()
        assert resp[field] == value


def test_edit_profile_address(client):
    login(client, USER1, PASSWORD)
    rv = client.patch("/api/account/edit_profile_address",
                      json={"profile_addr": "profile-address"})
    assert int(rv.status[:3]) == 409
    assert rv.get_json()["error"] == "This address already exists"
    rv = client.patch("/api/account/edit_profile_address",
                      json={"profile_addr": "new-profile-address"})
    assert int(rv.status[:3]) == 200
    assert rv.get_json()["msg"] == "Profile address updated"


def test_request_change_email(client):
    login(client, USER1, PASSWORD)
    rv = client.post("/api/account/request_change_email",
                     json={"new_email": "new-email@test.com"})
    resp = rv.get_json()["error"]
    assert int(rv.status[:3]) == 406
    assert "Sorry, you can resend request in" in resp

    # Change time of the confirmation email

    new_date = datetime.utcnow() - timedelta(hours=10)
    user = User.query.filter_by(id=session["id"]).first()
    user.confirm_email_sent = new_date
    db.session.add(user)
    db.session.commit()

    # Attempt to change email with the existing one
    rv = client.post("/api/account/request_change_email",
                     json={"new_email": EMAIL1})
    assert int(rv.status[:3]) == 409
    assert rv.get_json()[
        "error"] == f"The user with email {EMAIL1} already exists"

    # New unique email
    rv = client.post("/api/account/request_change_email",
                     json={"new_email": "new-email@test.com"})
    assert int(rv.status[:3]) == 200
    assert rv.get_json()[
        "msg"] == f"A confirmation e-mail was sent to your new-email@test.com address. Please follow the instructions in the e-mail to confirm your new email"


def test_update_delete_profile_image_url(client):
    login(client, USER1, PASSWORD)
    rv = client.post("/api/account/update_profile_image_url",
                     json={"url": "new-url"})
    resp = rv.get_json()
    assert int(rv.status[:3]) == 200
    assert resp["msg"] == "Image url saved"
    assert resp["image_url"] == "new-url"

    rv = client.post("/api/account/get_profile_private")
    resp = rv.get_json()
    assert resp["image_url"] == "new-url"

    # Test delete profile image
    rv = client.post("/api/account/delete_profile_image")
    resp = rv.get_json()
    assert int(rv.status[:3]) == 200
    assert resp["msg"] == "Image deleted"
    assert resp["image_url"] == current_app.config["PROFILE_IMAGE"]

    rv = client.post("/api/account/get_profile_private")
    resp = rv.get_json()
    assert resp["image_url"] == current_app.config["PROFILE_IMAGE"]


def test_update_delete_profile_back_image_url(client):
    login(client, USER1, PASSWORD)
    rv = client.post("/api/account/update_back_image_url",
                     json={"url": "new-url"})
    resp = rv.get_json()
    assert int(rv.status[:3]) == 200
    assert resp["msg"] == "Image url saved"
    assert resp["image_back_url"] == "new-url"

    rv = client.post("/api/account/get_profile_private")
    resp = rv.get_json()
    assert resp["image_back_url"] == "new-url"

    # Test delete profile back image
    rv = client.post("/api/account/delete_back_image")
    resp = rv.get_json()
    assert int(rv.status[:3]) == 200
    assert resp["msg"] == "Image deleted"
    assert resp["image_back_url"] == current_app.config["PROFILE_BACK_IMAGE"]

    rv = client.post("/api/account/get_profile_private")
    resp = rv.get_json()
    assert resp["image_back_url"] == current_app.config["PROFILE_BACK_IMAGE"]


# def test_upload_profile_image(client):


# def test_upload_profile_back_image(client):
