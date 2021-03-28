from flask import Flask, session
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from flask_mail import Mail
from app.config import Config
from logging.config import dictConfig
import boto3

db = SQLAlchemy()
migrate = Migrate()
mail = Mail()
session = Session()


def create_app(config_class=Config):

    app = Flask(__name__, static_folder='../build', static_url_path='/')
    app.config.from_object(Config)

    dictConfig({
        'version': 1,
        'formatters': {'default': {
            'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
        }},
        'handlers': {
            'default': {
                'class': 'logging.StreamHandler',
                'formatter': 'default',
                'level': 'INFO'
            },
            'toFile': {
                'level': 'INFO',
                'class': 'logging.handlers.RotatingFileHandler',
                'formatter': 'default',
                'filename': 'errors.log',
                'maxBytes': 1024 * 1000,
                'backupCount': 20
            }
        },
        'root': {
            'handlers': ['toFile']
        }
    })

    s3_resource = boto3.resource(
        "s3",
        aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY
    )

    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    session.init_app(app)
    app.secret_key = Config.SECRET_KEY

    @app.route('/')
    def index():
        return app.send_static_file("index.html")

    @app.errorhandler(404)
    def not_found(e):
        return app.send_static_file("index.html")

    from app.routes import users, auth, account, chat, products
    app.register_blueprint(users.bp, url_prefix='/api/users')
    app.register_blueprint(auth.bp, url_prefix='/api/auth')
    app.register_blueprint(account.bp, url_prefix='/api/account')
    app.register_blueprint(products.bp, url_prefix='/api/products')
    app.register_blueprint(chat.bp, url_prefix='/api/chat')

    return app
