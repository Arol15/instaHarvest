from flask import Blueprint, make_response

bp = Blueprint('cert', __name__, url_prefix='/')


@bp.route("/.well-known/acme-challenge/TSGse3htu8oLX4-hS4y0pwFUgMj5-6YaMaxs8ga91uk")
def cert():
    response = make_response("TSGse3htu8oLX4-hS4y0pwFUgMj5-6YaMaxs8ga91uk.zjG3h0wgNQ-YKz7jFl51MrKMFMidtq5mE1fqLt3sfdc"
                             )
    response.mimetype = "text/plain"
    return response
