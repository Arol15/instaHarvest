import unittest
from app.models import User


class PasswordHashingTest(unittest.TestCase):
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
