import datetime
import bcrypt
import jwt
from flask import Blueprint, jsonify, make_response, request
from pymongo import MongoClient
from functools import wraps
import globals

user_blueprint = Blueprint("user", __name__)

client = MongoClient(globals.MONGO_URI)
db = client["smart-art-gallery"]
users = db.users
blacklist = db.blacklist

"""
    Decorator to implement jwt authorization to endpoints.
"""


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
        bl_token = blacklist.find_one({"token": token})
        if bl_token is not None:
            return make_response(jsonify({"message": "Token has been cancelled"}), 401)
        return func(*args, **kwargs)

    return jwt_required_wrapper


"""
    Introduces a user to the API.
"""


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
                        "admin": user["role"] == "ADMIN",
                        "exp": datetime.datetime.now(datetime.timezone.utc)
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


"""
    Decorator to restrict operations to non admins.
"""


def admin_required(func):
    @wraps(func)
    def admin_required_wrapper(*args, **kwargs):
        token = request.headers["x-access-token"]
        data = jwt.decode(token, globals.SECRET_KEY, algorithms=["HS256"])
        if data["admin"]:
            return func(*args, **kwargs)
        else:
            return make_response(jsonify({"message": "Admin privileges required"}), 403)

    return admin_required_wrapper


"""
    Log out a user and expire JWT token.
"""


@user_blueprint.route("/api/v1.0/logout", methods=["GET"])
@jwt_required
def logout():
    token = request.headers["x-access-token"]
    blacklist.insert_one({"token": token})
    return make_response(jsonify({"message": "Logged out"}), 200)
