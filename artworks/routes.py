import uuid

from bson import ObjectId
from flask import Blueprint, jsonify, make_response, request
from pymongo import MongoClient

artwork_blueprint = Blueprint("artwork", __name__)

client = MongoClient(
    "mongodb+srv://Cluster18362:zm5bZcXvos6OfIBU@cluster18362.r9onf.mongodb.net/"
)
db = client["smart-art-gallery"]
artworks = db.artworks


@artwork_blueprint.route("/api/v1.0/artworks", methods=["GET"])
def get_artworks():
    page_num, page_size = 1, 10
    if request.args.get("pn"):
        page_num = int(request.args.get("pn"))
    if request.args.get("ps"):
        page_size = int(request.args.get("ps"))
    page_start = page_size * (page_num - 1)

    data_to_return = []
    for artwork in artworks.find().skip(page_start).limit(page_size):
        artwork["_id"] = str(artwork["_id"])
        for review in artwork.get("reviews", []):
            review["_id"] = str(review["_id"])
        data_to_return.append(artwork)
    return make_response(jsonify(data_to_return), 200)


@artwork_blueprint.route("/api/v1.0/artworks/<string:artwork_id>", methods=["GET"])
def get_artwork(artwork_id):
    artwork = artworks.find_one({"_id": ObjectId(artwork_id)})
    if artwork is not None:
        artwork["_id"] = str(artwork["_id"])
        for review in artwork.get("reviews", []):
            review["_id"] = str(review["_id"])
        return make_response(jsonify(artwork), 200)
    else:
        return make_response(jsonify({"error": "Artwork not found"}), 404)


@artwork_blueprint.route("/api/v1.0/artworks/<string:artist_id>", methods=["POST"])
def create_artwork(artist_id):
    data = request.get_json()
    next_id = str(uuid.uuid4())
    new_artwork = {
        "title": data.get("title", "title"),
        "artist_id": artist_id,
        "description": data.get("description", "description"),
        "category": data.get("category", "category"),
        "images": data.get("images", []),
        "materials": data.get("materials", "materials"),
        "dimensions": {
            "height_cm": data.get("height_cm", None),
            "width_cm": data.get("width_cm", None),
        },
        "provenance": data.get("provenance", "provenance"),
        "created_at": "2013-12-01T00:00:00",
        "updated_at": "2013-12-01T00:00:00",
        "reviews": [],
    }
    artwork = artworks.insert_one(new_artwork)
    return make_response(jsonify({"artwork_id": str(artwork.inserted_id)}), 201)


@artwork_blueprint.route(
    "/api/v1.0/artworks/<string:artist_id>/<string:artwork_id>", methods=["PUT"]
)
def update_artwork(artist_id, artwork_id):
    data = request.get_json()

    artwork = artworks.find_one({"_id": ObjectId(artwork_id)})
    if artwork is None:
        return make_response(jsonify({"error": "Artwork not found"}), 404)
    elif artist_id != artwork["artist_id"]:
        return make_response(jsonify({"error": "Unauthorized to update artwork"}), 401)

    # Fields that can be updated.
    update_fields = {
        key: data[key]
        for key in ["title", "description", "category", "materials", "provenance"]
        if key in data
    }

    if "height_cm" in data or "width_cm" in data:
        update_fields["dimensions"] = {
            "height_cm": data.get("height_cm", artwork["dimensions"].get("height_cm")),
            "width_cm": data.get("width_cm", artwork["dimensions"].get("width_cm")),
        }

    artworks.update_one({"_id": ObjectId(artwork_id)}, {"$set": update_fields})
    updated_artwork = artworks.find_one({"_id": ObjectId(artwork_id)})
    updated_artwork["_id"] = str(updated_artwork["_id"])

    return make_response(jsonify(updated_artwork), 200)


@artwork_blueprint.route(
    "/api/v1.0/artworks/<string:artist_id>/<string:artwork_id>", methods=["DELETE"]
)
def delete_artwork(artist_id, artwork_id):
    artwork = artworks.find_one({"_id": ObjectId(artwork_id)})
    if artwork is None:
        return make_response(jsonify({"error": "Artwork not found"}), 404)
    elif artist_id != artwork["artist_id"]:
        return make_response(jsonify({"error": "Unauthorized to delete artwork"}), 401)
    else:
        artworks.delete_one({"_id": ObjectId(artwork_id)})
        return make_response(jsonify({}), 200)
