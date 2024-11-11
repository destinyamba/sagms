from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from artworks.routes import artwork_blueprint
from exhibitions.routes import exhibition_blueprint
from reviews.routes import review_blueprint
from users.routes import user_blueprint
import globals

app = Flask(__name__)
CORS(app)

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
    app.run(debug=True)
