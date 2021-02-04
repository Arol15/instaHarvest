from app import app
import json
from flask import Blueprint, request
from app.models import db, User

bp = Blueprint('users', __name__, url_prefix='/api/users')


@bp.route('')
def users():
    users = User.query.all()
    users = [user.to_dict() for user in users]
    return {'users': users}
