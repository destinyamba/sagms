import json
import os
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

    artwork_list = []

    artist_ids = [
        "6706a33aa75522a709ddbd0c",
        "6706a33aa75522a709ddbd0d",
        "6706a33aa75522a709ddbd0e",
        "6706a33aa75522a709ddbd0f",
        "6706a33aa75522a709ddbd10",
        "6706a33aa75522a709ddbd11",
        "6706a33aa75522a709ddbd12",
        "6706a33aa75522a709ddbd13",
        "6706a33aa75522a709ddbd14",
        "6706a33aa75522a709ddbd15",
    ]

    image_directory = "sagms-images"
    image_files = [
        f
        for f in os.listdir(image_directory)
        if os.path.isfile(os.path.join(image_directory, f))
    ]

    for i in range(100):
        selected_artist_id = random.choice(artist_ids)
        title = titles[random.randint(0, len(titles) - 1)]
        category = categories[random.randint(0, len(categories) - 1)]
        height_cm = random.randint(100, 1000)
        width_cm = random.randint(100, 1000)
        provenance = provenances[random.randint(0, len(provenances) - 1)]
        materials = random.sample(material, random.randint(2, min(3, len(material))))

        image_path = os.path.join(image_directory, random.choice(image_files))

        artwork = {
            "title": title,
            "description": "This will be the description of the artwork",
            "artist_id": selected_artist_id,
            "category": category,
            "images": [image_path],
            "materials": materials,
            "dimensions": {"height_cm": height_cm, "width_cm": width_cm},
            "provenance": provenance,
            "created_at": "2013-12-01T00:00:00",
            "updated_at": "2013-12-01T00:00:00",
            "reviews": [],
        }
        artwork_list.append(artwork)
    with open("artworks.json", "w") as f:
        json.dump(artwork_list, f, indent=4)
    return artwork_list


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


def generate_artists_dummy_data():
    artist_list = []

    names = [
        "Vincent van Gogh",
        "Pablo Picasso",
        "Leonardo da Vinci",
        "Claude Monet",
        "Frida Kahlo",
        "Georgia O'Keeffe",
        "Salvador Dalí",
        "Banksy",
        "Andy Warhol",
        "Yayoi Kusama",
    ]

    for i in range(10):
        name = names[random.randint(0, len(names) - 1)]
        biography = "This is the biography of artist"
        created_at = "2023-12-01T00:00:00"
        updated_at = "2023-12-01T00:00:00"

        artist = {
            "name": name,
            "biography": biography,
            "created_at": created_at,
            "updated_at": updated_at,
        }
        artist_list.append(artist)
    with open("artists.json", "w") as f:
        json.dump(artist_list, f, indent=4)

    return artist_list


if __name__ == "__main__":
    artworks = generate_artworks_dummy_data()
    users = generate_users_dummy_data()
    artists = generate_artists_dummy_data()
    app.run(debug=True)
