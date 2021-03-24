from sqlalchemy.sql import func, expression
from datetime import datetime
from dateutil import tz
from werkzeug.security import generate_password_hash, check_password_hash
from app import db


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    profile_addr = db.Column(db.String(30), nullable=False)
    username = db.Column(db.String(30))
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30))
    email = db.Column(db.String(50), unique=True, nullable=False)
    email_verified = db.Column(db.Boolean)
    user_role = db.Column(db.String(16), nullable=False, default='user')
    image_url = db.Column(db.String)
    image_back_url = db.Column(db.String)
    hashed_password = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(100))
    lgt = db.Column(db.Float, server_default="0.0")
    lat = db.Column(db.Float, server_default="0.0")
    state = db.Column(db.String(12), nullable=False)
    city = db.Column(db.String(20), nullable=False)
    zip_code = db.Column(db.Integer, server_default="0")
    confirm_email_sent = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime,
                           default=datetime.utcnow)
    updated_at = db.Column(db.DateTime,
                           onupdate=datetime.utcnow)

    products = db.relationship("Product", backref="user", lazy="dynamic")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def change_password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def __repr__(self):
        return f"User with {self.username} and {self.password}"

    def to_dict_auth(self):
        return {
            "first_name": self.first_name,
            "image_url": self.image_url,
            "image_back_url": self.image_back_url,
            "city": self.city,
            "us_state": self.state,
            "email_verified": self.email_verified,
            "created_at": self.created_at.isoformat()

        }

    def to_dict_private(self):
        return {
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "image_url": self.image_url,
            "image_back_url": self.image_back_url,
            "email": self.email,
            "profile_addr": self.profile_addr,
            "email_verified": self.email_verified,
            "us_state": self.state,
            "city": self.city,
            "zip_code": self.zip_code,
            "address": self.address,
            "created_at": self.created_at.isoformat()

        }

    def to_dict_public(self):
        return {
            "first_name": self.first_name,
            "image_url": self.image_url,
            "profile_addr": self.profile_addr,
            "image_back_url": self.image_back_url,
            "email_verified": self.email_verified,
            "created_at": self.created_at.isoformat(),
            "us_state": self.state,
            "city": self.city
        }

    def to_dict_location_user_info(self):
        return {
            "first_name": self.first_name,
            "image_url": self.image_url,
            # "email_verified": self.email_verified,
            "state": self.state,
            "city": self.city,
            "lat": self.lat,
            "lgt": self.lgt
        }


class Product(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(30), nullable=False)
    product_type = db.Column(db.String(30))
    image_urls = db.Column(db.ARRAY(db.String(255)))
    price = db.Column(db.Float)
    status = db.Column(db.String)
    description = db.Column(db.String(2000))
    created_at = db.Column(db.DateTime,
                           default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    deleted_at = db.Column(db.DateTime)
    due_date = db.Column(db.DateTime)

    def to_dict(self):
        return {
            "name": self.name,
            "product_type": self.product_type,
            "image_urls": self.image_urls,
            "price": self.price,
            "description": self.description,
            "status": self.status,
            "user_id": self.user_id,
            "product_id": self.id
        }


class Chat(db.Model):
    __tablename__ = "chats"
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime,
                           default=datetime.utcnow)
    user1_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user1 = db.relationship("User", foreign_keys=[user1_id], lazy=False)
    user2 = db.relationship("User", foreign_keys=[user2_id], lazy=False)
    messages = db.relationship("Message", backref="chat", lazy="dynamic")

    def to_dict(self, user_id):
        recipient_id = self.user2_id if self.user1_id == user_id else self.user1_id
        recipient = User.query.filter_by(id=recipient_id).first()
        last_message = self.messages.order_by(
            Message.created_at).all()[-1]
        return {
            "chat_id": self.id,
            "created_at": self.created_at,
            "recipient_id": recipient_id,
            "recipient_img": recipient.image_url,
            "recipient_name": recipient.first_name,
            "last_message": last_message.body,
            "last_date": last_message.created_at.isoformat()
        }


class Message(db.Model):
    __tablename__ = "messages"
    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey("chats.id"), nullable=False)
    sender_id = db.Column(db.Integer, nullable=False)
    body = db.Column(db.String(2000))
    created_at = db.Column(db.DateTime,
                           default=datetime.utcnow)

    def to_dict(self):
        user = User.query.filter_by(id=self.sender_id).first()
        return {
            "msg_id": self.id,
            "created_at": self.created_at.isoformat(),
            "sender_id": self.sender_id,
            "sender_img": user.image_url,
            "body": self.body
        }


class Session(db.Model):
    __tablename__ = "sessions"
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(255), unique=True)
    data = db.Column(db.LargeBinary)
    expiry = db.Column(db.DateTime)
