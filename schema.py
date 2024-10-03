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




