from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from config import Config

db = SQLAlchemy()

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
migrate = Migrate(app, db)

from app.routes import users
from app.routes import auth

app.register_blueprint(users.bp)
app.register_blueprint(auth.bp)
