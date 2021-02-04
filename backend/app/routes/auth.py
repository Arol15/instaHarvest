from flask import Blueprint, request, url_for
from app.models import db, User
from app.utils.security import ts
# from flask import jsonify
import json

bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
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
                password=password, email=email, email_verified=email_verified, image_url=image_url)

    # Send confirmation email
    token = ts.dumps(email, salt='email-confirm')
    confirm_url = url_for('.confirm_email', token=token, _external=True)
    print(confirm_url)
    # send_email(email, confirm_url)

    db.session.add(user)
    db.session.commit()
    return {'email': email}, 201


@bp.route('/login', methods=['GET'])
def login():
    return {'username': 'user.username'}, 200


@bp.route('/confirm/<token>')
def confirm_email(token):
    try:
        email = ts.loads(token, salt="email-confirm", max_age=86400)
    except:
        return {'error': '404 Not Found'}, 404
    print(email)

    user = User.query.filter_by(email=email).first_or_404()
    user.email_verified = True
    db.session.add(user)
    db.session.commit()
    return {'email': email}, 200
