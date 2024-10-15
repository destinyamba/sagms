import datetime

from bson import ObjectId
from flask import Blueprint, jsonify, make_response, request
from pymongo import MongoClient

from artworks.models import Dimensions

artwork_blueprint = Blueprint("artwork", __name__)

client = MongoClient(
    "mongodb+srv://Cluster18362:zm5bZcXvos6OfIBU@cluster18362.r9onf.mongodb.net/"
)
db = client["smart-art-gallery"]
artworks = db.artworks
users = db.users


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

    # check that artist_id is found in users collection and the role is ARTIST.
    artist = users.find_one({"_id": ObjectId(artist_id)})
    if artist is None:
        return make_response(jsonify({"error": "Artist not found"}), 404)
    if str(artist["role"]) != "ARTIST":
        return make_response(
            jsonify(
                {
                    "error": str(artist["role"])
                    + " user not authorised to create artwork"
                }
            ),
            403,
        )

    data["artist_id"] = artist_id

    if not data:
        return make_response(jsonify({"error": "No input data provided"}), 400)

    required_fields = [
        "title",
        "description",
        "category",
        "materials",
        "height_cm",
        "width_cm",
        "provenance",
        "images",
    ]
    for field in required_fields:
        if field in ["title", "description", "category", "provenance", "images"]:
            if not isinstance(data.get(field), str):
                return make_response(
                    jsonify(
                        {"error": f"Invalid data type for {field}, expected string"}
                    ),
                    400,
                )
        elif field == "materials":
            materials = data.get(field, [])
            if not isinstance(materials, list) or not all(
                isinstance(m, str) for m in materials
            ):
                return make_response(
                    jsonify(
                        {
                            "error": "Invalid data type for materials, expected list of strings"
                        }
                    ),
                    400,
                )
        elif field in ["height_cm", "width_cm"]:
            value = data.get(field)
            if not isinstance(value, (int, float)) or value <= 0:
                return make_response(
                    jsonify(
                        {
                            "error": f"Invalid data type for {field}, expected positive number"
                        }
                    ),
                    400,
                )

    new_artwork = {
        "title": data.get("title", "title").strip(),
        "artist_id": artist_id,
        "description": data.get("description", "description").strip(),
        "category": data.get("category", "category").strip(),
        "images": data.get("images", "images").strip(),
        "materials": data.get("materials", "materials"),
        "dimensions": {
            "height_cm": data.get("height_cm", None),
            "width_cm": data.get("width_cm", None),
        },
        "provenance": data.get("provenance", "provenance").strip(),
        "created_at": datetime.datetime.now(),
        "updated_at": datetime.datetime.now(),
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
        for key in [
            "title",
            "description",
            "category",
            "materials",
            "provenance",
            "images",
        ]
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


@artwork_blueprint.route(
    "/api/v1.0/artworks/related/<string:artist_id>", methods=["GET"]
)
def get_related_artworks(artist_id):
    page_num, page_size = 1, 10
    if request.args.get("pn"):
        page_num = int(request.args.get("pn"))
    if request.args.get("ps"):
        page_size = int(request.args.get("ps"))
    page_start = page_size * (page_num - 1)

    data_to_return = []

    artworks_cursor = (
        artworks.find({"artist_id": artist_id}).skip(page_start).limit(page_size)
    )

    for artwork in artworks_cursor:
        artwork["_id"] = str(artwork["_id"])
        for review in artwork.get("reviews", []):
            review["_id"] = str(review["_id"])
        data_to_return.append(artwork)

    return make_response(jsonify(data_to_return), 200)


@artwork_blueprint.route("/api/v1.0/artworks/top-rated", methods=["GET"])
def filter_by_top_rating():
    pipeline = [
        {"$unwind": "$reviews"},
        {
            "$group": {
                "_id": "$_id",
                "title": {"$first": "$title"},
                "average_rating": {"$avg": "$reviews.rating"},
            }
        },
        {"$sort": {"average_rating": -1}},
        {"$limit": 12},
    ]
    top_artworks = list(artworks.aggregate(pipeline))
    for artwork in top_artworks:
        artwork["_id"] = str(artwork["_id"])
    return make_response(jsonify(top_artworks), 200)


@artwork_blueprint.route("/api/v1.0/artworks/filter/dimensions", methods=["GET"])
def filter_by_artwork_dimensions():
    min_height = request.args.get("min_height", type=float, default=None)
    max_height = request.args.get("max_height", type=float, default=None)
    min_width = request.args.get("min_width", type=float, default=None)
    max_width = request.args.get("max_width", type=float, default=None)

    # Check if any of the dimensions are missing
    if not all([min_height, max_height, min_width, max_width]):
        return make_response(
            jsonify(
                {
                    "error": "All dimensions (min_height, max_height, min_width, max_width) are required"
                }
            ),
            400,
        )

    pipeline = [
        {
            "$match": {
                "dimensions.height_cm": {
                    "$gte": min_height,
                    "$lte": max_height,
                }
            }
        },
        {
            "$match": {
                "dimensions.width_cm": {
                    "$gte": min_width,
                    "$lte": max_width,
                }
            }
        },
        {
            "$project": {
                "_id": 1,
                "title": 1,
                "dimensions": 1,
            }
        },
    ]

    specific_dimensions_artworks = list(artworks.aggregate(pipeline))

    for artwork in specific_dimensions_artworks:
        artwork["_id"] = str(artwork["_id"])

    return make_response(jsonify(specific_dimensions_artworks), 200)


@artwork_blueprint.route("/api/v1.0/artworks/search", methods=["GET"])
def search_artworks_by_title():
    title = request.args.get("title", "").strip().lower()

    if not title:
        return make_response(jsonify({"error": "Title parameter is required"}), 400)

    # Search for artworks by title
    artworks_cursor = artworks.find({"title": {"$regex": title, "$options": "i"}})

    data_to_return = []
    for artwork in artworks_cursor:
        artwork["_id"] = str(artwork["_id"])
        data_to_return.append(artwork)

    return make_response(jsonify(data_to_return), 200)
