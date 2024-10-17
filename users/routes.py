import datetime
import bcrypt
import jwt
from flask import Blueprint, jsonify, make_response, request
from pymongo import MongoClient
from functools import wraps
import globals

user_blueprint = Blueprint("user", __name__)

client = MongoClient(
    "mongodb+srv://Cluster18362:zm5bZcXvos6OfIBU@cluster18362.r9onf.mongodb.net/"
)
db = client["smart-art-gallery"]
users = db.users


def jwt_required(func):
    @wraps(func)
    def jwt_required_wrapper(*args, **kwargs):
        token = None
        if "x-access-token" in request.headers:
            token = request.headers["x-access-token"]
        if not token:
            return make_response(jsonify({"message": "Token is missing"}), 401)
        try:
            data = jwt.decode(token, globals.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return make_response(jsonify({"message": "Token is expired"}), 401)
        except jwt.InvalidTokenError:
            return make_response(jsonify({"message": "Token is invalid"}), 401)
        return func(*args, **kwargs)

    return jwt_required_wrapper


@user_blueprint.route("/api/v1.0/login", methods=["GET"])
def login():
    auth = request.authorization
    if auth:
        user = users.find_one({"username": auth.username})
        if user is not None:
            if bcrypt.checkpw(
                bytes(auth.password, "UTF-8"), user["password"].encode("utf-8")
            ):

                token = jwt.encode(
                    {
                        "user": auth.username,
                        "exp": datetime.datetime.now(datetime.UTC)
                        + datetime.timedelta(minutes=30),
                    },
                    globals.SECRET_KEY,
                    algorithm="HS256",
                )
                return make_response(jsonify({"token": token}), 200)
            else:
                return make_response(jsonify({"message": "Invalid password"}), 401)
        else:
            return make_response(jsonify({"message": "User not found"}), 401)
    return make_response(
        "Authentication required",
        401,
        {"WWW-Authenticate": 'Basic realm = "Login Required"'},
    )
