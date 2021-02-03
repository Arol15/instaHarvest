from app import app
import json
# from sqlalchemy.orm import joinedload
from flask import Blueprint, request
from app.models import db, User
# from config import Config

bp = Blueprint("users", __name__, url_prefix='/api/users')


@bp.route("")
def users():
    users = User.query.all()
    users = [user.to_dict() for user in users]
    return {'users': users}
