import json
from uuid import uuid4
from flask import Blueprint, request, url_for
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required, fresh_jwt_required,
                                jwt_refresh_token_required, get_jwt_identity,
                                get_jwt_claims)
from app import jwt, db
from app.models import User
from app.utils.security import ts, admin_required
from app.utils.email_support import send_email


bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    for key, value in data.items():
        if not value:
            data[key] = None
    email = data['email']
    username = data['username']
    image_url = request.json.get('image_url', None)
    if User.query.filter_by(email=email).first():
        return {'error': f'The user with email {email} already exists'}, 409
    if username and User.query.filter_by(username=username).first():
        return {'error': f'The user with username {username} already exists'}, 409
    if not image_url:
        image_url = 'https://img.icons8.com/doodle/148/000000/test-account.png'
    email_verified = False
    profile_addr = str(uuid4())[:13]

    user = User(username=username,
                first_name=data['first_name'],
                last_name=data['last_name'],
                password=data['password'],
                email=email,
                email_verified=email_verified,
                image_url=image_url,
                user_role=data['user_role'],
                address=data['address'],
                lgt=data['lgt'],
                lat=data['lat'],
                state=data['state'],
                city=data['city'],
                zip_code=data['zip_code'],
                profile_addr=profile_addr)

    db.session.add(user)
    db.session.commit()
    claims = {'roles': user.user_role}
    access_token = create_access_token(
        identity=user.id, user_claims=claims, fresh=True)
    refresh_token = create_refresh_token(user.id, user_claims=claims)

    # Send confirmation email
    email_token = ts.dumps(email, salt='email-confirm')
    confirm_url = url_for('.confirm_email', token=email_token, _external=True)
    subject = "InstaHarvest - Confirm your account"
    send_email(email, subject, 'confirmation_email',
               user=user, confirm_url=confirm_url)
    return {'access_token': access_token,
            'refresh_token': refresh_token}, 201


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    login = data['login']
    if '@' in login:
        user = User.query.filter_by(email=login).first()
        if not user:
            return {'error': f'The user with email {login} does not exist'}, 401
    else:
        user = User.query.filter_by(username=login).first()
        if not user:
            return {'error': f'The user with username {login} does not exist'}, 401
    if user.check_password(data['password']):
        claims = {'roles': user.user_role}
        access_token = create_access_token(
            identity=user.id, user_claims=claims, fresh=True)
        refresh_token = create_refresh_token(user.id, user_claims=claims)
    else:
        return {'error': 'Wrong password'}, 401
    return {'access_token': access_token,
            'refresh_token': refresh_token}, 200


@bp.route('/resend_email', methods=['POST'])
@jwt_required
def resend_email():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first_or_404()
    email = user.email
    email_token = ts.dumps(email, salt='email-confirm')
    confirm_url = url_for('.confirm_email', token=email_token, _external=True)
    subject = "InstaHarvest - Confirm your account"
    send_email(email, subject, 'confirmation_email',
               user=user, confirm_url=confirm_url)
    return {}, 200


@bp.route('/confirm/<token>')
def confirm_email(token):
    try:
        email = ts.loads(token, salt="email-confirm", max_age=86400)
    except:
        return {}, 404

    user = User.query.filter_by(email=email).first_or_404()
    user.email_verified = True
    db.session.add(user)
    db.session.commit()
    return {'msg': 'Email confirmed'}, 200


@bp.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    """
    Insures a valid refresh token is present and creates
    a new access token marked as `non_fresh`
    """
    user_id = get_jwt_identity()
    claims = get_jwt_claims()
    new_token = create_access_token(
        identity=user_id, user_claims=claims, fresh=False)
    return {'access_token': new_token}, 200


@bp.route('/protected', methods=['POST'])
@jwt_required
def protected():
    return {'message': 'Hello'}


@bp.route('/fresh-protected', methods=['POST'])
@fresh_jwt_required
def fresh_protected():
    return {'message': 'Hello'}


@bp.route('/admin', methods=['POST'])
@admin_required
def admin():
    return {'message': 'Hello admin'}
