from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_claims
from itsdangerous import URLSafeTimedSerializer
from app import jwt
from app.config import Config

ts = URLSafeTimedSerializer(Config.SECRET_KEY)


def admin_required(fn):
    """
    A decorator that verifies the JWT is present in
    the request, as well as insuring that this user has a role of
    `admin` in the access token
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt_claims()
        if claims['roles'] != 'admin':
            return {'msg': 'Admins only!'}, 403
        else:
            return fn(*args, **kwargs)
    return wrapper
