from flask import Blueprint, request, session, current_app
import json
import os
from sqlalchemy.sql import func
from app import db
from app.models import Product, User, LikedProduct, Address, Image
from app.utils.security import auth_required
from app.utils.image import save_image

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
            lon=loc["lon"], lat=loc["lat"]).first()
        if address:
            return {"error": "Address already exists"}, 409

        address = Address(user_id=user_id,
                          primary_address=False,
                          state=loc["state"],
                          city=loc["city"],
                          country=loc["country"],
                          lat=loc["lat"],
                          lon=loc["lon"],
                          address=loc["address"],
                          zip_code=loc["zip_code"] if loc["zip_code"] else None)
        db.session.add(address)
        db.session.commit()
        address_id = address.id

    product = Product(user_id=user_id,
                      name=data["name"],
                      product_type=data["product_type"],
                      product_icon=data["product_icon"],
                      price=data["price"],
                      status="available",
                      description=data["description"],
                      address_id=address_id)
    db.session.add(product)
    db.session.commit()
    return {"msg": "Product created",
            "product_id": product.id}, 200


@bp.route("/products_per_user", methods=["POST"])
def get_products_per_user():
    user_id = None
    try:
        user_id = request.json.get("user_id")
    except:
        pass
    if user_id is None:
        try:
            user_id = session["id"]
        except:
            return {'error': 'Unauthorized'}, 401
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return {}, 404
    user_products = user.products.order_by(Product.created_at.desc()).all()
    products = [product.to_dict(user_id) for product in user_products]
    return {"user_products": products}


@bp.route("/get_products", methods=["POST"])
def get_local_products():
    user_id = None
    try:
        user_id = session["id"]
    except:
        pass
    lon = request.json.get("lon")
    lat = request.json.get("lat")
    rng = request.json.get("range")
    params = func.acos(func.sin(func.radians(lat)) * func.sin(func.radians(Address.lat)) + func.cos(
        func.radians(lat)) * func.cos(func.radians(Address.lat)) * func.cos(func.radians(Address.lon) - (func.radians(lon)))) * current_app.config['RADIUS']
    products = Product.query.join(Product.address).filter(
        params <= rng).order_by(params).all()
    products_dict = [product.to_dict(user_id, lat, lon)
                     for product in products]
    return {"products": products_dict}, 200


@bp.route("/get_product", methods=["POST"])
@auth_required
def get_product():
    user_id = session["id"]
    product_id = request.json.get("product_id")
    product = Product.query.filter_by(id=product_id).first()
    return {"product": product.to_dict(user_id)}, 200


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
        liked = True
    else:
        db.session.delete(like)
        db.session.commit()
        liked = False
    likes = product.likes.count()
    return {
        "liked": liked,
        "likes": likes
    }, 200


@bp.route("/get_likes/<int:product_id>", methods=["POST"])
def get_likes(product_id):
    product = Product.query.filter_by(id=product_id).first()
    likes = product.likes.count()
    user_id = session.get('id', False)
    liked = False
    if user_id:
        liked = product.liked_by_user(session["id"])
    return {
        "liked": liked,
        "likes": likes
    }


@bp.route("/edit_product_images/<int:product_id>", methods=["POST", "DELETE"])
@auth_required
def edit_product_images(product_id):
    user_id = session["id"]
    product = Product.query.filter_by(id=product_id).first()
    user = product.user
    if user_id != product.user_id:
        return {}, 403
    if request.method == "POST":
        total_images = product.images.count()
        if total_images >= 4:
            return {"error": "You already have 4 images saved. Delete them first."}, 404
        count_uploaded = 0
        rejected = []
        for uploaded_file in request.files.getlist("file"):
            print(count_uploaded)
            if total_images == 4:
                return {"msg": f"Every product can have up to 4 images. Uploaded {count_uploaded} images"}, 200
            image_name = f"{product.name}-{product_id}-{total_images}"
            image_url = save_image(uploaded_file, user.uuid,
                                   image_name)
            if (image_url == "NOT_ALLOWED" or image_url == "NOT_SAVED"):
                rejected.append(uploaded_file.filename)
                continue
            image = Image(
                product_id=product_id,
                image_url=image_url)
            db.session.add(image)
            db.session.commit()
            if total_images == 0:
                product.primary_image = image_url
                db.session.add(product)
                db.session.commit()
            count_uploaded += 1
            total_images += 1

        msg = f"{count_uploaded} {'file has' if count_uploaded == 1 else 'files have'} been uploaded."

        if len(rejected) > 0:
            msg += f" {len(rejected)} {'file was rejected: ' if len(rejected) == 1 else 'files were rejected: '} "
        if count_uploaded == 0:
            return {}, 404
        for r in rejected:
            msg += f"{r} "
        return {"msg": msg}, 200

    if request.method == "DELETE":
        image_id = request.json.get("image_id", None)
        uuid = product.user.uuid
        if image_id is None:
            return {}, 404
        image = product.images.filter_by(id=image_id).first()
        if image is None:
            return {}, 404
        db.session.delete(image)
        db.session.commit()
        image_name = image.image_url.split('/')[-1]
        to_delete = os.path.join(
            current_app.config["USERS_FOLDER"], uuid, image_name)
        try:
            os.remove(to_delete)
        except:
            print(
                f"File {image_name} in {uuid} folder has not been deleted")
        return {"msg": "The image has been deleted"}, 200


@bp.route("/set_product_primary_image", methods=["PATCH"])
@auth_required
def set_product_primary_image():
    product_id = request.json.get("product_id", None)
    image_url = request.json.get("image_url", None)
    if product_id is None or image_url is None:
        return {}, 404
    product = Product.query.filter_by(id=product_id).first()
    if product is None:
        return {}, 404
    product.primary_image = image_url
    db.session.add(product)
    db.session.commit()
    return {"msg": "Primary image has been updated"}, 200


@bp.route("/delete_product", methods=["DELETE"])
@auth_required
def delete_product():
    user_id = session["id"]
    product_id = request.json.get("product_id")
    product = Product.query.filter_by(id=product_id).first()
    if user_id != product.user_id:
        return {}, 403
    product_images = product.images.all()
    images_names = [image.image_url for image in product_images]
    uuid = product.user.uuid
    db.session.delete(product)
    db.session.commit()
    if len(images_names) > 0:
        path = os.path.join(
            current_app.config["USERS_FOLDER"], uuid)
        for image in images_names:
            to_delete = os.path.join(
                path, image.split('/')[-1])
            try:
                os.remove(to_delete)
            except:
                print(
                    f"File {image.split('/')[-1]} in {uuid} folder has not been deleted")

    return {"msg": "Deleted"}, 200


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
