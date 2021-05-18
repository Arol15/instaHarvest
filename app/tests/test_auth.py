import pytest
from app import create_app, db
from app.models import User
from flask import Flask, session, current_app
from datetime import datetime, timedelta
from .config import *
import os


def assert_auth(resp, user):
    assert resp["first_name"] == user["first_name"]
    assert resp["image_url"] == current_app.config["PROFILE_IMAGE"]
    assert resp["image_back_url"] == current_app.config["PROFILE_BACK_IMAGE"]
    assert resp["city"] == user["city"]
    assert resp["country"] == user["country"]
    assert resp["us_state"] == user["state"]
    assert resp["email_verified"] == False
    assert get_date() in resp["created_at"]


def test_signup(client):
    # Correct signup
    user = USERS["user2"].copy()
    rv = client.post('/api/auth/signup', json=user)
    resp = rv.get_json()
    assert int(rv.status[:3]) == 201
    assert_auth(resp, user)

    # Existing username
    new_user = USERS["user3"].copy()
    new_user["username"] = user["username"]
    rv = signup(client, new_user)
    assert int(rv.status[:3]) == 409
    assert rv.get_json()[
        "error"] == f"The user with username {user['username']} already exists"

    # Existing email
    new_user = USERS["user3"].copy()
    new_user["email"] = user["email"]
    rv = signup(client, new_user)
    assert int(rv.status[:3]) == 409
    assert rv.get_json()[
        "error"] == f"The user with email {user['email']} already exists"


def test_login_logout(client):
    user = USERS["user1"]
    # Existing user, wrong password
    rv = login(client, user["username"], "123")
    assert int(rv.status[:3]) == 401
    assert rv.get_json()["error"] == "Wrong password"

    # Wrong username
    rv = login(client, "wrong", "123")
    assert int(rv.status[:3]) == 401
    assert rv.get_json()[
        "error"] == "The user with username wrong does not exist"

    # Wrong email
    rv = login(client, "wrong@mail.com", "1234")
    assert int(rv.status[:3]) == 401
    assert rv.get_json()[
        "error"] == "The user with email wrong@mail.com does not exist"

    # Existing user, login with username, correct password
    rv = login(client, user["username"], user["password"])
    resp = rv.get_json()
    assert int(rv.status[:3]) == 200
    assert_auth(resp, user)
    assert session["id"] == 1

    # Logout
    rv = logout(client)
    assert int(rv.status[:3]) == 200
    assert session.get('id', False) == False

    # Existing user, login with email, correct password
    rv = login(client, user["email"], user["password"])
    resp = rv.get_json()
    assert int(rv.status[:3]) == 200
    assert_auth(resp, user)
    assert session["id"] == 1


def test_reset_password(client):
    user3 = USERS["user3"]
    user1 = USERS["user1"]
    rv = client.post("/api/auth/reset_password",
                     json={"email": user3["email"]})
    assert int(rv.status[:3]) == 401
    assert rv.get_json()[
        "error"] == f"The user with email {user3['email']} does not exist"

    rv = client.post('/api/auth/reset_password',
                     json={"email": user1["email"]})
    assert int(rv.status[:3]) == 200
    assert rv.get_json()[
        "msg"] == "A reset password email has been sent"


def test_resend_email(client):
    user = USERS["user1"]
    login(client, user["username"], user["password"])
    rv = client.post("/api/auth/resend_email")
    assert int(rv.status[:3]) == 406
    resp = rv.get_json()[
        "error"]
    assert "Sorry, you can resend confirmation email in" in resp


def test_confirm_email(client):
    rv = client.get("/api/auth/confirm/token")
    assert int(rv.status[:3]) == 302
