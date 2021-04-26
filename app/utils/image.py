from PIL import Image
import imghdr
import os
from flask import current_app


def resize_image(image, base_width):
    """
    Loads image from FileStorage `image`, resizes to a width `base width` and returns image
    """
    img = Image.open(image)
    if img.size[0] > base_width:
        wpercent = (base_width / float(img.size[0]))
        hsize = int((float(img.size[1]) * float(wpercent)))
        img = img.resize((base_width, hsize), Image.ANTIALIAS)

    return img


def validate_image(image):
    """
    Checks if the file `image` has correct extension and correct format.
    If file is correct, return image extension
    """
    # Validates that the type of image contained in a file is an image format
    header = image.stream.read(512)
    image.stream.seek(0)
    format = imghdr.what(None, header)
    image_type = None
    if format:
        image_type = '.' + (format if format != 'jpeg' else 'jpg')

    file_extension = os.path.splitext(image.filename)[1]
    if file_extension == ".jpeg":
        file_extension = ".jpg"
    if file_extension not in current_app.config["IMAGE_EXTENSIONS"] or \
            file_extension != image_type:
        return None
    return file_extension


def save_image(uploaded_file, uuid, image_name, base_width=1200):
    file_extension = validate_image(uploaded_file)
    if file_extension is None:
        return "NOT_ALLOWED"
    image = resize_image(uploaded_file, base_width)
    file_name = f"{image_name}{file_extension}"
    path = os.path.join(
        current_app.config["USERS_FOLDER"], uuid, file_name)
    try:
        image.save(path, optimize=True)
    except:
        print(f"Error saving image to {path}")
        return "NOT_SAVED"

    return f"{current_app.config['USERS_URL']}/{uuid}/{file_name}"
