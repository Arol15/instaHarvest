from app import app
import json 
# from sqlalchemy.orm import joinedload
from flask import Blueprint, request
from app.models import db, User
# from config import Config

bp = Blueprint("users", __name__, url_prefix='/api/users')



@app.route("/signup", methods=["POST"])
def signup():
    data = json.loads(request.get_data().decode('UTF-8'))
    username = data['username']
    first_name = data['first_name']
    last_name = data['last_name']
    password = data['password']
    email = data['email']
    if data['image_url']:
        image_url = data['image_url']
    else:
        image_url = None
    email_verified = False
    user = User(username=username, first_name=first_name, last_name=last_name, hashed_password=password, email=email, email_verified=email_verified, image_url=image_url)
    db.session.add(user)
    db.session.commit()
    return 'Registered'
