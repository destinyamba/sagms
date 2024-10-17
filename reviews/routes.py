import datetime
from bson import ObjectId
from flask import Blueprint, jsonify, make_response, request
from pymongo import MongoClient

from users.routes import jwt_required

review_blueprint = Blueprint("review", __name__)

client = MongoClient(
    "mongodb+srv://Cluster18362:zm5bZcXvos6OfIBU@cluster18362.r9onf.mongodb.net/"
)
db = client["smart-art-gallery"]
users = db.users
artworks = db.artworks
exhibitions = db.exhibitions


@review_blueprint.route(
    "/api/v1.0/reviews/artwork/<string:reviewer_id>/<string:artwork_id>",
    methods=["POST"],
)
@jwt_required
def create_artwork_review(reviewer_id, artwork_id):
    data = request.get_json()

    artwork = artworks.find_one({"_id": ObjectId(artwork_id)})
    reviewer = users.find_one({"_id": ObjectId(reviewer_id)})

    if artwork is None:
        return make_response(jsonify({"error": "Artwork not found"}), 404)
    elif reviewer is None:
        return make_response(jsonify({"error": "Reviewer not found"}), 404)

    new_review = {
        "_id": ObjectId(),
        "reviewer_id": reviewer_id,
        "content": data.get("content", "").strip(),
        "rating": data.get("rating", 0),
        "created_at": datetime.datetime.now(),
    }

    artworks.update_one(
        {"_id": ObjectId(artwork_id)}, {"$push": {"reviews": new_review}}
    )

    new_review["_id"] = str(new_review["_id"])
    new_review["created_at"] = new_review["created_at"].isoformat()

    return make_response(jsonify(new_review), 201)


@review_blueprint.route(
    "/api/v1.0/reviews/exhibition/<string:reviewer_id>/<string:exhibition_id>",
    methods=["POST"],
)
@jwt_required
def create_exhibition_review(reviewer_id, exhibition_id):
    data = request.get_json()

    exhibition = exhibitions.find_one({"_id": ObjectId(exhibition_id)})
    reviewer = users.find_one({"_id": ObjectId(reviewer_id)})

    if exhibition is None:
        return make_response(jsonify({"error": "Exhibition not found"}), 404)
    elif reviewer is None:
        return make_response(jsonify({"error": "Reviewer not found"}), 404)

    new_review = {
        "_id": ObjectId(),
        "reviewer_id": reviewer_id,
        "content": data.get("content", "").strip(),
        "rating": data.get("rating", 0),
        "created_at": datetime.datetime.now(),
    }

    exhibitions.update_one(
        {"_id": ObjectId(exhibition_id)}, {"$push": {"reviews": new_review}}
    )

    new_review["_id"] = str(new_review["_id"])
    new_review["created_at"] = new_review["created_at"].isoformat()

    return make_response(jsonify(new_review), 201)


@review_blueprint.route(
    "/api/v1.0/reviews/artwork/<string:artwork_id>", methods=["GET"]
)
@jwt_required
def get_reviews_for_artwork(artwork_id):
    page_num, page_size = 1, 5
    if request.args.get("pn"):
        page_num = int(request.args.get("pn"))
    if request.args.get("ps"):
        page_size = int(request.args.get("ps"))
    page_start = page_size * (page_num - 1)

    artwork = artworks.find_one({"_id": ObjectId(artwork_id)})

    if artwork is None:
        return make_response(jsonify({"error": "Artwork not found"}), 404)

    reviews = artwork.get("reviews", [])
    paginated_reviews = reviews[page_start : page_start + page_size]
    data_to_return = []
    for review in paginated_reviews:
        review["_id"] = str(review["_id"])
        data_to_return.append(review)

    return make_response(jsonify(data_to_return), 200)


@review_blueprint.route(
    "/api/v1.0/reviews/exhibition/<string:exhibition_id>", methods=["GET"]
)
@jwt_required
def get_reviews_for_exhibition(exhibition_id):
    page_num, page_size = 1, 5
    if request.args.get("pn"):
        page_num = int(request.args.get("pn"))
    if request.args.get("ps"):
        page_size = int(request.args.get("ps"))
    page_start = page_size * (page_num - 1)

    exhibition = exhibitions.find_one({"_id": ObjectId(exhibition_id)})

    if exhibition is None:
        return make_response(jsonify({"error": "Exhibition not found"}), 404)

    reviews = exhibition.get("reviews", [])
    paginated_reviews = reviews[page_start : page_start + page_size]
    data_to_return = []

    for review in paginated_reviews:
        review["_id"] = str(review["_id"])
        data_to_return.append(review)

    return make_response(jsonify(data_to_return), 200)
