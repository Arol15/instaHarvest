from app.config import Config
import pytest
from app import create_app, db
from app.models import User
from datetime import datetime


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = Config.DATABASE_TEST
    SEND_CONFIRM_EMAIL = False


USER1 = "test"
EMAIL1 = "test@test.com"
USER2 = "test2"
EMAIL2 = "test2@test.com"
USER3 = "test3"
EMAIL3 = "test3@test.com"
PASSWORD = "123456"


@pytest.fixture
def client():
    app = create_app(TestConfig)
    app_context = app.app_context()
    app_context.push()
    db.drop_all()
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
