from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from datetime import datetime 
from werkzeug.security import generate_password_hash, check_password_hash


db = SQLAlchemy()

class User(db.Model): 
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True, nullable=False)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30))
    email = db.Column(db.String(50), unique=True, nullable=False)
    email_verified = db.Boolean(default=False)
    image_url = db.Column(db.String, default="https://img.icons8.com/doodle/148/000000/test-account.png")
    hashed_password = db.Column(db.String(100), nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.utc)
    updatedAt = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    @property
    def password(self): 
        return self.hashed_password

    @password.setter
    def password(self, password):
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
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    locations_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)
    name = db.Column(db.String(30), nullable=False)
    product_type = db.Column(db.String(30))
    image_urls = db.Column(db.ARRAY(db.String(255)))
    price = db.Column(db.Float, default=0)
    status = db.Column(db.String)
    description = db.Column(db.String(2000))
    createdAt = db.Column(db.DateTime, default=datetime.utc)
    updatedAt = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    deletedAt = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    due_date = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    user = db.relationship("User", backref="product", lazy=True)


class Location(db.Model):
    __tablename__ = "locations"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    lgt = db.Column(db.Float, nullable=False)
    lat = db.Column(db.Float, nullable=False)
    state = db.Column(db.String(12))
    city = db.Column(db.String(20))
    zip_code = db.Column(db.Integer)

    user = db.relationship("User", backref='location', nullable=False)


class Chat(db.Model):
    __tablename__ = "chats"
    id = db.Column(db.Integer, primary_key=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    seller_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship("User", backref="chat", lazy=True)



class Message(db.Model):
    __tablename__ = "messages"
    id = db.Column(db.Integer, primary_key=True)
    chats_id = db.Column(db.Integer, db.ForeignKey('chats.id'), nullable=False)
    body = db.Column(db.String(2000))
    createdAt = db.Column(db.DateTime, default=datetime.utc)

    chat = db.relationship("Chat", backref="message", lazy=True)



