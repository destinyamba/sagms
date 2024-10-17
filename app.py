from flask import Flask
from pymongo import MongoClient
from artworks.routes import artwork_blueprint
from exhibitions.routes import exhibition_blueprint
from reviews.routes import review_blueprint
from users.routes import user_blueprint

app = Flask(__name__)

client = MongoClient(
    "mongodb+srv://Cluster18362:zm5bZcXvos6OfIBU@cluster18362.r9onf.mongodb.net/"
)
db = client["smart-art-gallery"]
artworks = db.artworks
users = db.users
exhibitions = db.exhibitions

app.register_blueprint(artwork_blueprint)
app.register_blueprint(user_blueprint)
app.register_blueprint(exhibition_blueprint)
app.register_blueprint(review_blueprint)

if __name__ == "__main__":
    app.run(debug=True)
