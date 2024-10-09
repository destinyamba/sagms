import uuid

from flask import Blueprint, jsonify, make_response, request
from pymongo import MongoClient

user_blueprint = Blueprint("user", __name__)

client = MongoClient(
    "mongodb+srv://Cluster18362:zm5bZcXvos6OfIBU@cluster18362.r9onf.mongodb.net/"
)
db = client["smart-art-gallery"]
users = db.users


@user_blueprint.route("/api/v1.0/users", methods=["GET"])
def get_users():
    page_num, page_size = 1, 10
    if request.args.get("pn"):
        page_num = int(request.args.get("pn"))
    if request.args.get("ps"):
        page_size = int(request.args.get("ps"))
    page_start = page_size * (page_num - 1)
    users_list = [{k: v} for k, v in users.items()]
    return make_response(jsonify(users_list[page_start : page_start + page_size]), 200)


@user_blueprint.route("/api/v1.0/users/<string:user_id>", methods=["GET"])
def get_user(user_id):
    if user_id not in users:
        return make_response(jsonify({"error": "User not found"}), 404)
    return make_response(jsonify(users[user_id]), 200)


@user_blueprint.route("/api/v1.0/users/<string:user_id>", methods=["POST"])
def create_user(user_id):
    if users[user_id]["role"] != "ADMIN":
        return make_response(jsonify({"error": "Unauthorized to update user"}), 401)
    else:
        data = request.get_json()
        next_id = str(uuid.uuid4())
        new_user = {
            "username": data.get("username", "username"),
            "email": data.get("email", "email"),
            "password": data.get("password", "password"),
            "role": data.get("role", "role"),
            "created_at": "2023-12-01T00:00:00",
            "updated_at": "2023-12-01T00:00:00",
        }
        users[next_id] = new_user
        return make_response(jsonify({next_id: new_user}), 201)


@user_blueprint.route("/api/v1.0/users/<string:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()
    if user_id not in users:
        return make_response(jsonify({"error": "User not found"}), 404)
    elif users[user_id]["role"] != "ADMIN":
        return make_response(jsonify({"error": "Unauthorized to update user"}), 401)
    else:
        for field in data:
            if field in ["username", "email", "password", "role"]:
                users[user_id][field] = data.get(field, users[user_id][field])
            else:
                return make_response(jsonify({"error": "Missing required fields"}), 400)

    return make_response(jsonify({user_id: users[user_id]}), 200)


@user_blueprint.route("/api/v1.0/users/<string:user_id>", methods=["DELETE"])
def delete_user(user_id):
    if user_id not in users:
        return make_response(jsonify({"error": "User not found"}), 404)
    elif users[user_id]["role"] != "ADMIN":
        return make_response(jsonify({"error": "Unauthorized to delete user"}), 401)
    else:
        del users[user_id]
        return make_response(jsonify({}), 200)
