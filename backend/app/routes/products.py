from flask import Blueprint, request
from flask_jwt_extended import (fresh_jwt_required, get_jwt_identity,
                                jwt_required)
import json
from app import db
from app.models import Product

bp = Blueprint("products", __name__, url_prefix='/api/products')

@bp.route('/add-product', methods=['POST'])
@jwt_required
def create_product():
    data = request.get_json()
    #what does it return???
    user_id = get_jwt_identity()
    print(user_id)
    product = Product(user_id = user_id, name = data['name'], 
                    product_type=data['product_type'], image_urls=data['image_urls'], 
                    price=data['price'], status=data['status'], description=data['description'])
    db.session.add(product)
    db.session.commit()
    return "Posted"


@bp.route('/products-per-user')
@jwt_required
def get_products_per_user():
    user_id = get_jwt_identity()
    user_products = Product.query.filter_by(id=user_id).all()
    user_products = [product.to_dict() for product in user_products]
    return {'user-products': user_products}


@bp.route('/get-all')
def get_all_products():
    products = Product.query.all()
    products = [product.to_dict() for product in products]
    print(products)
    return {'products': products}