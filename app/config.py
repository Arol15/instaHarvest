import os


class Config(object):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    # or /
    # "postgresql://instaharvest_user:harvest@localhost/instaharvest_db"
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = 60
    MAIL_PASSWORD = os.environ.get('GMAIL_PASS')
    MAIL_USERNAME = os.environ.get('GMAIL_USERNAME')
    MAIL_SERVER = 'smtp.googlemail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    SEND_CONFIRM_EMAIL = False
