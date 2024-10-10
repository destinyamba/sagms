from flask import Blueprint, jsonify, make_response, request
from pymongo import MongoClient

curator_blueprint = Blueprint("curator", __name__)

client = MongoClient(
    "mongodb+srv://Cluster18362:zm5bZcXvos6OfIBU@cluster18362.r9onf.mongodb.net/"
)
db = client["smart-art-gallery"]
artworks = db.artworks
curator = db.curator
