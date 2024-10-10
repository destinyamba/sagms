# { User
#   "_id": ObjectId,
#   "username": "string",
#   "email": "string",
#   "password_hash": "string",
#   "role": "enum (admin, staff, visitor)",
#   "created_at": "datetime",
#   "updated_at": "datetime"
# }


# { Artwork
#   "_id": ObjectId,
#   "title": "Sunset Overdrive",
#   "artist_id": ObjectId,
#   "category": "Painting",
#   "media": {
#     "images": ["url1", "url2"],
#     "videos": ["url3"]
#   },
#   "materials": ["Oil Paint", "Canvas"],
#   "dimensions": {
#     "height_cm": 60,
#     "width_cm": 80
#   },
#   "provenance": "Acquired from XYZ Auction House",
#   "created_at": "datetime",
#   "updated_at": "datetime"
# }

# { Artist
#   "_id": ObjectId,
#   "name": "string",
#   "biography": "string",
#   "birthdate": "date",
#   "nationality": "string",
#   "portfolio": ["artwork_id1", "artwork_id2"],
#   "created_at": "datetime",
#   "updated_at": "datetime"
# }

# { Exhibition
#   "_id": ObjectId,
#   "title": "string",
#   "description": "string",
#   "start_date": "date",
#   "end_date": "date",
#   "artworks": ["artwork_id1", "artwork_id2"],
#   "venue": "string",
#   "created_at": "datetime",
#   "updated_at": "datetime"
# }

# { Reviews
#   "_id": ObjectId,
#   "user_id": ObjectId,
#   "exhibition_id": ObjectId,
#   "rating": "int (1-5)",
#   "comment": "string",
#   "created_at": "datetime",
#   "updated_at": "datetime"
# }

# Artist Schema
# const ArtistSchema = new Schema({
#  name: { type: String, required: true },
#  email: { type: String, required: true},
#  password: { type: String, required: true},
#  biography: String,
#  nationality: String
# });

# Artwork Schema
# const ArtworkSchema = new Schema({
#   title: { type: String, required: true },
#   description: String,
#   category: { type: String, required: true },
#   dimensions: { type: String, required: true  },
#   provenance: { type: String, required: true  },
#   creation_date: Date,
#   artist_id: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
#   image_url: String,
#   reviews: String
# });

# Curator Schema
# const CuratorSchema = new Schema({
#   name: { type: String, required: true },
#   email: { type: String, required: true, unique: true },
#   password: { type: String, required: true } // Hashed
# });

# Exhibition Schema
# const ExhibitionSchema = new Schema({
#   title: { type: String, required: true },
#   description: String,
#   start_date: Date,
#   end_date: Date,
#   curator_id: { type: Schema.Types.ObjectId, ref: 'Curator', required: true }
# });

# ExhibitionArtworks Schema
# const ExhibitionArtworksSchema = new Schema({
#   exhibition_id: { type: Schema.Types.ObjectId, ref: 'Exhibition', required: true },
#   artwork_ids: { type: Schema.Types.ObjectId, ref: 'Artwork', required: true }
# });
#
# User Schema
# const UserSchema = new Schema({
#   username: { type: String, required: true, unique: true },
#   email: { type: String, required: true, unique: true },
#   password: { type: String, required: true }, // Hashed
#   role: { type: String, enum: ['visitor', 'curator', 'artist'], default: 'visitor' }
# });

# Comment Schema
# const CommentSchema = new Schema({
#   user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
#   content: { type: String, required: true },
#   timestamp: { type: Date, default: Date.now },
# });

# Review Schema
# const ReviewSchema = new Schema({
#   user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
#   rating: { type: Number, min: 1, max: 5, required: true },
#   comment: String,
#   timestamp: { type: Date, default: Date.now },
# });
