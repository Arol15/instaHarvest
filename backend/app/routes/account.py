import json
from flask import Blueprint, request
from flask_jwt_extended import (fresh_jwt_required, get_jwt_identity,
                                jwt_required)
from app.models import db, User
from app.utils.security import ts, admin_required
from app.utils.email_support import send_email

bp = Blueprint('account', __name__, url_prefix='/api/account')


@bp.route('/change_pass', methods=['PATCH'])
@fresh_jwt_required
def change_pass():
    data = request.get_json()
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first_or_404()
    user.change_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return {'msg': 'Password updated'}, 200


@bp.route('/edit_profile', methods=['PATCH'])
@jwt_required
def edit_profile():
    """
    Can update only `first_name`, `last_name`, `image_url`
    """
    data = request.get_json()
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first_or_404()
    for key, value in data.items():
        setattr(user, key, value)
    db.session.add(user)
    db.session.commit()
    return {'msg': 'Profile updated'}, 200


@bp.route('/edit_username', methods=['PATCH'])
@fresh_jwt_required
def edit_username():
    data = request.get_json()
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first_or_404()
    username = data['username']
    if User.query.filter_by(username=username).first():
        return {'msg': f'The user with username {username} already exists'}, 409
    user.username = username
    db.session.add(user)
    db.session.commit()
    return {'msg': 'Username updated'}, 200
