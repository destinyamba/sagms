import datetime
from math import ceil

from bson import ObjectId
from flask import Blueprint, jsonify, make_response, request
from pymongo import MongoClient

import globals
from users.routes import jwt_required

exhibition_blueprint = Blueprint("exhibition", __name__)

client = MongoClient(globals.MONGO_URI)
db = client["smart-art-gallery"]
exhibitions = db.exhibitions
users = db.users


def convert_objectid(data):
    """Recursively convert ObjectId fields to strings in a dictionary."""
    if isinstance(data, dict):
        return {key: convert_objectid(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_objectid(element) for element in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data


"""
   Adds exhibitions. Only curators can create exhibitions.
"""


@exhibition_blueprint.route(
    "/api/v1.0/exhibitions/<string:curator_id>", methods=["POST"]
)
@jwt_required
def create_exhibition(curator_id):
    data = request.get_json()

    curator = users.find_one({"_id": ObjectId(curator_id)})
    if curator is None:
        return make_response(jsonify({"error": "Curator not found"}), 404)
    if str(curator["role"]) != "CURATOR":
        return make_response(
            jsonify(
                {
                    "error": str(curator["role"])
                    + " user not authorised to create artwork"
                }
            ),
            403,
        )

    data["curator_id"] = curator_id

    if not data:
        return make_response(jsonify({"error": "No input data provided"}), 400)

    new_exhibition = {
        "curator_id": curator_id,
        "title": data.get("title", "title").strip(),
        "description": data.get("description", "description").strip(),
        "provenance": data.get("provenance", "provenance").strip(),
        "artworks": data.get("artworks", "artworks"),  # list of artwork ids.
        "reviews": [],
        "created_at": datetime.datetime.now(),
        "updated_at": datetime.datetime.now(),
    }

    exhibition = exhibitions.insert_one(new_exhibition)

    return make_response(jsonify({"exhibition_id": str(exhibition.inserted_id)}), 201)


"""
   Retrieve all existing exhibitions.
"""


@exhibition_blueprint.route(
    "/api/v1.0/exhibitions",
    methods=["GET"],
)
def get_exhibitions():
    page_num, page_size = 1, 12
    if request.args.get("pn"):
        page_num = int(request.args.get("pn"))
    if request.args.get("ps"):
        page_size = int(request.args.get("ps"))
    page_start = page_size * (page_num - 1)

    data_to_return = []
    for exhibition in (
        exhibitions.find({}, {"reviews": 0}).skip(page_start).limit(page_size)
    ):
        exhibition["_id"] = str(exhibition["_id"])
        for review in exhibition.get("reviews", []):
            review["_id"] = str(review["_id"])
        data_to_return.append(exhibition)
    return make_response(jsonify(data_to_return), 200)


@exhibition_blueprint.route("/api/v1.0/totalExhibitions", methods=["GET"])
def get_total_exhibitions():
    data_to_return = []
    for exhibition in exhibitions.find({}, {"reviews": 0}):
        exhibition["_id"] = str(exhibition["_id"])
        data_to_return.append(exhibition)
    return make_response(jsonify(len(data_to_return)), 200)


"""
   Retrieves a specific exhibition.
"""


@exhibition_blueprint.route(
    "/api/v1.0/exhibitions/<string:exhibition_id>", methods=["GET"]
)
@jwt_required
def get_exhibition(exhibition_id):
    exhibition = exhibitions.find_one({"_id": ObjectId(exhibition_id)}, {"reviews": 0})
    if exhibition is not None:
        exhibition["_id"] = str(exhibition["_id"])
        return make_response(jsonify(exhibition), 200)
    else:
        return make_response(jsonify({"error": "Exhibition not found"}), 404)


"""
   Edits exhibitions. Only the curator that created the exhibition can edit.
"""


@exhibition_blueprint.route(
    "/api/v1.0/exhibitions/<string:curator_id>/<string:exhibition_id>", methods=["PUT"]
)
@jwt_required
def update_exhibition(curator_id, exhibition_id):
    data = request.get_json()

    # Find the exhibition in the database
    exhibition = exhibitions.find_one({"_id": ObjectId(exhibition_id)})
    if exhibition is None:
        return make_response(jsonify({"error": "Exhibition not found"}), 404)

    # Check if the curator_id matches
    if curator_id != exhibition["curator_id"]:
        return make_response(
            jsonify({"error": "Unauthorized to update exhibition"}), 401
        )

    # Fields that can be updated
    update_fields = {
        key: data[key]
        for key in ["title", "description", "provenance", "artworks"]
        if key in data
    }

    # Update the exhibition in the database
    exhibitions.update_one({"_id": ObjectId(exhibition_id)}, {"$set": update_fields})

    # Retrieve the updated exhibition from the database
    updated_exhibition = exhibitions.find_one({"_id": ObjectId(exhibition_id)})

    if updated_exhibition:
        # Convert ObjectIds to strings
        updated_exhibition = convert_objectid(updated_exhibition)

        # Return the updated exhibition as a JSON response
        return make_response(jsonify(updated_exhibition), 200)
    else:
        return make_response(jsonify({"error": "Failed to update exhibition"}), 500)


"""
   Removes exhibitions. Only the curator that created the exhibition or an admin can delete exhibitions.
"""


@exhibition_blueprint.route(
    "/api/v1.0/exhibitions/<string:exhibition_id>",
    methods=["DELETE"],
)
@jwt_required
def delete_exhibition(exhibition_id):
    exhibition = exhibitions.find_one({"_id": ObjectId(exhibition_id)})
    if exhibition is None:
        return make_response(jsonify({"error": "Exhibition not found"}), 404)

    user = users.find_one({"_id": ObjectId(exhibition["curator_id"])})
    if user is None:
        return make_response(jsonify({"error": "Curator not found"}), 404)

    if str(user["role"]) not in ["CURATOR", "ADMIN"]:
        return make_response(
            jsonify({"error": "Unauthorized to delete exhibition"}), 401
        )

    exhibitions.delete_one({"_id": ObjectId(exhibition_id)})
    return make_response(jsonify({}), 200)


"""
   Retrieves all exhibitions created by a curator.
"""


@exhibition_blueprint.route(
    "/api/v1.0/exhibitions/related/<string:curator_id>", methods=["GET"]
)
@jwt_required
def get_related_exhibitions_by_curator(curator_id):
    page_num, page_size = 1, 12
    if request.args.get("pn"):
        page_num = int(request.args.get("pn"))
    if request.args.get("ps"):
        page_size = int(request.args.get("ps"))

    page_start = page_size * (page_num - 1)
    total_exhibitions = exhibitions.count_documents({})  # Get total count of artworks
    total_pages = ceil(total_exhibitions / page_size)

    data_to_return = []

    for exhibition in (
        exhibitions.find({"curator_id": curator_id}, {"reviews": 0})
        .sort("created_at", -1)
        .skip(page_start)
        .limit(page_size)
    ):
        exhibition["_id"] = str(exhibition["_id"])
        data_to_return.append(exhibition)

    response = {
        "exhibitions": data_to_return,
        "page": page_num,
        "pageSize": page_size,
        "totalExhibitions": total_exhibitions,
        "totalPages": total_pages,
    }
    return make_response(jsonify(response), 200)


"""
   Retrieves the top 5 exhibitions with the most reviews.
"""


@exhibition_blueprint.route("/api/v1.0/exhibitions/top-rated", methods=["GET"])
def get_top_5_exhibitions_with_most_reviews():
    pipeline = [
        {"$unwind": "$reviews"},
        {"$group": {"_id": "$_id", "review_count": {"$sum": 1}}},
        {"$sort": {"review_count": -1}},
        {"$limit": 5},
        {
            "$lookup": {
                "from": "exhibitions",
                "localField": "_id",
                "foreignField": "_id",
                "as": "exhibition",
            }
        },
        {"$unwind": "$exhibition"},
        {
            "$project": {
                "_id": 0,
                "exhibition_id": {"$toString": "$_id"},
                "title": "$exhibition.title",
                "review_count": 1,
            }
        },
    ]
    result = list(exhibitions.aggregate(pipeline))
    return make_response(jsonify(result), 200)


"""
   Retrieves exhibitions created in the last 30 days.
"""


@exhibition_blueprint.route("/api/v1.0/exhibitions/most-recent", methods=["GET"])
def get_exhibitions_created_in_last_30_days():
    pipeline = [
        {
            "$match": {
                "created_at": {
                    "$gte": datetime.datetime.now() - datetime.timedelta(days=30)
                }
            }
        },
        {"$project": {"_id": {"$toString": "$_id"}, "title": 1, "created_at": 1}},
    ]
    result = list(exhibitions.aggregate(pipeline))
    return make_response(jsonify(result), 200)
