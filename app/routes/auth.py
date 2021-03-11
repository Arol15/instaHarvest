import json
from uuid import uuid4
from datetime import datetime
from dateutil import tz
from flask import Blueprint, request, url_for, redirect
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required, fresh_jwt_required,
                                jwt_refresh_token_required, get_jwt_identity,
                                get_jwt_claims)
from app import jwt, db
from app.models import User
from app.utils.security import ts, admin_required
from app.utils.email_support import send_email
from app.config import Config


bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    # for key, value in data.items():
    #     if not value:
    #         data[key] = None
    email = data['email']
    username = request.json.get('username', None)
    image_url = 'https://w7.pngwing.com/pngs/748/359/png-transparent-orange-fruit-cartoon-orange-food-photography-orange.png'
    if User.query.filter_by(email=email).first():
        return {'error': f'The user with email {email} already exists'}, 409
    if username and User.query.filter_by(username=username).first():
        return {'error': f'The user with username {username} already exists'}, 409
    email_verified = False
    profile_addr = str(uuid4())[:13]
    now = datetime.now(tz=tz.tzlocal())

    user = User(username=username,
                first_name=data['first_name'],
                password=data['password'],
                email=email,
                email_verified=email_verified,
                image_url=image_url,
                state=data['state'],
                city=data['city'],
                profile_addr=profile_addr,
                confirm_email_sent=now)

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
            'refresh_token': refresh_token,
            'first_name': user.first_name,
            'image_url': user.image_url}, 201


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
            'refresh_token': refresh_token,
            'first_name': user.first_name,
            'image_url': user.image_url}, 200


@bp.route('/resend_email', methods=['POST'])
@jwt_required
def resend_email():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return {}, 404
    now = datetime.now(tz=tz.tzlocal())
    time_diff = now - user.confirm_email_sent
    if time_diff.seconds < 14400:
        return {'error': f'Sorry, you can resend confirmation email in {(14400 - time_diff.seconds) // 60} minutes'}, 406
    email = user.email
    email_token = ts.dumps(email, salt='email-confirm')
    confirm_url = url_for('.confirm_email', token=email_token, _external=True)
    subject = "InstaHarvest - Confirm your account"
    send_email(email, subject, 'confirmation_email',
               user=user, confirm_url=confirm_url)

    user.confirm_email_sent = now
    db.session.add(user)
    db.session.commit()
    return {'msg': 'Confirmation email has been sent'}, 200


@bp.route('/reset_password', methods=['POST'])
def reset_password():
    email = request.json.get('email')
    user = User.query.filter_by(email=email).first()
    if not user:
        return {'error': f'The user with email {email} does not exist'}, 401
    email_token = ts.dumps(email, salt='pass-reset')
    confirm_url = f'{Config.BASE_URL}/reset_password_confirm/{email_token}'
    subject = "InstaHarvest - Password Reset"
    send_email(email, subject, 'reset_password',
               user=user, confirm_url=confirm_url)
    return {'msg': 'Reset password email has been sent'}, 200


@bp.route('/confirm/<token>')
def confirm_email(token):
    try:
        email = ts.loads(token, salt="email-confirm", max_age=86400)
    except:
        redirect(f"{Config.BASE_URL}/404", code=302)

    user = User.query.filter_by(email=email).first()
    if not user:
        redirect(f"{Config.BASE_URL}/404", code=302)
    user.email_verified = True
    db.session.add(user)
    db.session.commit()
    return redirect(f"{Config.BASE_URL}/login", code=302)


@bp.route('/reset_password_confirm', methods=['POST'])
def reset_password_confirm():
    data = request.get_json()
    try:
        email = ts.loads(data['token'], salt="pass-reset", max_age=86400)
    except:
        return {'error': 'Token is not valid or expired'}, 406

    user = User.query.filter_by(email=email).first()
    if not user:
        return {'error': 'Can not find user'}, 404
    user.change_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return {'msg': 'New password saved'}, 200


@ bp.route('/refresh', methods=['POST'])
@ jwt_refresh_token_required
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


# @bp.route('/time/<id>', methods=['POST'])
# def time(id):
#     user = User.query.filter_by(id=id).first_or_404()
#     cr = user.created_at
#     print(cr)
#     # print(cr.strftime("%B %d, %Y"))
#     now = datetime.now(tz=tz.tzlocal())
#     print(now)
#     # print(cr.tzinfo)
#     # user.confirm_email_sent = now
#     # db.session.add(user)
#     # db.session.commit()
#     # print(user.confirm_email_sent)
#     diff = now - cr
#     print(type(diff.seconds))

#     print(diff.seconds)
#     return {}, 200
