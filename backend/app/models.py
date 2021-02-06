from sqlalchemy.sql import func, expression
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30))
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30))
    email = db.Column(db.String(50), unique=True, nullable=False)
    email_verified = db.Column(db.Boolean)
    user_role = db.Column(db.String(16), default='user')
    image_url = db.Column(db.String)
    hashed_password = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(100))
    lgt = db.Column(db.Float)
    lat = db.Column(db.Float)
    state = db.Column(db.String(12), nullable=False)
    city = db.Column(db.String(20), nullable=False)
    zip_code = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
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

    def to_dict(self):
        return {
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "image_url": self.image_url,
            "email": self.email,
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
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    deleted_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    due_date = db.Column(db.DateTime(timezone=True), onupdate=func.now())


class Chat(db.Model):
    __tablename__ = "chats"
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user1_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user1 = db.relationship("User", foreign_keys=[user1_id], lazy=False)
    user2 = db.relationship("User", foreign_keys=[user2_id], lazy=False)
    messages = db.relationship("Message", backref="chat", lazy="dynamic")

    def to_dict(self, user_id):
        recipient_id = self.user2_id if self.user1_id == user_id else self.user1_id
        return {
            "chat_id": self.id,
            "created_at": self.created_at,
            "recipient_id": recipient_id,
        }


class Message(db.Model):
    __tablename__ = "messages"
    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey("chats.id"), nullable=False)
    sender_id = db.Column(db.Integer, nullable=False)
    body = db.Column(db.String(2000))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
