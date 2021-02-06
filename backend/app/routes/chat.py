import json
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
    resp = [chat.to_dict(user_id) for chat in chats]

    return {'chats': resp}, 200


@ bp.route('/send_message', methods=['POST'])
@ jwt_required
def send_message():
    data = request.get_json()
    user_id = get_jwt_identity()
    recipient_id = data['recipient_id']
    chat = Chat.query.filter_by(
        user1_id=user_id, user2_id=recipient_id).first()
    if not chat:
        chat = Chat.query.filter_by(
            user1_id=recipient_id, user2_id=user_id).first()
    if not chat:
        chat = Chat(user1_id=user_id, user2_id=recipient_id)
        db.session.add(chat)
        db.session.commit()
    message = Message(chat_id=chat.id, sender_id=user_id,
                      body=data['body'])
    db.session.add(message)
    db.session.commit()

    return {}, 200
