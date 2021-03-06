import json
from datetime import datetime
from flask import Blueprint, request, session
from sqlalchemy import or_
from app import db, socketio
from app.models import User, Chat, Message
from app.utils.security import auth_required
from flask_socketio import join_room, leave_room, send, emit

bp = Blueprint("chat", __name__)


@bp.route("/get_user_chats", methods=["POST"])
@auth_required
def get_user_chats():
    user_id = session["id"]
    chats = Chat.query.filter(
        or_(Chat.user1_id == user_id, Chat.user2_id == user_id)).order_by(Chat.created_at.desc()).all()
    chats_dict = [chat.to_dict(user_id) for chat in chats]

    return {"chats": chats_dict}, 200


@bp.route("/send_message", methods=["POST"])
@auth_required
def send_message():
    data = request.get_json()
    user_id = session["id"]
    try:
        recipient_id = data["recipient_id"]
        chat_id = data["chat_id"]
        body = data["body"]
    except:
        return {}, 404
    recipient = User.query.filter_by(id=recipient_id).first()
    chat = Chat.query.filter_by(id=chat_id).first()
    if user_id == recipient_id or recipient is None or chat is None:
        return {}, 404
    message = Message(chat_id=chat_id, sender_id=user_id,
                      body=body)
    db.session.add(message)
    db.session.commit()
    return message.to_dict(), 200


@bp.route("/find_create_chat", methods=["POST"])
@auth_required
def find_create_chat():
    user_id = session["id"]
    try:
        recipient_id = request.json.get("recipient_id")
    except:
        return {"error": "Bad request"}, 404
    recipient = User.query.filter_by(id=recipient_id).first()
    if recipient is None:
        return {"error": "User not found"}, 404
    chat = Chat.query \
        .filter(Chat.user1_id.in_([user_id, recipient_id])) \
        .filter(Chat.user2_id.in_([user_id, recipient_id])) \
        .first()
    if chat is None:
        chat = Chat(user1_id=user_id, user2_id=recipient_id)
        db.session.add(chat)
        db.session.commit()
    return {"chat_id": chat.id, "user_id": user_id}, 200


@bp.route("/get_chat_between_users", methods=["POST"])
@auth_required
def chat_between_users():
    user_id = session["id"]
    try:
        recipient_id = request.json.get("recipient_id")
    except:
        return {"error": "Bad request"}, 404
    recipient = User.query.filter_by(id=recipient_id).first()
    if recipient is None:
        return {"error": "User not found"}, 404
    msgs_dict = []

    chat = Chat.query \
        .filter(Chat.user1_id.in_([user_id, recipient_id])) \
        .filter(Chat.user2_id.in_([user_id, recipient_id])) \
        .first()

    if chat:
        messages = chat.messages.order_by(Message.created_at).all()
        msgs_dict = [message.to_dict() for message in messages]
    else:
        chat = Chat(user1_id=user_id, user2_id=recipient_id)
        db.session.add(chat)
        db.session.commit()
    return {"chat_id": chat.id, "msgs": msgs_dict}, 200


@bp.route("/get_chat_messages", methods=["POST"])
@auth_required
def get_chat_messages():
    try:
        chat_id = request.json.get("chat_id")
    except:
        return {}, 404
    chat = Chat.query.filter_by(id=chat_id).first()
    if chat is None:
        return {"chat_id": chat_id, "msgs": []}, 200
    messages = chat.messages.order_by(Message.created_at).all()
    msgs_dict = [message.to_dict() for message in messages]
    return {"chat_id": chat_id, "msgs": msgs_dict}, 200


@bp.route("/delete_message", methods=["DELETE"])
@auth_required
def delete_msg():
    try:
        msg_id = request.json.get("msg_id")
    except:
        return {"error": "Bad request"}, 404
    msg = Message.query.filter_by(id=msg_id).first()
    db.session.delete(msg)
    db.session.commit()
    return {"msg": "Message deleted"}, 200


@socketio.on("join")
def on_join(chat_id):
    join_room(chat_id)
    # print(f"user joined room {chat_id}")


@socketio.on("leave")
def on_leave(chat_id):
    join_room(chat_id)
    # print(f"user left room {chat_id}")


@socketio.on("send_msg")
def send_message(data):
    chat_id = data["chat_id"]
    msg = data["body"]
    recipient_id = data["recipient_id"]
    user_id = data["user_id"]

    recipient = User.query.filter_by(id=recipient_id).first()
    chat = Chat.query.filter_by(id=chat_id).first()
    message = Message(chat_id=chat_id, sender_id=user_id,
                      body=msg)
    db.session.add(message)
    db.session.commit()
    emit("send_msg", message.to_dict(), room=chat_id)


@socketio.on("delete_msg")
def send_message(data):
    msg_id = data["msg_id"]
    chat_id = data["chat_id"]
    msg = Message.query.filter_by(id=msg_id).first()
    db.session.delete(msg)
    db.session.commit()
    emit("delete_msg", room=chat_id)
