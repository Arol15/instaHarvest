from app.config import Config
import pytest
from app import create_app, db
from app.models import User, Address
from datetime import datetime
import os


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = Config.DATABASE_TEST
    SEND_CONFIRM_EMAIL = False
    USERS_FOLDER = Config.USERS_FOLDER_TEST


USERS = {
    "user1": {
        "email": "user1@mail.com",
        "password": "user1",
        "username": "user1",
        "first_name": "User1",
        "last_name": "User1LN",
        "profile_addr": "profile-addr1",
        "state": "Texas",
        "city": "Austin",
        "zip_code": 78741,
        "country": "USA",
        "lon": -97.7437,
        "lat": 30.2711,
        "address": "Address1",
    },
    "user2": {
        "email": "user2@mail.com",
        "password": "user2",
        "username": "user2",
        "first_name": "User2",
        "last_name": "User2LN",
        "profile_addr": "profile-addr2",
        "state": "New York",
        "city": "New York",
        "zip_code": 11000,
        "country": "USA",
        "lat": 40.7127837,
        "lon": -74.0059413,
        "address": "Address2",
    },
    "user3": {
        "email": "user3@mail.com",
        "password": "user3",
        "username": "user3",
        "first_name": "User3",
        "last_name": "User2LN",
        "profile_addr": "profile-addr3",
        "state": "California",
        "city": "Los Angeles",
        "zip_code": 94000,
        "country": "USA",
        "lat": 34.0522342,
        "lon": -118.2436849,
        "address": "Address3",
    },
    "user4": {
        "email": "user4@mail.com",
        "password": "user4",
        "username": "user4",
        "first_name": "User4",
        "last_name": "User4LN",
        "profile_addr": "profile-addr4",
        "state": "Illinois",
        "city": "Chicago",
        "zip_code": 60007,
        "country": "USA",
        "lat": 41.8781136,
        "lon": -87.6297982,
        "address": "Address4",
    }
}


@pytest.fixture
def client():
    app = create_app(TestConfig)
    app_context = app.app_context()
    app_context.push()
    db.drop_all()
    db.create_all()
    user_data = USERS["user1"]
    user = User(username=user_data["username"],
                first_name=user_data["first_name"],
                last_name=user_data["last_name"],
                password=user_data["password"],
                email=user_data["email"],
                email_verified=False,
                image_url=app.config["PROFILE_IMAGE"],
                image_back_url=app.config["PROFILE_BACK_IMAGE"],
                profile_addr=user_data["profile_addr"],
                confirm_email_sent=datetime.utcnow())
    db.session.add(user)
    db.session.commit()

    address = Address(user_id=user.id,
                      primary_address=True,
                      state=user_data["state"],
                      city=user_data["city"],
                      country=user_data["country"],
                      lat=user_data["lat"],
                      lon=user_data["lon"],
                      address=user_data["address"],
                      zip_code=user_data["zip_code"])
    db.session.add(address)
    db.session.commit()

    with app.test_client() as client:
        yield client

    db.session.remove()
    db.drop_all()
    app_context.pop()
    path_to_dir = app.config["USERS_FOLDER_TEST"]
    for f in os.listdir(path_to_dir):
        os.rmdir(os.path.join(path_to_dir, f))


def login(client, login, password):
    return client.post("/api/auth/login", json={"login": login, "password": password})


def logout(client):
    return client.post("/api/auth/logout")


def signup(client, user_data):
    return client.post('/api/auth/signup', json=user_data)


def get_date():
    return str(datetime.utcnow())[:10]
