import datetime
from math import ceil

from bson import ObjectId
from flask import Blueprint, jsonify, make_response, request
from marshmallow import ValidationError
from pymongo import MongoClient
import globals
from artworks.ArtworkSchema import ArtworkSchema
from users.routes import jwt_required

artwork_blueprint = Blueprint("artwork", __name__)

client = MongoClient(globals.MONGO_URI)
db = client["smart-art-gallery"]
artworks = db.artworks
users = db.users

"""
    Recursively converts MongoDB ObjectId fields in a document to strings.

    Args:
        document: MongoDB document (dict or list) containing ObjectId fields

    Returns:
        Document with ObjectId fields converted to strings
"""


def convert_object_id_to_str(document):
    if isinstance(document, dict):
        return {
            key: (
                str(value)
                if isinstance(value, ObjectId)
                else convert_object_id_to_str(value)
            )
            for key, value in document.items()
        }
    elif isinstance(document, list):
        return [convert_object_id_to_str(item) for item in document]
    return document


"""
    Retrieves a paginated list of all artworks.

    Query Parameters:
        pn (int): Page number (default: 1)
        ps (int): Page size (default: 10)

    Returns:
        200: List of artworks without reviews
"""


@artwork_blueprint.route("/api/v1.0/artworks", methods=["GET"])
def get_artworks():
    page_num, page_size = 1, 10
    if request.args.get("pn"):
        page_num = int(request.args.get("pn"))
    if request.args.get("ps"):
        page_size = int(request.args.get("ps"))
    page_start = page_size * (page_num - 1)

    page_start = page_size * (page_num - 1)
    total_artworks = artworks.count_documents({})  # Get total count of artworks
    total_pages = ceil(total_artworks / page_size)  # Calculate total pages

    data_to_return = []
    for artwork in artworks.find({}, {"reviews": 0}).skip(page_start).limit(page_size):
        artwork["_id"] = str(artwork["_id"])
        data_to_return.append(artwork)

    response = {
        "artworks": data_to_return,
        "page": page_num,
        "pageSize": page_size,
        "totalArtworks": total_artworks,
        "totalPages": total_pages,
    }
    return make_response(jsonify(response), 200)


@artwork_blueprint.route("/api/v1.0/totalArtworks", methods=["GET"])
def get_total_artworks():
    data_to_return = []
    for artwork in artworks.find({}, {"reviews": 0}):
        artwork["_id"] = str(artwork["_id"])
        data_to_return.append(artwork)
    return make_response(jsonify(len(data_to_return)), 200)


"""
    Retrieves details of a specific artwork.

    Args:
        artwork_id (str): The ID of the artwork

    Returns:
        200: Artwork details without reviews
        404: If artwork not found
"""


@artwork_blueprint.route("/api/v1.0/artworks/<string:artwork_id>", methods=["GET"])
@jwt_required
def get_artwork(artwork_id):
    artwork = artworks.find_one({"_id": ObjectId(artwork_id)}, {"reviews": 0})
    if artwork is not None:
        artwork["_id"] = str(artwork["_id"])
        return make_response(jsonify(artwork), 200)
    else:
        return make_response(jsonify({"error": "Artwork not found"}), 404)


"""
    Creates a new artwork for a specific artist.

    Args:
        artist_id (str): The ID of the artist creating the artwork

    Required JSON fields:
        title (str): Artwork title
        description (str): Artwork description
        category (str): Artwork category
        materials (list): List of materials used
        height_cm (number): Height in centimeters
        width_cm (number): Width in centimeters
        provenance (str): Artwork provenance
        images (str): Image URLs/references

    Returns:
        201: Created artwork ID
        400: Invalid input data
        403: Unauthorized artist
        404: Artist not found
"""


@artwork_blueprint.route("/api/v1.0/artworks/<string:artist_id>", methods=["POST"])
@jwt_required
def create_artwork(artist_id):
    data = request.get_json()
    if not data:
        return make_response(jsonify({"error": "No input data provided"}), 400)

    artist = users.find_one({"_id": ObjectId(artist_id)})
    if artist is None:
        return make_response(jsonify({"error": "Artist not found"}), 404)
    if str(artist["role"]) != "ARTIST":
        return make_response(jsonify({"error": "Unauthorized role"}), 403)

    try:
        validated_data = ArtworkSchema().load(data)
    except ValidationError as err:
        return make_response(jsonify({"error": err.messages}), 400)

    new_artwork = {
        **validated_data,
        "artist_id": artist_id,
        "dimensions": {
            "height_cm": validated_data["height_cm"],
            "width_cm": validated_data["width_cm"],
        },
        "created_at": datetime.datetime.now(),
        "updated_at": datetime.datetime.now(),
        "reviews": [],
    }

    artwork = artworks.insert_one(new_artwork)
    return make_response(jsonify({"artwork_id": str(artwork.inserted_id)}), 201)


"""
    Updates an existing artwork.

    Args:
        artist_id (str): ID of the artist
        artwork_id (str): ID of the artwork to update

    Updatable JSON fields:
        title (str, optional): New title
        description (str, optional): New description
        category (str, optional): New category
        materials (list, optional): New materials list
        height_cm (number, optional): New height
        width_cm (number, optional): New width
        provenance (str, optional): New provenance
        images (str, optional): New images

    Returns:
        200: Updated artwork details
        401: Unauthorized to update
        404: Artwork not found
"""


@artwork_blueprint.route(
    "/api/v1.0/artworks/<string:artist_id>/<string:artwork_id>", methods=["PUT"]
)
@jwt_required
def update_artwork(artist_id, artwork_id):
    data = request.get_json()
    artwork = artworks.find_one({"_id": ObjectId(artwork_id)})
    if artwork is None:
        return make_response(jsonify({"error": "Artwork not found"}), 404)
    if artist_id != artwork["artist_id"]:
        return make_response(jsonify({"error": "Unauthorized"}), 401)

    try:
        validated_data = ArtworkSchema(partial=True).load(data)
    except ValidationError as err:
        return make_response(jsonify({"error": err.messages}), 400)

    update_fields = {**validated_data, "updated_at": datetime.datetime.now()}
    artworks.update_one({"_id": ObjectId(artwork_id)}, {"$set": update_fields})
    updated_artwork = artworks.find_one({"_id": ObjectId(artwork_id)})

    return make_response(jsonify(convert_object_id_to_str(updated_artwork)), 200)


"""
    Deletes an artwork.

    Args:
        artist_id (str): ID of the artist
        artwork_id (str): ID of the artwork to delete

    Returns:
        200: Empty response on successful deletion
        401: Unauthorized to delete
        404: Artwork not found
"""


@artwork_blueprint.route(
    "/api/v1.0/artworks/<string:artist_id>/<string:artwork_id>", methods=["DELETE"]
)
@jwt_required
def delete_artwork(artist_id, artwork_id):
    artwork = artworks.find_one({"_id": ObjectId(artwork_id)})
    if artwork is None:
        return make_response(jsonify({"error": "Artwork not found"}), 404)
    elif artist_id != artwork["artist_id"]:
        return make_response(jsonify({"error": "Unauthorized to delete artwork"}), 401)
    else:
        artworks.delete_one({"_id": ObjectId(artwork_id)})
        return make_response(jsonify({}), 200)


"""
    Retrieves all artworks by a specific artist.

    Args:
        artist_id (str): ID of the artist

    Query Parameters:
        pn (int): Page number (default: 1)
        ps (int): Page size (default: 10)

    Returns:
        200: List of artworks by the artist
        Format: [{"_id": str, "title": str, ...}, ...]
"""


@artwork_blueprint.route(
    "/api/v1.0/artworks/related/<string:artist_id>", methods=["GET"]
)
@jwt_required
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


"""
   Retrieves average ratings for all artworks.

   Query Parameters:
       pn (int): Page number (default: 1)
       ps (int): Page size (default: 12)

   Returns:
       200: List of artwork IDs with their average ratings
       500: Server error
       Format: [{"_id": str, "average_rating": float}, ...]
"""


@artwork_blueprint.route("/api/v1.0/artworks/average_rating", methods=["GET"])
def get_average_ratings():
    try:
        page_num = int(request.args.get("pn", 1))
        page_size = int(request.args.get("ps", 12))
        pipeline = [
            {
                "$unwind": {
                    "path": "$reviews",
                    "preserveNullAndEmptyArrays": True,
                }
            },
            {
                "$group": {
                    "_id": "$_id",
                    "average_rating": {
                        "$avg": {
                            "$ifNull": [
                                {"$round": ["$reviews.rating", 1]},
                                0,
                            ]
                        }
                    },
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "average_rating": {
                        "$cond": {
                            "if": {"$gt": ["$average_rating", 0]},
                            "then": {"$round": ["$average_rating", 1]},
                            "else": 0.0,
                        }
                    },
                }
            },
        ]
        average_ratings = list(artworks.aggregate(pipeline))
        for artwork in average_ratings:
            artwork["_id"] = str(artwork["_id"])
        return make_response(jsonify(average_ratings), 200)
    except Exception as e:
        return make_response(jsonify({"error": str(e)}), 500)


"""
    Filters artworks by their dimensions.

    Required JSON body:
        height_range (dict, optional):
            min (number, optional): Minimum height in cm
            max (number, optional): Maximum height in cm
        width_range (dict, optional):
            min (number, optional): Minimum width in cm
            max (number, optional): Maximum width in cm

    Returns:
        200: List of artworks matching dimension criteria
"""


@artwork_blueprint.route("/api/v1.0/artworks/filter/dimensions", methods=["GET"])
def filter_by_artwork_dimensions():
    page_num = int(request.args.get("pn", 1))
    page_size = int(request.args.get("ps", 12))
    try:
        min_height = (
            float(request.args.get("height_min"))
            if request.args.get("height_min")
            else None
        )
        max_height = (
            float(request.args.get("height_max"))
            if request.args.get("height_max")
            else None
        )
        min_width = (
            float(request.args.get("width_min"))
            if request.args.get("width_min")
            else None
        )
        max_width = (
            float(request.args.get("width_max"))
            if request.args.get("width_max")
            else None
        )

        match_criteria = {}

        if min_height is not None or max_height is not None:
            match_criteria["dimensions.height_cm"] = {}
            if min_height is not None:
                match_criteria["dimensions.height_cm"]["$gte"] = min_height
            if max_height is not None:
                match_criteria["dimensions.height_cm"]["$lte"] = max_height

        if min_width is not None or max_width is not None:
            match_criteria["dimensions.width_cm"] = {}
            if min_width is not None:
                match_criteria["dimensions.width_cm"]["$gte"] = min_width
            if max_width is not None:
                match_criteria["dimensions.width_cm"]["$lte"] = max_width

        total_artworks = artworks.count_documents(match_criteria)
        total_pages = (total_artworks + page_size - 1) // page_size

        pipeline = [
            {"$match": match_criteria},
            {
                "$project": {
                    "_id": 1,
                    "artist_id": 1,
                    "title": 1,
                    "description": 1,
                    "dimensions": 1,
                    "created_at": 1,
                    "updated_at": 1,
                    "images": 1,
                    "materials": 1,
                    "provenance": 1,
                }
            },
            {"$skip": (page_num - 1) * page_size},
            {"$limit": page_size},
        ]

        filtered_artworks = list(artworks.aggregate(pipeline))

        for artwork in filtered_artworks:
            artwork["_id"] = str(artwork["_id"])

        response = {
            "artworks": filtered_artworks,
            "page": page_num,
            "pageSize": page_size,
            "totalArtworks": total_artworks,
            "totalPages": total_pages,
        }

        return make_response(jsonify(response), 200)

    except Exception as e:
        return make_response(jsonify({"Unable to filter by dimensions.": str(e)}), 500)


"""
    Searches artworks by title.

    Returns:
        200: List of artworks matching search title.
"""


@artwork_blueprint.route("/api/v1.0/artworks/search", methods=["GET"])
def search_artworks_by_title():
    title = request.args.get("title", "").strip().lower()
    page_num = int(request.args.get("pn", 1))
    page_size = int(request.args.get("ps", 12))

    if not title:
        return make_response(jsonify({"error": "Title parameter is required"}), 400)

    # Calculate the total number of artworks that match the search
    total_artworks = artworks.count_documents(
        {"title": {"$regex": title, "$options": "i"}}
    )
    total_pages = (total_artworks + page_size - 1) // page_size

    artworks_cursor = (
        artworks.find({"title": {"$regex": title, "$options": "i"}}, {"reviews": 0})
        .skip((page_num - 1) * page_size)
        .limit(page_size)
    )

    data_to_return = []
    for artwork in artworks_cursor:
        artwork["_id"] = str(artwork["_id"])
        data_to_return.append(artwork)

    response = {
        "artworks": data_to_return,
        "page": page_num,
        "pageSize": page_size,
        "totalArtworks": total_artworks,
        "totalPages": total_pages,
    }

    return make_response(jsonify(response), 200)
