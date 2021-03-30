import pytest
from app import create_app, db
from app.models import User
from flask import Flask, session, current_app
from datetime import datetime, timedelta
from .config import *
import time


def test_chats(client):
    # Get user1 chats
    login(client, USER1, PASSWORD)
    rv = client.post("/api/chat/get_user_chats")
    resp = rv.get_json()
    assert int(rv.status[:3]) == 200
    assert len(resp["chats"]) == 0

    # Get chats recipient_id doesn't exist
    rv = client.post("/api/chat/get_chat_between_users",
                     json={"recipient_id": 2})
    resp = rv.get_json()
    assert int(rv.status[:3]) == 404

    # Send messages to user1
    for i in range(2, 6):
        signup(client, f"user{i}", f"user{i}@test.com", PASSWORD)
        rv = client.post("/api/chat/get_chat_between_users",
                         json={"recipient_id": 1})
        resp = rv.get_json()
        assert int(rv.status[:3]) == 200
        assert resp["chat_id"] == i - 1

        rv = client.post("/api/chat/send_message",
                         json={"recipient_id": 1, "chat_id": i - 1, "body": f"msg1 from User{i} to User1"})
        resp = rv.get_json()
        assert int(rv.status[:3]) == 200
        assert resp["body"] == f"msg1 from User{i} to User1"
        assert get_date() in resp["created_at"]
        assert resp["sender_id"] == i
        assert resp["sender_img"] == current_app.config["PROFILE_IMAGE"]
        rv = client.post("/api/chat/send_message",
                         json={"recipient_id": 1, "chat_id": i - 1, "body": f"msg2 from User{i} to User1"})

    # Test User1 chats
    login(client, USER1, PASSWORD)
    rv = client.post("/api/chat/get_user_chats")
    assert int(rv.status[:3]) == 200
    chats = rv.get_json()["chats"]
    assert len(chats) == 4
    for i, chat in enumerate(chats):
        assert chat["chat_id"] == 4 - i
        assert chat["recipient_id"] == 5 - i
        assert chat["last_message"] == f"msg2 from User{5 - i} to User1"

        # User1 sends reply
        rv = client.post("/api/chat/send_message",
                         json={"recipient_id": 5 - i, "chat_id": 4 - i, "body": f"msg1 from User1 to User{5-i}"})
        resp = rv.get_json()
        assert int(rv.status[:3]) == 200
        assert resp["body"] == f"msg1 from User1 to User{5-i}"
        assert get_date() in resp["created_at"]
        assert resp["sender_id"] == 1

    # Check user2-5 chats
    for i in range(2, 6):
        login(client, f"user{i}", PASSWORD)
        rv = client.post("/api/chat/get_chat_between_users",
                         json={"recipient_id": 1})
        resp = rv.get_json()
        assert int(rv.status[:3]) == 200
        assert resp["chat_id"] == i - 1
        chats = resp["msgs"]
        assert len(chats) == 3
        assert chats[-1]["body"] == f"msg1 from User1 to User{i}"
        assert chats[-1]["sender_id"] == 1
