import json
from flask import Blueprint, request
from app import db
from app.models import User

bp = Blueprint("users", __name__)


# @bp.route("")
# def users():
#     users = User.query.all()
#     users = [user.to_dict() for user in users]
#     return {"users": users}
