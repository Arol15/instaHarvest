from itsdangerous import URLSafeTimedSerializer
from app.config import Config

ts = URLSafeTimedSerializer(Config.SECRET_KEY)
