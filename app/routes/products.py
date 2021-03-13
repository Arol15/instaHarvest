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
    user_id = get_jwt_identity()
    # print(user_id)
    user = User.query.filter_by(id=user_id).first_or_404()
    user_products = user.products.order_by(Product.created_at.desc()).all()
    products = [product.to_dict() for product in user_products]
    # print(products)
    return {'user_products': products}


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


@bp.route('/get-all-protected', methods=["POST"])
@jwt_required
def get_all_products_protected():
    user_id = get_jwt_identity()
    data = request.get_json()
    # print(data)
    searchCity = data["search_term"]
    # print(searchCity)
    prods = Product.query.join(Product.user).filter(User.city==searchCity).all()
    # print(prods)
    user_products = [product.to_dict() for product in prods]
    # print(user_products)
    return {'products': user_products, "user_id": user_id}


@bp.route('/product-location-info/<int:userId>')
def product_location_info(userId):
    # print(userId)
    product_details = {}
    user = User.query.filter_by(id=userId).first_or_404()
    product_details["lat"] = user.lat
    product_details["lgt"] = user.lgt
    product_details["image_url"] = user.image_url
    product_details["first_name"] = user.first_name
    product_details["state"] = user.state
    product_details["city"] = user.city
    # print(product_details)
    return {"product_details": product_details}, 200


@bp.route('/edit-product/<int:productId>', methods=["PATCH"]) 
@jwt_required
def edit_product(productId): 
    data = request.get_json()
    print(data)
    product = Product.query.filter_by(id=productId).first()
    for key, value in data.items():
        setattr(product, key, value)
    db.session.add(product)
    db.session.commit()
    return {'msg': 'Product updated'}, 200


@bp.route("/delete_product", methods=["DELETE"])
@jwt_required
def delete_product():
    data = request.get_json()
    product_id = data["product_id"]
    # print(data)
    product = Product.query.filter_by(id=product_id).first()
    db.session.delete(product)
    db.session.commit()
    return {"msg": "deleted"}, 200