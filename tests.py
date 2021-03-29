from datetime import datetime
import unittest
from app import create_app, db
from app.models import User
from app.config import Config
import time
import os


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = Config.DATABASE_TEST
    SEND_CONFIRM_EMAIL = False


class UserModelCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestConfig)
        self.app_context = self.app.app_context()
        self.app_context.push()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_password_setter(self):
        u = User(password="abc")
        self.assertTrue(u.hashed_password is not None)

    def test_password_verification(self):
        u = User(password='abc')
        self.assertTrue(u.check_password("abc"))
        self.assertFalse(u.check_password("Abc"))

    def test_passwords_are_random(self):
        u = User(password='abc')
        u2 = User(password='abc')
        self.assertTrue(u.hashed_password != u2.hashed_password)


if __name__ == '__main__':
    unittest.main(verbosity=2)
