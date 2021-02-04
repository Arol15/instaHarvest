import json
from flask import Blueprint, request
from flask_jwt_extended import fresh_jwt_required, get_jwt_identity
from app.models import db, User

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
