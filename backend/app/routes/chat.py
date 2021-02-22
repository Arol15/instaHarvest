import json
from datetime import datetime
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_
from app import db
from app.models import User, Chat, Message


bp = Blueprint('chat', __name__, url_prefix='/api/chat')


@bp.route('/get_user_chats', methods=['POST'])
@jwt_required
def get_user_chats():
    user_id = get_jwt_identity()
    chats = Chat.query.filter(
        or_(Chat.user1_id == user_id, Chat.user2_id == user_id)).all()
    chats_dict = [chat.to_dict(user_id) for chat in chats]

    return {'chats': chats_dict}, 200


@bp.route('/send_message', methods=['POST'])
@jwt_required
def send_message():
    data = request.get_json()
    user_id = get_jwt_identity()
    recipient_id = request.json.get('recipient_id', None)
    chat_id = request.json.get('chat_id', None)
    chat = Chat.query.filter_by(
        id=chat_id).first()
    message = Message(chat_id=chat.id, sender_id=user_id,
                      body=data['body'])
    db.session.add(message)
    db.session.commit()
    return {'chat_id': chat.id}, 200


@bp.route('/get_chat_between_users', methods=['POST'])
@jwt_required
def chat_between_users():
    data = request.get_json()
    user_id = get_jwt_identity()
    recipient_id = data['recipient_id']
    msgs_dict = []
    chat = Chat.query.filter_by(
        user1_id=user_id, user2_id=recipient_id).first()
    if not chat:
        chat = Chat.query.filter_by(
            user1_id=recipient_id, user2_id=user_id).first()
    if chat:
        messages = chat.messages.order_by(Message.created_at).all()
        msgs_dict = [message.to_dict() for message in messages]
    else:
        chat = Chat(user1_id=user_id, user2_id=recipient_id)
        db.session.add(chat)
        db.session.commit()
    return {'chat_id': chat.id, 'msgs': msgs_dict}, 200


@bp.route('/get_chat_messages', methods=['POST'])
@jwt_required
def get_chat_messages():
    data = request.get_json()
    chat = Chat.query.filter_by(id=data['chat_id']).first()
    if not chat:
        return {}, 406
    messages = chat.messages.order_by(Message.created_at).all()
    msgs_dict = [message.to_dict() for message in messages]
    return {'chat_id': data['chat_id'], 'msgs': msgs_dict}, 200
