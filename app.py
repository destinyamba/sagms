import random
import uuid

from bson import ObjectId
from flask import Flask, make_response, jsonify, request

app = Flask(__name__)


artworks = {}
artists = {}
users = {}
exhibition = {}
reviews = {}


def generate_artworks_dummy_data():
    titles = [
        "The Last Supper",
        "The Persistence of Memory",
        "The Creation of Adam",
        "The Fall of Man",
    ]

    categories = [
        "Painting",
        "Sculpture",
        "Photograph",
        "Print",
        "Design",
        "Film",
        "Performance Art",
        "Installation",
    ]

    medium = [
        "Acrylic",
        "Oil",
        "Watercolor",
        "Gouache",
        "Charcoal",
        "Wood",
        "Metal",
        "Stone",
        "Clay",
        "Leather",
        "Glass",
        "Plastic",
        "Ceramic",
        "Textile",
        "Sapphire",
        "Emerald",
    ]

    material = [
        "Oil Paint",
        "Acrylic Paint",
        "Watercolor Paint",
        "Gouache Paint",
        "Charcoal",
        "Wood",
        "Metal",
        "Stone",
    ]

    provenances = [
        "Acquired from XYZ Auction House",
        "Purchased from ABC Gallery",
        "Donated by the local community",
    ]

    artwork_dict = {}

    for i in range(100):
        id = str(uuid.uuid4())
        artist_id = str(uuid.uuid4())
        title = titles[random.randint(0, len(titles) - 1)]
        category = categories[random.randint(0, len(categories) - 1)]
        height_cm = random.randint(100, 1000)
        width_cm = random.randint(100, 1000)
        provenance = provenances[random.randint(0, len(provenances) - 1)]
        materials = random.sample(material, random.randint(2, min(3, len(material))))

        artwork_dict[id] = {
            "title": title,
            "description": "This will be the description of the artwork",
            "artist_id": artist_id,
            "category": category,
            "images": ["url1", "url2"],
            "materials": materials,
            "dimensions": {"height_cm": height_cm, "width_cm": width_cm},
            "provenance": provenance,
            "created_at": "2013-12-01T00:00:00",
            "updated_at": "2013-12-01T00:00:00",
            "reviews": [],
        }
    return artwork_dict


def generate_users_dummy_data():

    user_dict = {}

    roles = ["VISITOR", "CURATOR", "ADMIN"]

    for i in range(10):
        id = str(uuid.uuid4())
        username = "user" + str(i)
        email = f"{username}@{username}.com"
        password = "password"
        role = roles[random.randint(0, len(roles) - 1)]
        created_at = "2023-12-01T00:00:00"

        user_dict[id] = {
            "username": username,
            "email": email,
            "password": password,
            "role": role,
            "created_at": created_at,
            "updated_at": created_at,
        }
    return user_dict


@app.route("/", methods=["GET"])
def index():
    return make_response("<h1>Hello, World! Destiny's making a flask app.</h1>", 200)


# Artworks endpoints


@app.route("/api/v1.0/artworks", methods=["GET"])
def get_artworks():
    page_num, page_size = 1, 10
    if request.args.get("pn"):
        page_num = int(request.args.get("pn"))
    if request.args.get("ps"):
        page_size = int(request.args.get("ps"))
    page_start = page_size * (page_num - 1)
    artworks_list = [{k: v} for k, v in artworks.items()]
    return make_response(
        jsonify(artworks_list[page_start : page_start + page_size]), 200
    )


@app.route("/api/v1.0/artworks/<string:artwork_id>", methods=["GET"])
def get_artwork(artwork_id):
    if artwork_id not in artworks:
        return make_response(jsonify({"error": "Artwork not found"}), 404)
    return make_response(jsonify(artworks[artwork_id]), 200)


@app.route("/api/v1.0/artworks/<string:artist_id>", methods=["POST"])
def create_artwork(artist_id):
    data = request.get_json()
    next_id = str(uuid.uuid4())
    # Validate required fields
    required_fields = ["title", "description", "category", "materials"]
    for field in required_fields:
        if field not in data or not data[field]:
            return make_response(
                jsonify({"error": f"Missing required field: {field}"}), 400
            )
    new_artwork = {
        "title": data.get("title", "title"),
        "artist_id": artist_id,
        "description": data.get("description", "description"),
        "category": data.get("category", "category"),
        "images": ["url1", "url2"],
        "materials": data.get("materials", "materials"),
        "dimensions": {
            "height_cm": data.get("height_cm", "height_cm"),
            "width_cm": data.get("width_cm", "width_cm"),
        },
        "provenance": data.get("provenance", "provenance"),
        "created_at": "2013-12-01T00:00:00",
        "updated_at": "2013-12-01T00:00:00",
        "reviews": [],
    }
    artworks[next_id] = new_artwork
    return make_response(jsonify({next_id: new_artwork}), 201)


@app.route("/api/v1.0/artworks/<string:artist_id>/<string:artwork_id>", methods=["PUT"])
def update_artwork(artist_id, artwork_id):
    data = request.get_json()
    if artwork_id not in artworks:
        return make_response(jsonify({"error": "Artwork not found"}), 404)
    elif artist_id != artworks[artwork_id]["artist_id"]:
        print("artist_id: ", artist_id)
        print("artwork_id: ", artworks[artwork_id]["artist_id"])
        return make_response(jsonify({"error": "Unauthorized to update artwork"}), 401)
    else:
        for field in data:
            if field in [
                "title",
                "description",
                "category",
                "materials",
                "height_cm",
                "width_cm",
                "provenance",
            ]:
                artworks[artwork_id][field] = data.get(
                    field, artworks[artwork_id][field]
                )
            else:
                return make_response(jsonify({"error": "Missing required fields"}), 400)

    return make_response(jsonify({artwork_id: artworks[artwork_id]}), 200)


@app.route(
    "/api/v1.0/artworks/<string:artist_id>/<string:artwork_id>", methods=["DELETE"]
)
def delete_artwork(artist_id, artwork_id):
    if artwork_id not in artworks:
        return make_response(jsonify({"error": "Artwork not found"}), 404)
    elif artist_id != artworks[artwork_id]["artist_id"]:
        return make_response(jsonify({"error": "Unauthorized to delete artwork"}), 401)
    else:
        del artworks[artwork_id]
        return make_response(jsonify({}), 200)


# User endpoints

# Only and ADMIN can create users.
# All users including artists can comment and review artworks and exhibitions.


@app.route("/api/v1.0/users", methods=["GET"])
def get_users():
    page_num, page_size = 1, 10
    if request.args.get("pn"):
        page_num = int(request.args.get("pn"))
    if request.args.get("ps"):
        page_size = int(request.args.get("ps"))
    page_start = page_size * (page_num - 1)
    users_list = [{k: v} for k, v in users.items()]
    return make_response(jsonify(users_list[page_start : page_start + page_size]), 200)


@app.route("/api/v1.0/users/<string:user_id>", methods=["GET"])
def get_user(user_id):
    if user_id not in users:
        return make_response(jsonify({"error": "User not found"}), 404)
    return make_response(jsonify(users[user_id]), 200)


@app.route("/api/v1.0/users/<string:user_id>", methods=["POST"])
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


@app.route("/api/v1.0/users/<string:user_id>", methods=["PUT"])
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


@app.route("/api/v1.0/users/<string:user_id>", methods=["DELETE"])
def delete_user(user_id):
    if user_id not in users:
        return make_response(jsonify({"error": "User not found"}), 404)
    elif users[user_id]["role"] != "ADMIN":
        return make_response(jsonify({"error": "Unauthorized to delete user"}), 401)
    else:
        del users[user_id]
        return make_response(jsonify({}), 200)


if __name__ == "__main__":
    artworks = generate_artworks_dummy_data()
    users = generate_users_dummy_data()
    app.run(debug=True)
