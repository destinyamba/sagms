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
            "artist_id": artist_id,
            "category": category,
            "media": {"images": ["url1", "url2"]},
            "materials": materials,
            "dimensions": {"height_cm": height_cm, "width_cm": width_cm},
            "provenance": provenance,
            "created_at": "2013-12-01T00:00:00",
            "updated_at": "2013-12-01T00:00:00",
            "reviews": [],
        }
    return artwork_dict


@app.route("/", methods=["GET"])
def index():
    return make_response("<h1>Hello, World! Destiny's making a flask app.</h1>", 200)


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


if __name__ == "__main__":
    artworks = generate_artworks_dummy_data()
    app.run(debug=True)
