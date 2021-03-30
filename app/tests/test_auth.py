import pytest
from app import create_app, db
from app.models import User
from flask import Flask, session, current_app
from datetime import datetime, timedelta
from .config import *


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
