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
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime(timezone=True), onupdate=func.now())

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

    def to_dict(self, email=False):
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
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    deletedAt = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    due_date = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    user = db.relationship("User", backref="products", lazy=True)


    def to_dict(self):
        return {
            "name": self.name,
            "product_type": self.product_type,
            "image_urls": self.image_urls,
            "price": self.price,
            "description": self.description,
            "status": self.status
        }


class Chat(db.Model):
    __tablename__ = "chats"
    id = db.Column(db.Integer, primary_key=True)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    user1_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user1 = db.relationship("User", foreign_keys=[user1_id], lazy=False)
    user2 = db.relationship("User", foreign_keys=[user2_id], lazy=False)


class Message(db.Model):
    __tablename__ = "messages"
    id = db.Column(db.Integer, primary_key=True)
    chats_id = db.Column(db.Integer, db.ForeignKey("chats.id"), nullable=False)
    body = db.Column(db.String(2000))
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)

    chat = db.relationship("Chat", backref="messages", lazy=True)
