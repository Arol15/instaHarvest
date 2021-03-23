import os
from datetime import datetime, timedelta


class Config(object):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_PASSWORD = os.environ.get('GMAIL_PASS')
    MAIL_USERNAME = os.environ.get('GMAIL_USERNAME')
    MAIL_SERVER = 'smtp.googlemail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    SEND_CONFIRM_EMAIL = True
    BASE_URL = 'http://www.instaharvest.net'
    S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
    PROFILE_IMAGE = 'https://instaharvest.s3.us-east-2.amazonaws.com/profile_image.png'
    PROFILE_BACK_IMAGE = 'https://instaharvest.s3.us-east-2.amazonaws.com/profile_back_image.jpg'
    SESSION_TYPE = 'sqlalchemy'
    SESSION_PERMANENT = True
    SESSION_USE_SIGNER = True
    SESSION_SQLALCHEMY_TABLE = 'sessions'
    PERMANENT_SESSION_LIFETIME = 604800
