import pytest
from app import create_app, db
from app.models import User
from flask import Flask, session, current_app
from datetime import datetime, timedelta
from .config import *


def assert_address(props, user):
    assert props["user_id"] == 1
    assert props["address"] == user["address"]
    assert props["us_state"] == user["state"]
    assert props["city"] == user["city"]
    assert props["zip_code"] == user["zip_code"]
    assert props["country"] == user["country"]
    assert props["distance_km"] == None
    assert props["distance_mi"] == None


def test_get_profile_private(client):
    user = USERS["user1"]

    # Unauthorized
    rv = client.post("/api/account/get_profile_private")
    assert int(rv.status[:3]) == 401

    login(client, user["username"], user["password"])
    rv = client.post("/api/account/get_profile_private")
    resp = rv.get_json()

    assert int(rv.status[:3]) == 200
    assert resp["username"] == user["username"]
    assert resp["first_name"] == user["first_name"]
    assert resp["last_name"] == user["last_name"]
    assert resp["image_url"] == current_app.config["PROFILE_IMAGE"]
    assert resp["image_back_url"] == current_app.config["PROFILE_BACK_IMAGE"]
    assert resp["email"] == user["email"]
    assert resp["profile_addr"] == user["profile_addr"]
    assert resp["email_verified"] == False
    assert resp["us_state"] == user["state"]
    assert resp["city"] == user["city"]
    assert resp["country"] == user["country"]
    assert resp["zip_code"] == user["zip_code"]
    assert resp["address"] == user["address"]
    assert get_date() in resp["created_at"]


def test_user_addresses(client):
    user = USERS["user1"]
    user2 = USERS["user2"]
    # Unauthorized
    rv = client.post("/api/account/get_user_addresses")
    assert int(rv.status[:3]) == 401

    login(client, user["username"], user["password"])

    # Get user addresses
    rv = client.post("/api/account/get_user_addresses")
    resp = rv.get_json()
    assert int(rv.status[:3]) == 200
    assert resp["msg"] == "addresses"
    assert len(resp["list"]) == 1
    assert resp["list"][0]["type"] == "Point"
    props = resp["list"][0]["properties"]
    lon, lat = resp["list"][0]["coordinates"]
    assert lon == user["lon"]
    assert lat == user["lat"]
    assert props["id"] == 1
    assert props["user_id"] == 1
    assert props["primary_address"] == True
    assert_address(props, user)

    # Add existing address
    rv = client.post("/api/account/edit_user_address",
                     json={"lon": user["lon"], "lat": user["lat"]})
    resp = rv.get_json()
    assert int(rv.status[:3]) == 409
    assert resp["error"] == "Address already exists"

    # Add new address
    rv = client.post("/api/account/edit_user_address",
                     json=user2)
    resp = rv.get_json()
    assert int(rv.status[:3]) == 201
    assert resp["msg"] == "Address has been added"
    assert resp["address_id"] == 2

    # Get user addresses
    rv = client.post("/api/account/get_user_addresses")
    resp = rv.get_json()
    assert int(rv.status[:3]) == 200
    assert resp["msg"] == "addresses"
    assert len(resp["list"]) == 2
    assert resp["list"][0]["type"] == "Point"
    assert resp["list"][1]["type"] == "Point"
    props1 = resp["list"][0]["properties"]
    props2 = resp["list"][1]["properties"]
    lon1, lat1 = resp["list"][0]["coordinates"]
    lon2, lat2 = resp["list"][1]["coordinates"]
    assert lon1 == user["lon"]
    assert lat1 == user["lat"]
    assert lon2 == user2["lon"]
    assert lat2 == user2["lat"]
    assert props1["primary_address"] == True
    assert props2["primary_address"] == False
    assert props1["id"] == 1
    assert props1["user_id"] == 1
    assert props2["id"] == 2
    assert props2["user_id"] == 1
    assert_address(props, user)
    assert_address(props2, user2)

    # Delete address of another user
    user3 = USERS["user3"]
    signup(client, user3)
    rv = client.delete("/api/account/edit_user_address",
                       json={"address_id": 2})
    assert int(rv.status[:3]) == 403

    # Delete address
    login(client, user["username"], user["password"])
    rv = client.delete("/api/account/edit_user_address",
                       json={"address_id": 2})
    resp = rv.get_json()
    assert int(rv.status[:3]) == 200
    assert resp["msg"] == "Address has been deleted"

    rv = client.post("/api/account/get_user_addresses")
    resp = rv.get_json()
    assert int(rv.status[:3]) == 200
    assert resp["msg"] == "addresses"
    assert len(resp["list"]) == 1
    props = resp["list"][0]["properties"]
    lon, lat = resp["list"][0]["coordinates"]
    assert lon == user["lon"]
    assert lat == user["lat"]
    assert props["id"] == 1
    assert props["user_id"] == 1
    assert props["primary_address"] == True

    # Delete address with products

    # Edit address

# def test_get_profile_public(client):
#     rv = client.get("/api/account/profile-address")
#     resp = rv.get_json()
#     assert resp["first_name"] == "Name1"
#     assert resp["image_url"] == current_app.config["PROFILE_IMAGE"]
#     assert resp["profile_addr"] == "profile-address"
#     assert resp["image_back_url"] == current_app.config["PROFILE_BACK_IMAGE"]
#     assert resp["email_verified"] == False
#     assert get_date() in resp["created_at"]
#     assert resp["us_state"] == "Texas"
#     assert resp["city"] == "Austin"


# def test_change_pass(client):
#     login(client, USER1, PASSWORD)

#     # Password change with the same password
#     rv = client.patch("/api/account/change_pass", json={"password": PASSWORD})
#     assert int(rv.status[:3]) == 404
#     assert rv.get_json()[
#         "error"] == "New password can't be the same as an old one"

#     # Password change with a new password
#     rv = client.patch("/api/account/change_pass", json={"password": "abc"})
#     assert int(rv.status[:3]) == 200
#     assert rv.get_json()[
#         "msg"] == "Password updated"

#     logout(client)

#     # Login with an old password
#     rv = login(client, USER1, PASSWORD)
#     assert int(rv.status[:3]) == 401

#     # Login with a new passowrd
#     rv = login(client, USER1, "abc")
#     assert int(rv.status[:3]) == 200


# def test_edit_profile(client):
#     login(client, USER1, PASSWORD)
#     profile_fields = {
#         "first_name": "new-name",
#         "last_name": "new-last-name",
#         "image_url": "new-image-url",
#         "image_back_url": "new-image-back-url"}

#     for field, value in profile_fields.items():
#         rv = client.patch("/api/account/edit_profile", json={field: value})
#         assert int(rv.status[:3]) == 200
#         assert rv.get_json()["msg"] == "Profile updated"

#         rv = client.post("/api/account/get_profile_private")
#         resp = rv.get_json()
#         assert resp[field] == value


# def test_edit_profile_address(client):
#     login(client, USER1, PASSWORD)
#     rv = client.patch("/api/account/edit_profile_address",
#                       json={"profile_addr": "profile-address"})
#     assert int(rv.status[:3]) == 409
#     assert rv.get_json()["error"] == "This address already exists"
#     rv = client.patch("/api/account/edit_profile_address",
#                       json={"profile_addr": "new-profile-address"})
#     assert int(rv.status[:3]) == 200
#     assert rv.get_json()["msg"] == "Profile address updated"


# def test_request_change_email(client):
#     login(client, USER1, PASSWORD)
#     rv = client.post("/api/account/request_change_email",
#                      json={"new_email": "new-email@test.com"})
#     resp = rv.get_json()["error"]
#     assert int(rv.status[:3]) == 406
#     assert "Sorry, you can resend request in" in resp

#     # Change time of the confirmation email

#     new_date = datetime.utcnow() - timedelta(hours=10)
#     user = User.query.filter_by(id=session["id"]).first()
#     user.confirm_email_sent = new_date
#     db.session.add(user)
#     db.session.commit()

#     # Attempt to change email with the existing one
#     rv = client.post("/api/account/request_change_email",
#                      json={"new_email": EMAIL1})
#     assert int(rv.status[:3]) == 409
#     assert rv.get_json()[
#         "error"] == f"The user with email {EMAIL1} already exists"

#     # New unique email
#     rv = client.post("/api/account/request_change_email",
#                      json={"new_email": "new-email@test.com"})
#     assert int(rv.status[:3]) == 200
#     assert rv.get_json()[
#         "msg"] == f"A confirmation e-mail was sent to your new-email@test.com address. Please follow the instructions in the e-mail to confirm your new email"


# def test_update_delete_profile_image_url(client):
#     login(client, USER1, PASSWORD)
#     rv = client.post("/api/account/update_profile_image_url",
#                      json={"url": "new-url"})
#     resp = rv.get_json()
#     assert int(rv.status[:3]) == 200
#     assert resp["msg"] == "Image url saved"
#     assert resp["image_url"] == "new-url"

#     rv = client.post("/api/account/get_profile_private")
#     resp = rv.get_json()
#     assert resp["image_url"] == "new-url"

#     # Test delete profile image
#     rv = client.post("/api/account/delete_profile_image")
#     resp = rv.get_json()
#     assert int(rv.status[:3]) == 200
#     assert resp["msg"] == "Image deleted"
#     assert resp["image_url"] == current_app.config["PROFILE_IMAGE"]

#     rv = client.post("/api/account/get_profile_private")
#     resp = rv.get_json()
#     assert resp["image_url"] == current_app.config["PROFILE_IMAGE"]


# def test_update_delete_profile_back_image_url(client):
#     login(client, USER1, PASSWORD)
#     rv = client.post("/api/account/update_back_image_url",
#                      json={"url": "new-url"})
#     resp = rv.get_json()
#     assert int(rv.status[:3]) == 200
#     assert resp["msg"] == "Image url saved"
#     assert resp["image_back_url"] == "new-url"

#     rv = client.post("/api/account/get_profile_private")
#     resp = rv.get_json()
#     assert resp["image_back_url"] == "new-url"

#     # Test delete profile back image
#     rv = client.post("/api/account/delete_back_image")
#     resp = rv.get_json()
#     assert int(rv.status[:3]) == 200
#     assert resp["msg"] == "Image deleted"
#     assert resp["image_back_url"] == current_app.config["PROFILE_BACK_IMAGE"]

#     rv = client.post("/api/account/get_profile_private")
#     resp = rv.get_json()
#     assert resp["image_back_url"] == current_app.config["PROFILE_BACK_IMAGE"]


# def test_upload_profile_image(client):


# def test_upload_profile_back_image(client):
