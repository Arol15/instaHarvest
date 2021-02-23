from sqlalchemy.sql import func, expression
from datetime import datetime
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
    hashed_password = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(100))
    lgt = db.Column(db.Float, server_default="0.0")
    lat = db.Column(db.Float, server_default="0.0")
    state = db.Column(db.String(12), nullable=False)
    city = db.Column(db.String(20), nullable=False)
    zip_code = db.Column(db.Integer, server_default="0")
    confirm_email_sent = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

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

    def to_dict_private(self):
        return {
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "image_url": self.image_url,
            "email": self.email,
            "profile_addr": self.profile_addr,
            "email_verified": self.email_verified,
            "state": self.state,
            "city": self.city,
            "zip_code": self.zip_code,
            "address": self.address
        }

    def to_dict_public(self):
        return {
            "first_name": self.first_name,
            "image_url": self.image_url,
            "email_verified": self.email_verified,
            "joined": self.created_at.strftime("%b %Y"),
            "state": self.state,
            "city": self.city
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
    created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    deleted_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    due_date = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    def to_dict(self):
        return {
            "name": self.name,
            "product_type": self.product_type,
            "image_urls": self.image_urls,
            "price": self.price,
            "description": self.description,
            "status": self.status,
        }


class Chat(db.Model):
    __tablename__ = "chats"
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())
    user1_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user1 = db.relationship("User", foreign_keys=[user1_id], lazy=False)
    user2 = db.relationship("User", foreign_keys=[user2_id], lazy=False)
    messages = db.relationship("Message", backref="chat", lazy="dynamic")

    def to_dict(self, user_id):
        recipient_id = self.user2_id if self.user1_id == user_id else self.user1_id
        recipient = User.query.filter_by(id=recipient_id).first()
        return {
            "chat_id": self.id,
            "created_at": self.created_at,
            "recipient_id": recipient_id,
            "recipient_img": recipient.image_url,
            "recipient_name": recipient.first_name
        }


class Message(db.Model):
    __tablename__ = "messages"
    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey("chats.id"), nullable=False)
    sender_id = db.Column(db.Integer, nullable=False)
    body = db.Column(db.String(2000))
    created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())

    def to_dict(self):
        return {
            "created_at": self.created_at.strftime("%d %b"),
            "created_at_str": self.created_at.strftime("%d %b, %H:%M:%S"),
            "sender_id": self.sender_id,
            "body": self.body
        }
