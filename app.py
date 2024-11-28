from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from generate_artworks import generate_artworks_dummy_data
from generate_exhibitions import generate_exhibitions_dummy_data
from generate_reviews import (
    generate_random_review,
    update_existing_reviews_with_ids,
    bulk_add_reviews_mongodb,
)
from flask import Flask
from pymongo import MongoClient
from artworks.routes import artwork_blueprint
from exhibitions.routes import exhibition_blueprint
from reviews.routes import review_blueprint
from users.routes import user_blueprint
import globals

app = Flask(__name__)
CORS(app)

client = MongoClient(
    "mongodb+srv://Cluster18362:zm5bZcXvos6OfIBU@cluster18362.r9onf.mongodb.net/"
)
db = client["smart-art-gallery"]
artworks_collection = db.arworks


def get_artwork_ids(connection_string, db_name, artworks_collection_name):
    # Connect to the MongoDB client (update the URI as needed)
    client = MongoClient(connection_string)

    # Access the database and collection
    db = client[db_name]
    artworks_collection = db[artworks_collection_name]

    # Retrieve all artwork IDs and store them as strings in a list
    artwork_ids = [
        str(artwork["_id"]) for artwork in artworks_collection.find({}, {"_id": 1})
    ]

    return artwork_ids

client = MongoClient(globals.MONGO_URI)
db = client["smart-art-gallery"]
artworks = db.artworks
users = db.users
exhibitions = db.exhibitions

app.register_blueprint(artwork_blueprint)
app.register_blueprint(user_blueprint)
app.register_blueprint(exhibition_blueprint)
app.register_blueprint(review_blueprint)

if __name__ == "__main__":
    MONGO_CONNECTION_STRING = "mongodb+srv://Cluster18362:zm5bZcXvos6OfIBU@cluster18362.r9onf.mongodb.net/"  # Replace with your connection string
    DB_NAME = "smart-art-gallery"
    ARTWORKS_COLLECTION_NAME = "artworks"
    EXHIBITION_COLLECTION_NAME = "exhibitions"

    # update_existing_reviews_with_ids(
    #     DB_NAME, ARTWORKS_COLLECTION_NAME, MONGO_CONNECTION_STRING
    # )
    # bulk_add_reviews_mongodb(DB_NAME, ARTWORKS_COLLECTION_NAME, MONGO_CONNECTION_STRING)

    # get artwork ids
    # artwork_id_list = get_artwork_ids(
    #     MONGO_CONNECTION_STRING, DB_NAME, ARTWORKS_COLLECTION_NAME
    # )
    # print(artwork_id_list)

    generate_exhibitions_dummy_data(
        DB_NAME, EXHIBITION_COLLECTION_NAME, MONGO_CONNECTION_STRING
    )
    app.run(debug=True)
