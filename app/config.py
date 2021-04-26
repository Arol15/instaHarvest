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
    SEND_CONFIRM_EMAIL = True
    BASE_URL = os.environ.get('BASE_URL')
    USERS_URL = os.environ.get('USERS_URL')
    PROFILE_IMAGE = 'https://instaharvest.net/assets/images/profile_image.png'
    PROFILE_BACK_IMAGE = 'https://instaharvest.net/assets/images/profile_back_image.jpg'
    SESSION_TYPE = 'sqlalchemy'
    SESSION_PERMANENT = True
    SESSION_USE_SIGNER = True
    SESSION_SQLALCHEMY_TABLE = 'sessions'
    PERMANENT_SESSION_LIFETIME = 604800
    TESTING = False
    RADIUS = 6372.795477598
    KM_TO_MI_FACTOR = 0.621371
    USERS_FOLDER = os.environ.get("USERS_FOLDER_PATH")
    IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".bmp", ".gif"]
