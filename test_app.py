import os
import tempfile
import pytest
from app import create_app, db
from app.config import Config
from app.models import User
from flask import Flask, session, current_app
from datetime import datetime, timedelta


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = Config.DATABASE_TEST
    SEND_CONFIRM_EMAIL = False


USER1 = "test"
EMAIL1 = "test@test.com"
USER2 = "test2"
EMAIL2 = "test2@test.com"
PASSWORD = "123456"


@pytest.fixture
def client():
    app = create_app(TestConfig)
    app_context = app.app_context()
    app_context.push()
    db.create_all()
    user = User(username=USER1,
                first_name="Name1",
                password="123456",
                email=EMAIL1,
                email_verified=False,
                image_url=app.config["PROFILE_IMAGE"],
                image_back_url=app.config["PROFILE_BACK_IMAGE"],
                state="California",
                city="Fremont",
                profile_addr="profile-address",
                confirm_email_sent=datetime.utcnow())
    db.session.add(user)
    db.session.commit()

    with app.test_client() as client:
        yield client

    db.session.remove()
    db.drop_all()
    app_context.pop()


def login(client, login, password):
    return client.post("/api/auth/login", json={"login": login, "password": password})


def logout(client):
    return client.post("/api/auth/logout")


def signup(client, username, email, password):
    return client.post('/api/auth/signup', json={"email": email,
                                                 "password": password,
                                                 "username": username,
                                                 "first_name": "Name2",
                                                 "state": "California",
                                                 "city": "Fremont"})


def get_date():
    return str(datetime.utcnow())[:10]

# Auth tests


def test_signup(client):
    # Correct signup
    rv = signup(client, USER2, EMAIL2, PASSWORD)
    resp = rv.get_json()
    assert get_date() in resp["created_at"]
    assert resp["city"] == "Fremont"
    assert resp["email_verified"] == False
    assert resp["first_name"] == "Name2"
    assert resp["image_back_url"] == current_app.config["PROFILE_BACK_IMAGE"]
    assert resp["image_url"] == current_app.config["PROFILE_IMAGE"]
    assert resp["us_state"] == "California"

    # Existing username
    rv = signup(client, USER2, "user3@test.com", PASSWORD)
    assert int(rv.status[:3]) == 409
    assert rv.get_json()[
        "error"] == f"The user with username {USER2} already exists"

    # Existing email
    rv = signup(client, "user3", EMAIL2, PASSWORD)
    assert int(rv.status[:3]) == 409
    assert rv.get_json()[
        "error"] == f"The user with email {EMAIL2} already exists"


def test_login_logout(client):
    # Existing user, wrong password
    rv = login(client, USER1, "123")
    assert int(rv.status[:3]) == 401
    assert rv.get_json()["error"] == "Wrong password"

    # Wrong username
    rv = login(client, "user3", PASSWORD)
    assert int(rv.status[:3]) == 401
    assert rv.get_json()[
        "error"] == "The user with username user3 does not exist"

    # Wrong email
    rv = login(client, "user3@test.com", PASSWORD)
    assert int(rv.status[:3]) == 401
    assert rv.get_json()[
        "error"] == "The user with email user3@test.com does not exist"

    # Existing user, login with username, correct password
    rv = login(client, USER1, PASSWORD)
    resp = rv.get_json()
    assert int(rv.status[:3]) == 200
    assert get_date() in resp["created_at"]
    assert resp["city"] == "Fremont"
    assert resp["email_verified"] == False
    assert resp["first_name"] == "Name1"
    assert resp["image_back_url"] == current_app.config["PROFILE_BACK_IMAGE"]
    assert resp["image_url"] == current_app.config["PROFILE_IMAGE"]
    assert resp["us_state"] == "California"
    assert session["id"] == 1

    # Logout
    rv = logout(client)
    assert int(rv.status[:3]) == 200
    assert session.get('id', False) == False

    # Existing user, login with email, correct password
    rv = login(client, EMAIL1, PASSWORD)
    resp = rv.get_json()
    assert int(rv.status[:3]) == 200
    assert get_date() in resp["created_at"]
    assert resp["city"] == "Fremont"
    assert resp["email_verified"] == False
    assert resp["first_name"] == "Name1"
    assert resp["image_back_url"] == current_app.config["PROFILE_BACK_IMAGE"]
    assert resp["image_url"] == current_app.config["PROFILE_IMAGE"]
    assert resp["us_state"] == "California"
    assert session["id"] == 1


def test_reset_password(client):
    rv = client.post("/api/auth/reset_password",
                     json={"email": "user3@test.com"})
    assert int(rv.status[:3]) == 401
    assert rv.get_json()[
        "error"] == "The user with email user3@test.com does not exist"

    rv = client.post('/api/auth/reset_password', json={"email": EMAIL1})
    assert int(rv.status[:3]) == 200
    assert rv.get_json()[
        "msg"] == "A reset password email has been sent"


def test_resend_email(client):
    login(client, USER1, PASSWORD)
    rv = client.post("/api/auth/resend_email")
    assert int(rv.status[:3]) == 406
    resp = rv.get_json()[
        "error"]
    assert "Sorry, you can resend confirmation email in" in resp

# Account tests


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
    assert resp["us_state"] == "California"
    assert resp["city"] == "Fremont"
    assert resp["zip_code"] == 0
    assert resp["address"] == None
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
    assert resp["us_state"] == "California"
    assert resp["city"] == "Fremont"


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
        "image_back_url": "new-image-back-url",
        "address": "new-address",
        "city": "new-city",
        "us_state": "Texas",
        "zip_code": 94555}

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
