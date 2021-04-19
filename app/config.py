import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))


class Config(object):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    DATABASE_TEST = os.environ.get('DATABASE_TEST')
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_PASSWORD = os.environ.get('GMAIL_PASS')
    MAIL_USERNAME = os.environ.get('GMAIL_USERNAME')
    MAIL_SERVER = 'smtp.googlemail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    SEND_CONFIRM_EMAIL = False
    BASE_URL = 'https://www.instaharvest.net'
    S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
    PROFILE_IMAGE = 'https://instaharvest.net/assets/images/profile_image.png'
    PROFILE_BACK_IMAGE = 'https://instaharvest.net/assets/images/profile_back_image.jpg'
    SESSION_TYPE = 'sqlalchemy'
    SESSION_PERMANENT = True
    SESSION_USE_SIGNER = True
    SESSION_SQLALCHEMY_TABLE = 'sessions'
    PERMANENT_SESSION_LIFETIME = 604800
    TESTING = False
