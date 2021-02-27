from flask import Blueprint, request
from flask_jwt_extended import (fresh_jwt_required, get_jwt_identity,
                                jwt_required)
import json
from app import db
from app.models import Product, User

bp = Blueprint("products", __name__, url_prefix='/api/products')


@bp.route('/add-product', methods=['POST'])
@jwt_required
def create_product():
    data = request.get_json()
    # what does it return???
    user_id = get_jwt_identity()
    # print(user_id)
    product = Product(user_id=user_id, name=data['name'],
                      product_type=data['product_type'], image_urls=data['image_urls'],
                      price=data['price'], status="available", description=data['description'])
    db.session.add(product)
    db.session.commit()
    return {'msg': "Product created"}, 200


@bp.route('/products-per-user', methods=["POST"])
@jwt_required
def get_products_per_user():
    # product = Product.query.filter_by(id=1).first()
    # print(product.name)
    # user = product.user
    # print(user.email)
    user_id = get_jwt_identity()
    # print(user_id)
    user = User.query.filter_by(id=user_id).first_or_404()
    user_products = user.products.all()
    # user_products = Product.query.filter_by(id=user_id).all()
    products = [product.to_dict() for product in user_products]
    # print(products)
    return {'user_products': products}
    # return {}


@bp.route('/get-all', methods=["POST"])
def get_all_products():
    data = request.get_json()
    # print(data)
    searchCity = data["search_term"]
    # print(searchCity)
    prods = Product.query.join(Product.user).filter(User.city==searchCity).all()
    # print(prods)
    user_products = [product.to_dict() for product in prods]
    # print(user_products)
    return {'products': user_products}


@bp.route('/product-location-info/<int:userId>')
def product_location_info(userId):
    # print(userId)
    user = User.query.filter_by(id=userId).first_or_404()
    lat = user.lat
    lgt = user.lgt
    # lgt = User.query.filter_by(id=userId).lgt.first()
    # print(lat)
    # print(lgt)
    return {"lat": lat, "lgt": lgt}

