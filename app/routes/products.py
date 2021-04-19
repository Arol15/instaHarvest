from flask import Blueprint, request, session
import json
from sqlalchemy.sql import func
from app import db
from app.models import Product, User, LikedProduct, Address
from app.utils.security import auth_required

bp = Blueprint("products", __name__)


@bp.route("/add_product", methods=["POST"])
@auth_required
def create_product():
    data = request.get_json()
    user_id = session["id"]
    address_id = None
    if type(data["location"]).__name__ == "str":
        address_id = int(data["location"])
    if address_id is None:
        loc = data["location"]
        user = User.query.filter_by(id=user_id).first()
        address = user.addresses.filter_by(
            lgt=loc["lgt"], lat=loc["lat"]).first()
        if address:
            return {"error": "Address already exists"}, 409

        address = Address(user_id=user_id,
                          primary_address=False,
                          state=loc["state"],
                          city=loc["city"],
                          country=loc["country"],
                          lat=loc["lat"],
                          lgt=loc["lgt"],
                          address=loc["address"],
                          zip_code=loc["zip_code"] if loc["zip_code"] else None)
        db.session.add(address)
        db.session.commit()
        address_id = address.id

    product = Product(user_id=user_id, name=data["name"],
                      product_type=data["product_type"], image_urls=data["image_urls"],
                      price=data["price"], status="available", description=data["description"],
                      address_id=address_id)
    db.session.add(product)
    db.session.commit()
    return {"msg": "Product created"}, 200


@bp.route("/products_per_user", methods=["POST"])
@auth_required
def get_products_per_user():
    user_id = session["id"]
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return {}, 404
    user_products = user.products.order_by(Product.created_at.desc()).all()
    products = [product.to_dict(user_id) for product in user_products]
    return {"user_products": products}


@bp.route("/get_local_products", methods=["POST"])
def get_all_products():
    user_id = None
    try:
        user_id = session["id"]
    except:
        pass
    # data = request.get_json()
    lgt = request.json.get("lgt")
    lat = request.json.get("lat")
    products = Product.query.join(Product.address).filter(func.acos(func.sin(func.radians(lat)) * func.sin(func.radians(Address.lat)) + func.cos(
        func.radians(lat)) * func.cos(func.radians(Address.lat)) * func.cos(func.radians(Address.lgt) - (func.radians(lgt)))) * 6371 <= 40).all()
    products_dict = [product.to_dict(user_id) for product in products]
    return {"products": products_dict}, 200


@bp.route("/get-all-protected", methods=["POST"])
@auth_required
def get_all_products_protected():
    user_id = session["id"]
    data = request.get_json()
    # print(data)
    searchCity = data["search_term"]
    # print(searchCity)
    prods = Product.query.join(Product.user).filter(
        User.city == searchCity).all()
    # print(prods)
    user_products = [product.to_dict() for product in prods]
    # print(user_products)
    return {"products": user_products, "user_id": user_id}


@bp.route("/product-location-info/<int:userId>", methods=["POST"])
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


@bp.route("/edit-product/<int:productId>", methods=["PATCH"])
@auth_required
def edit_product(productId):
    data = request.get_json()
    product = Product.query.filter_by(id=productId).first()
    for key, value in data.items():
        setattr(product, key, value)
    db.session.add(product)
    db.session.commit()
    return {"msg": "Product updated"}, 200


@bp.route("/delete_product", methods=["DELETE"])
@auth_required
def delete_product():
    data = request.get_json()
    product_id = data["product_id"]
    # print(data)
    product = Product.query.filter_by(id=product_id).first()
    db.session.delete(product)
    db.session.commit()
    return {"msg": "deleted"}, 200


@bp.route("/like/<int:product_id>", methods=["POST"])
@auth_required
def give_like(product_id):
    product = Product.query.filter_by(id=product_id).first()
    if product is None:
        return {"error": "Product have not found"}, 404
    like = product.likes.filter_by(user_id=session["id"]).first()
    if like is None:
        new_like = LikedProduct(user_id=session["id"], product_id=product.id)
        db.session.add(new_like)
        db.session.commit()
    else:
        db.session.delete(like)
        db.session.commit()
    return {}, 200
