from flask import Blueprint, request
from app.models import db, User
# from flask import jsonify
import json

bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp.route('/signup', methods=['POST'])
def signup():
    data = json.loads(request.get_data().decode('UTF-8'))
    email = data['email']
    username = data['username']
    if User.query.filter_by(email=email).first():
        return {'error': f'The user with email {email} already exists'}, 409
    if username and User.query.filter_by(username=username).first():
        return {'error': f'The user with username {username} already exists'}, 409
    first_name = data['first_name']
    last_name = data['last_name']
    password = data['password']
    if data['image_url']:
        image_url = data['image_url']
    else:
        image_url = None
    email_verified = False
    user = User(username=username, first_name=first_name, last_name=last_name,
                hashed_password=password, email=email, email_verified=email_verified, image_url=image_url)
    db.session.add(user)
    db.session.commit()
    return {'email': email}, 201


@bp.route('/login', methods=['GET'])
def login():
    return {'username': 'user.username'}, 200
