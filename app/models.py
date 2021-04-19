from math import sin, cos, acos, pi
from sqlalchemy.sql import func, expression
from datetime import datetime
from dateutil import tz
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from flask import current_app


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
    confirm_email_sent = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime,
                           default=datetime.utcnow)
    updated_at = db.Column(db.DateTime,
                           onupdate=datetime.utcnow)

    products = db.relationship("Product", backref="user", lazy="dynamic")
    liked_products = db.relationship(
        "LikedProduct", backref="user", lazy="dynamic")
    addresses = db.relationship("Address", backref="user", lazy="dynamic")

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
        address = self.addresses.filter_by(primary_address=True).first()
        return {
            "first_name": self.first_name,
            "image_url": self.image_url,
            "image_back_url": self.image_back_url,
            "city": address.city,
            "country": address.country,
            "us_state": address.state,
            "email_verified": self.email_verified,
            "created_at": self.created_at.isoformat()

        }

    def to_dict_private(self):
        address = self.addresses.filter_by(primary_address=True).first()
        return {
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "image_url": self.image_url,
            "image_back_url": self.image_back_url,
            "email": self.email,
            "profile_addr": self.profile_addr,
            "email_verified": self.email_verified,
            "us_state": address.state,
            "city": address.city,
            "country": address.country,
            "zip_code": address.zip_code,
            "address": address.address,
            "created_at": self.created_at.isoformat()

        }

    def to_dict_public(self):
        address = self.addresses.filter_by(primary_address=True).first()
        return {
            "first_name": self.first_name,
            "image_url": self.image_url,
            "profile_addr": self.profile_addr,
            "image_back_url": self.image_back_url,
            "email_verified": self.email_verified,
            "created_at": self.created_at.isoformat(),
            "us_state": address.state,
            "city": address.city,
            "country": address.country
        }

    def to_dict_location_user_info(self):
        address = self.addresses.filter_by(primary_address=True).first()
        return {
            "first_name": self.first_name,
            "image_url": self.image_url,
            # "email_verified": self.email_verified,
            "state": address.state,
            "city": address.city,
            "lat": address.lat,
            "lgt": address.lgt
        }


class Product(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(30), nullable=False)
    product_type = db.Column(db.String(30))
    product_icon = db.Column(db.String(20))
    image_urls = db.Column(db.ARRAY(db.String(255)))
    price = db.Column(db.Float)
    status = db.Column(db.String)
    description = db.Column(db.String(2000))
    created_at = db.Column(db.DateTime,
                           default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    deleted_at = db.Column(db.DateTime)
    due_date = db.Column(db.DateTime)
    address_id = db.Column(db.Integer, db.ForeignKey(
        "addresses.id"), nullable=False)

    likes = db.relationship(
        "LikedProduct", backref="product", lazy="dynamic")

    def to_dict(self, user_id, lat=None, lgt=None):
        likes = self.likes.count()
        address_dict = self.address.to_dict(lat, lgt)
        authorized = True if user_id else False
        personal = True if user_id == self.user_id else False
        return {
            "type": "Feature",
            "properties": {
                "authorized": authorized,
                "personal": personal,
                "name": self.name,
                "product_type": self.product_type,
                "product_icon": self.product_icon,
                "image_urls": self.image_urls,
                "price": self.price,
                "description": self.description,
                "status": self.status,
                "user_id": self.user_id,
                "product_id": self.id,
                "total_likes": likes,
            },
            "geometry": address_dict
        }


class Address(db.Model):
    __tablename__ = "addresses"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    primary_address = db.Column(db.Boolean)
    address = db.Column(db.String(100))
    lgt = db.Column(db.Float, nullable=False)
    lat = db.Column(db.Float, nullable=False)
    state = db.Column(db.String(12))
    city = db.Column(db.String(20))
    zip_code = db.Column(db.Integer)
    country = db.Column(db.String(20))

    products = db.relationship(
        "Product", backref="address", lazy="dynamic")

    def to_dict(self, lat=None, lgt=None):
        distance = None
        distance_mi = None
        if lat is not None and lgt is not None:
            distance = round(current_app.config["RADIUS"] * acos(sin(self.lat * pi / 180) * sin(lat * pi / 180) + cos(
                self.lat * pi / 180) * cos(lat * pi / 180) * cos((self.lgt * pi / 180) - (lgt * pi / 180))), 1)

            distance_mi = round(
                distance * current_app.config['KM_TO_MI_FACTOR'], 1)
        return {
            "type": "Point",
            "coordinates": [self.lgt, self.lat],
            "properties": {
                "id": self.id,
                "user_id": self.user_id,
                "primary_address": self.primary_address,
                "address": self.address,
                "us_state": self.state,
                "city": self.city,
                "zip_code": self.zip_code,
                "country": self.country,
                "distance_km": distance,
                "distance_mi": distance_mi
            },
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
        messages = self.messages.order_by(
            Message.created_at).all()
        last_message = ""
        last_date = ""
        if messages:
            last_message = messages[-1].body
            last_date = messages[-1].created_at.isoformat()
        return {
            "user_id": user_id,
            "chat_id": self.id,
            "created_at": self.created_at,
            "recipient_id": recipient_id,
            "recipient_img": recipient.image_url,
            "recipient_name": recipient.first_name,
            "last_message": last_message,
            "last_date": last_date
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


class LikedProduct(db.Model):
    __tablename__ = "liked_products"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey(
        "products.id"), nullable=False)
