from flask import render_template, current_app
from flask_mail import Message
from threading import Thread
from app import mail


def send_async_email(app, msg, subject, to):
    with app.app_context():
        try:
            mail.send(msg)
        except:
            app.logger.info(
                f'Failed to send email <{subject}> to user <{to}>')


def send_email(to, subject, template, **kwargs):
    """
    Send email to the user
    """
    if not current_app.config['SEND_CONFIRM_EMAIL']:
        return
    sender = f'InstaHarvest <{current_app.config["MAIL_USERNAME"]}>'
    msg = Message(subject, sender=sender, recipients=[to])
    msg.body = render_template(template + '.txt', **kwargs)
    msg.html = render_template(template + '.html', **kwargs)
    thr = Thread(target=send_async_email, args=[
                 current_app._get_current_object(), msg, subject, to])
    thr.start()
    return thr
