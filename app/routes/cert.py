from flask import Blueprint, make_response

bp = Blueprint('cert', __name__, url_prefix='/')


@bp.route("/.well-known/acme-challenge/DnzcRiG3xMGk7yHlf5LQWqENjkauKSgwJpJFOd9pqHs")
def cert():
    response = make_response("DnzcRiG3xMGk7yHlf5LQWqENjkauKSgwJpJFOd9pqHs.zjG3h0wgNQ - YKz7jFl51MrKMFMidtq5mE1fqLt3sfdc"
                             )
    response.mimetype = "text/plain"
    return response
