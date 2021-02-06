from flask import Blueprint, request
import json
from app import db
from app.models import Product

bp = Blueprint("products", __name__, url_prefix='/api/products')

@bp.route('/<int:userId>/add-product', methods=['POST'])

# @jwt_required
def create_product(userId):

    data = request.get_json()

    product = Product(user_id = userId, name = data['name'], 
                    product_type=data['product_type'], image_urls=data['image_urls'], 
                    price=data['price'], status=data['status'], description=data['description'])
    db.session.add(product)
    db.session.commit()
    return "Posted"
