import random
from datetime import datetime, timezone
from bson import ObjectId
from pymongo import UpdateOne, MongoClient
from pymongo.errors import OperationFailure

reviewer_ids = [
    "671126abeaf172ac8eb0f94e",
    "671126abeaf172ac8eb0f942",
    "671126abeaf172ac8eb0f943",
    "671126abeaf172ac8eb0f944",
    "671126abeaf172ac8eb0f947",
    "671126abeaf172ac8eb0f946",
    "671126abeaf172ac8eb0f945",
    "671126abeaf172ac8eb0f94f",
    "671126abeaf172ac8eb0f94b",
]


def connect_to_mongodb(connection_string):
    """Establish connection to MongoDB."""
    try:
        client = MongoClient(connection_string)
        # Test the connection
        client.admin.command("ping")
        return client
    except ConnectionError:
        print(
            "Failed to connect to MongoDB. Please check your connection string and network connection."
        )
        return None
    except Exception as e:
        print(f"An error occurred while connecting to MongoDB: {str(e)}")
        return None


def update_existing_reviews_with_ids(db_name, collection_name, connection_string):
    """Update existing reviews to add ObjectId if missing."""
    client = connect_to_mongodb(connection_string)
    if not client:
        return False

    try:
        db = client[db_name]
        collection = db[collection_name]

        # Find all artworks with reviews
        artworks_with_reviews = collection.find({"reviews": {"$ne": []}})
        bulk_operations = []

        for artwork in artworks_with_reviews:
            updated_reviews = []
            needs_update = False

            for review in artwork.get("reviews", []):
                if "_id" not in review:
                    needs_update = True
                    review["_id"] = ObjectId()
                updated_reviews.append(review)

            if needs_update:
                bulk_operations.append(
                    UpdateOne(
                        {"_id": artwork["_id"]},
                        {
                            "$set": {
                                "reviews": updated_reviews,
                                "updated_at": datetime.now(timezone.utc),
                            }
                        },
                    )
                )

        if bulk_operations:
            result = collection.bulk_write(bulk_operations)
            print(
                f"Successfully updated {result.modified_count} artworks with review IDs"
            )
        else:
            print("No reviews needed updating")

        return True

    except OperationFailure as e:
        print(f"MongoDB operation failed: {str(e)}")
        return False
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return False
    finally:
        client.close()


def generate_review_content():
    """Generate a realistic art review content."""
    openings = [
        "A fascinating piece that",
        "This artwork beautifully",
        "An intriguing composition that",
        "A masterful creation that",
        "The artist skillfully",
    ]

    descriptions = [
        "captures the essence of modern expression",
        "demonstrates exceptional technical skill",
        "explores the boundaries of conventional art",
        "conveys deep emotional resonance",
        "showcases innovative use of materials",
    ]

    impressions = [
        "leaving a lasting impression on the viewer",
        "creating a powerful visual experience",
        "drawing the audience into its narrative",
        "challenging traditional perspectives",
        "inspiring deep contemplation",
    ]

    review = f"{random.choice(openings)} {random.choice(descriptions)}, {random.choice(impressions)}."
    return review


def generate_random_review():
    """Generate a complete review object."""
    return {
        "_id": ObjectId(),
        "reviewer_id": random.choice(reviewer_ids),
        "content": generate_review_content(),
        "rating": random.randint(2, 5),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }


def bulk_add_reviews_mongodb(
    db_name, collection_name, connection_string, num_reviews_range=(12, 30)
):
    """Add random reviews to artworks in MongoDB using bulk operations."""
    client = connect_to_mongodb(connection_string)
    if not client:
        return False

    try:
        db = client[db_name]
        collection = db[collection_name]

        # Find all artworks with empty reviews array
        bulk_operations = []
        artworks_without_reviews = collection.find()

        for artwork in artworks_without_reviews:
            num_reviews = random.randint(*num_reviews_range)
            new_reviews = [generate_random_review() for _ in range(num_reviews)]

            # Prepare bulk update operation
            bulk_operations.append(
                UpdateOne(
                    {"_id": artwork["_id"]},
                    {
                        "$set": {
                            "reviews": new_reviews,
                            "updated_at": datetime.now(timezone.utc),
                        }
                    },
                )
            )

        # Execute bulk operations if any
        if bulk_operations:
            result = collection.bulk_write(bulk_operations)
            print(f"Successfully updated {result.modified_count} artworks")
        else:
            print("No artworks found without reviews")

        return True

    except OperationFailure as e:
        print(f"MongoDB operation failed: {str(e)}")
        return False
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return False
    finally:
        client.close()
