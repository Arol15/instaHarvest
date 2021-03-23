from functools import wraps
from flask import session
from itsdangerous import URLSafeTimedSerializer
from app.config import Config
from datetime import datetime
from dateutil import tz

ts = URLSafeTimedSerializer(Config.SECRET_KEY)


# def admin_required(fn):
#     """
#     Verifies the JWT is present in the request, as well as insuring
#     that this user has a role of `admin` in the access token
#     """
#     @wraps(fn)
#     def wrapper(*args, **kwargs):
#         verify_jwt_in_request()
#         claims = get_jwt_claims()
#         if claims['roles'] != 'admin':
#             return {'error': 'Admins only!'}, 403
#         else:
#             return fn(*args, **kwargs)
#     return wrapper


def auth_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = session.get('id', False)
        if user_id is False:
            return {'error': 'unauthorized'}, 401
        else:
            return fn(*args, **kwargs)
    return wrapper


def reauth_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = session.get('id', False)
        if user_id is False:
            return {'error': 'unauthorized'}, 401
        date = session.get('date', False)
        now = datetime.now(tz=tz.tzlocal())
        diff = now - date
        if diff.seconds > 15:
            return {'error': 'reauthorize'}, 403
        return fn(*args, **kwargs)
    return wrapper
