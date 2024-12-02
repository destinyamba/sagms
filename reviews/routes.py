import datetime
from math import ceil
from bson import ObjectId
from flask import Blueprint, jsonify, make_response, request
from pymongo import MongoClient
import globals
from users.routes import jwt_required, admin_required

review_blueprint = Blueprint("review", __name__)

client = MongoClient(globals.MONGO_URI)
db = client["smart-art-gallery"]
users = db.users
artworks = db.artworks
exhibitions = db.exhibitions

"""
   Adds reviews to artworks. All users can add reviews.
"""


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


"""
    Adds reviews to exhibitions. All users can add reviews.
"""


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


"""
    Retrieves reviews of an artwork.
"""


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

    # Get all reviews for the artwork
    reviews = artwork.get("reviews", [])
    total_reviews = len(reviews)
    total_pages = ceil(total_reviews / page_size)

    paginated_reviews = reviews[::-1][page_start : page_start + page_size]
    data_to_return = []
    for review in paginated_reviews:
        review["_id"] = str(review["_id"])

        if "username" not in review:
            user = users.find_one({"_id": ObjectId(review["reviewer_id"])})
            review["username"] = (
                user.get("username", "Unknown User") if user else "Unknown User"
            )

        data_to_return.append(review)

    response = {
        "reviews": data_to_return,
        "page": page_num,
        "pageSize": page_size,
        "totalReviews": total_reviews,
        "totalPages": total_pages,
    }

    return make_response(jsonify(response), 200)


"""
    Removes reviews of an artwork. Only an admin can remove reviews.
"""


@review_blueprint.route(
    "/api/v1.0/reviews/artwork/<string:artwork_id>/<string:artwork_review_id>",
    methods=["DELETE"],
)
@jwt_required
@admin_required
def delete_artwork_review(artwork_id, artwork_review_id):
    review = artworks.find_one(
        {
            "_id": ObjectId(artwork_id),
            "reviews": {"$elemMatch": {"_id": ObjectId(artwork_review_id)}},
        }
    )

    # If the review is found, delete it
    if review:
        result = artworks.update_one(
            {"_id": ObjectId(artwork_id)},
            {"$pull": {"reviews": {"_id": ObjectId(artwork_review_id)}}},
        )
        if result.modified_count > 0:
            return make_response(
                jsonify({"message": "Review deleted successfully"}), 200
            )
        else:
            return make_response(jsonify({"message": "Review not found"}), 404)

    # If the review is not found, return a 404 response
    return make_response(jsonify({"message": "Review not found"}), 404)


"""
    Remove reviews of an exhibition. Only an admin can remove reviews.
"""


@review_blueprint.route(
    "/api/v1.0/reviews/exhibition/<string:exhibition_id>/<string:exhibition_review_id>",
    methods=["DELETE"],
)
@jwt_required
@admin_required
def delete_exhibition_review(exhibition_id, exhibition_review_id):
    review = exhibitions.find_one(
        {
            "_id": ObjectId(exhibition_id),
            "reviews": {"$elemMatch": {"_id": ObjectId(exhibition_review_id)}},
        },
    )

    # If the review is found, delete it
    if review:
        result = exhibitions.update_one(
            {"_id": ObjectId(exhibition_id)},
            {"$pull": {"reviews": {"_id": ObjectId(exhibition_review_id)}}},
        )
        if result.modified_count > 0:
            return make_response(
                jsonify({"message": "Review deleted successfully"}), 200
            )
        else:
            return make_response(jsonify({"message": "Review not found"}), 404)

    # If the review is not found, return a 404 response
    return make_response(jsonify({"message": "Review not found"}), 404)


"""
    Retrieve reviews of an exhibition.
"""


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
    total_reviews = len(reviews)
    total_pages = ceil(total_reviews / page_size)

    paginated_reviews = reviews[::-1][page_start : page_start + page_size]
    data_to_return = []

    for review in paginated_reviews:
        review["_id"] = str(review["_id"])

        if "username" not in review:
            user = users.find_one({"_id": ObjectId(review["reviewer_id"])})
            review["username"] = (
                user.get("username", "Unknown User") if user else "Unknown User"
            )

        data_to_return.append(review)

    response = {
        "reviews": data_to_return,
        "page": page_num,
        "pageSize": page_size,
        "totalReviews": total_reviews,
        "totalPages": total_pages,
    }

    return make_response(jsonify(response), 200)
