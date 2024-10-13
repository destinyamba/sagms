from bson import ObjectId
from flask import Blueprint, jsonify, make_response, request
from pymongo import MongoClient

exhibition_blueprint = Blueprint("exhibition", __name__)

client = MongoClient(
    "mongodb+srv://Cluster18362:zm5bZcXvos6OfIBU@cluster18362.r9onf.mongodb.net/"
)
db = client["smart-art-gallery"]
exhibitions = db.exhibitions
users = db.users


@exhibition_blueprint.route(
    "/api/v1.0/exhibitions/<string:curator_id>", methods=["POST"]
)
def create_exhibition(curator_id):
    data = request.get_json()

    # found curator id in users db.
    # if not found, return not found.
    # if found but not curator role, return unauthorized.

    new_exhibition = {
        "curator_id": curator_id,
        "title": data.get("title", "title").strip(),
        "description": data.get("description", "description").strip(),
        "provenance": data.get("provenance", "provenance").strip(),
        "artworks": [],  # list of artwork ids.
        "reviews": [],
        "created_at": "2013-12-01T00:00:00",
        "updated_at": "2013-12-01T00:00:00",
    }

    exhibition = exhibitions.insert_one(new_exhibition)

    return make_response(jsonify({"exhibition_id": str(exhibition.inserted_id)}), 201)


# get all exhibitions.
@exhibition_blueprint.route(
    "/api/v1.0/exhibitions/<string:curator_id>/<string:exhibition_id>",
    methods=["GET"],
)
def get_exhibitions():
    page_num, page_size = 1, 10
    if request.args.get("pn"):
        page_num = int(request.args.get("pn"))
    if request.args.get("ps"):
        page_size = int(request.args.get("ps"))
    page_start = page_size * (page_num - 1)

    data_to_return = []
    for exhibition in exhibitions.find().skip(page_start).limit(page_size):
        exhibition["_id"] = str(exhibition["_id"])
        for review in exhibition.get("reviews", []):
            review["_id"] = str(review["_id"])
        data_to_return.append(exhibition)
    return make_response(jsonify(data_to_return), 200)


# get an exhibition.
@exhibition_blueprint.route(
    "/api/v1.0/exhibitions/<string:curator_id>", methods=["GET"]
)
def get_artwork(curator_id):
    exhibition = exhibitions.find_one({"_id": ObjectId(curator_id)})
    if exhibition is not None:
        exhibition["_id"] = str(exhibition["_id"])
        for review in exhibition.get("reviews", []):
            review["_id"] = str(review["_id"])
        return make_response(jsonify(exhibition), 200)
    else:
        return make_response(jsonify({"error": "Exhibition not found"}), 404)


# update an exhibition.
@exhibition_blueprint.route(
    "/api/v1.0/exhibitions/<string:curator_id>/<string:exhibition_id>"
)
def update_exhibition(curator_id, exhibition_id):
    data = request.get_json()

    exhibition = exhibitions.find_one({"_id": ObjectId(exhibition_id)})
    if exhibition is None:
        return make_response(jsonify({"error": "Artwork not found"}), 404)
    elif curator_id != exhibition["curator_id"]:
        return make_response(
            jsonify({"error": "Unauthorized to update exhibition"}), 401
        )

    # Fields that can be updated.
    update_fields = {
        key: data[key]
        for key in [
            "title",
            "description",
            "provenance",
            "artworks",
        ]
        if key in data
    }

    exhibitions.update_one({"_id": ObjectId(exhibition_id)}, {"$set": update_fields})
    updated_exhibition = exhibitions.find_one({"_id": ObjectId(exhibition_id)})
    updated_exhibition["_id"] = str(updated_exhibition["_id"])

    return make_response(jsonify(updated_exhibition), 200)


# delete an exhibition.
@exhibition_blueprint.route(
    "/api/v1.0/exhibitions/<string:curator_id>/<string:exhibition_id>",
    methods=["DELETE"],
)
def delete_exhibition(curator_id, exhibition_id):
    exhibition = exhibitions.find_one({"_id": ObjectId(exhibition_id)})
    if exhibition is None:
        return make_response(jsonify({"error": "Exhibition not found"}), 404)
    elif curator_id != exhibition["curator_id"]:
        return make_response(
            jsonify({"error": "Unauthorized to delete exhibition"}), 401
        )
    else:
        exhibitions.delete_one({"_id": ObjectId(exhibition_id)})
        return make_response(jsonify({}), 200)


@exhibition_blueprint.route(
    "/api/v1.0/exhibitions/related/<string:curator_id>", methods=["GET"]
)
def get_related_exhibitions_by_curator(curator_id):
    page_num, page_size = 1, 10
    if request.args.get("pn"):
        page_num = int(request.args.get("pn"))
    if request.args.get("ps"):
        page_size = int(request.args.get("ps"))
    page_start = page_size * (page_num - 1)

    data_to_return = []

    exhibitions_cursor = (
        exhibitions.find({"curator_id": curator_id}).skip(page_start).limit(page_size)
    )

    for exhibition in exhibitions_cursor:
        exhibition["_id"] = str(exhibition["_id"])
        for review in exhibition.get("reviews", []):
            review["_id"] = str(review["_id"])
        data_to_return.append(exhibition)

    return make_response(jsonify(data_to_return), 200)
