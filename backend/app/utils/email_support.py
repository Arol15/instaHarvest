from flask import render_template
from flask_mail import Message
from app.config import Config
from app import mail


def send_email(to, subject, template, **kwargs):
    """
    Send email to the user
    """
    sender = f'InstaHarvest <{Config.MAIL_USERNAME}>'
    msg = Message(subject, sender=sender, recipients=[to])
    msg.body = render_template(template + '.txt', **kwargs)
    msg.html = render_template(template + '.html', **kwargs)
    mail.send(msg)
