from flask import Flask
from pymongo import MongoClient
from artworks.routes import artwork_blueprint
from curators.routes import curator_blueprint
from users.routes import user_blueprint

app = Flask(__name__)

client = MongoClient(
    "mongodb+srv://Cluster18362:zm5bZcXvos6OfIBU@cluster18362.r9onf.mongodb.net/"
)
db = client["smart-art-gallery"]
artworks = db.artworks
users = db.users
curators = db.curators

app.register_blueprint(artwork_blueprint)
app.register_blueprint(user_blueprint)
app.register_blueprint(curator_blueprint)

if __name__ == "__main__":
    app.run(debug=True)
