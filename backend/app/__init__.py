from flask import Flask
from flask_migrate import Migrate


from config import Config
from app.models import db

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
migrate = Migrate(app, db)

from app.routes import users

app.register_blueprint(users.bp)