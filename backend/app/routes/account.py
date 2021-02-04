from flask import Blueprint, request
from app.models import db, User
import json

bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp.route('/change_pass', methods=['PATCH'])
def change_pass(username):
    print(username)
    return {'response': 'OK'}
    # data = request.get_json()


@bp.route('/confirm')
