import random
from datetime import datetime, timedelta, timezone
from pymongo import MongoClient
from bson import ObjectId


def generate_review_content():
    reviews = [
        "An impressive exhibition!",
        "The curation is thoughtful and engaging.",
        "One of the best collections I've seen.",
        "A profound experience.",
        "Beautifully organized and insightful.",
        "Each artwork adds to the narrative.",
        "A bit crowded but worth visiting.",
    ]
    return random.choice(reviews)


def generate_exhibitions_dummy_data(db_name, collection_name, connection_string):
    exhibitions_list = []
    themes = [
        "The Essence of Form",
        "Color and Motion",
        "Shadows and Light",
        "Reflections of Time",
        "Dreamscapes Unbound",
        "Abstract Visions",
        "Realities and Illusions",
        "Echoes of Nature",
        "Beyond the Horizon",
        "Faces and Figures",
        "Fragments of Memory",
        "Journey Through Time",
        "Whispers of Silence",
        "Elements of the Mind",
        "The Power of Color",
    ]

    descriptors = [
        "A journey into the unexplored realms of abstract art, where form and color play central roles.",
        "An exploration of the dynamic interplay between shadows and light, creating vivid contrasts.",
        "A collection of surreal landscapes that challenge the boundaries of reality and perception.",
        "An artistic dive into the essence of nature, capturing its raw beauty and organic forms.",
        "An assemblage of portraits that tell the stories of diverse cultures and identities.",
        "A reflective exhibition that delves into the intricacies of time and memory.",
        "A showcase of artworks that evoke serenity and solitude through minimalist expressions.",
        "A vibrant tribute to the power of colors and how they evoke emotions.",
        "An eclectic display of surreal and impressionist pieces, bringing dreamscapes to life.",
        "A celebration of the elements—earth, fire, water, air—in various artistic forms.",
    ]

    provenances = [
        "Acquired from XYZ Auction House",
        "Purchased from ABC Gallery",
        "Donated by the local community",
    ]

    artwork_ids = [
        "67112847eaf172ac8eb0f952",
        "67112847eaf172ac8eb0f953",
        "67112847eaf172ac8eb0f954",
        "67112847eaf172ac8eb0f955",
        "67112847eaf172ac8eb0f956",
        "67112847eaf172ac8eb0f957",
        "67112847eaf172ac8eb0f958",
        "67112847eaf172ac8eb0f959",
        "67112847eaf172ac8eb0f95a",
        "67112847eaf172ac8eb0f95b",
        "67112847eaf172ac8eb0f95c",
        "67112847eaf172ac8eb0f95d",
        "67112847eaf172ac8eb0f95e",
        "67112847eaf172ac8eb0f95f",
        "67112847eaf172ac8eb0f960",
        "67112847eaf172ac8eb0f961",
        "67112847eaf172ac8eb0f962",
        "67112847eaf172ac8eb0f963",
        "67112847eaf172ac8eb0f964",
        "67112847eaf172ac8eb0f965",
        "67112847eaf172ac8eb0f966",
        "67112847eaf172ac8eb0f967",
        "67112847eaf172ac8eb0f968",
        "67112847eaf172ac8eb0f969",
        "67112847eaf172ac8eb0f96a",
        "67112847eaf172ac8eb0f96b",
        "67112847eaf172ac8eb0f96c",
        "67112847eaf172ac8eb0f96d",
        "67112847eaf172ac8eb0f96e",
        "67112847eaf172ac8eb0f96f",
        "67112847eaf172ac8eb0f970",
        "67112847eaf172ac8eb0f971",
        "67112847eaf172ac8eb0f972",
        "67112847eaf172ac8eb0f973",
        "67112847eaf172ac8eb0f974",
        "67112847eaf172ac8eb0f975",
        "67112847eaf172ac8eb0f976",
        "67112847eaf172ac8eb0f977",
        "67112847eaf172ac8eb0f978",
        "67112847eaf172ac8eb0f979",
        "67112847eaf172ac8eb0f97a",
        "67112847eaf172ac8eb0f97b",
        "67112847eaf172ac8eb0f97c",
        "67112847eaf172ac8eb0f97d",
        "67112847eaf172ac8eb0f97e",
        "67112847eaf172ac8eb0f97f",
        "67112847eaf172ac8eb0f980",
        "67112847eaf172ac8eb0f981",
        "67112847eaf172ac8eb0f982",
        "67112847eaf172ac8eb0f983",
        "67112847eaf172ac8eb0f984",
        "67112847eaf172ac8eb0f985",
        "67112847eaf172ac8eb0f986",
        "67112847eaf172ac8eb0f987",
        "67112847eaf172ac8eb0f988",
        "67112847eaf172ac8eb0f989",
        "67112847eaf172ac8eb0f98a",
        "67112847eaf172ac8eb0f98b",
        "67112847eaf172ac8eb0f98c",
        "67112847eaf172ac8eb0f98d",
        "67112847eaf172ac8eb0f98e",
        "67112847eaf172ac8eb0f98f",
        "67112847eaf172ac8eb0f990",
        "67112847eaf172ac8eb0f991",
        "67112847eaf172ac8eb0f992",
        "67112847eaf172ac8eb0f993",
        "67112847eaf172ac8eb0f994",
        "67112847eaf172ac8eb0f995",
        "67112847eaf172ac8eb0f996",
        "67112847eaf172ac8eb0f997",
        "67112847eaf172ac8eb0f998",
        "67112847eaf172ac8eb0f999",
        "67112847eaf172ac8eb0f99a",
        "67112847eaf172ac8eb0f99b",
        "67112847eaf172ac8eb0f99c",
        "67112847eaf172ac8eb0f99d",
        "67112847eaf172ac8eb0f99e",
        "67112847eaf172ac8eb0f99f",
        "67112847eaf172ac8eb0f9a0",
        "67112847eaf172ac8eb0f9a1",
        "67112847eaf172ac8eb0f9a2",
        "67112847eaf172ac8eb0f9a3",
        "67112847eaf172ac8eb0f9a4",
        "67112847eaf172ac8eb0f9a5",
        "67112847eaf172ac8eb0f9a6",
        "67112847eaf172ac8eb0f9a7",
        "67112847eaf172ac8eb0f9a8",
        "67112847eaf172ac8eb0f9a9",
        "67112847eaf172ac8eb0f9aa",
        "67112847eaf172ac8eb0f9ab",
        "67112847eaf172ac8eb0f9ac",
        "67112847eaf172ac8eb0f9ad",
        "67112847eaf172ac8eb0f9ae",
        "67112847eaf172ac8eb0f9af",
        "67112847eaf172ac8eb0f9b0",
        "67112847eaf172ac8eb0f9b1",
        "67112847eaf172ac8eb0f9b2",
        "67112847eaf172ac8eb0f9b3",
        "67112847eaf172ac8eb0f9b4",
        "67112847eaf172ac8eb0f9b5",
        "671c0bb18745ac5b6ddc419a",
        "671f75a2a373eaac33487bbe",
        "671f7fe67774ba108013ab59",
        "671f802c7774ba108013ab5a",
        "671f8172a6020d8fd80dd23f",
        "671f820aa6020d8fd80dd243",
        "671f8248a6020d8fd80dd247",
        "671f8301a6020d8fd80dd24b",
        "671f830ba6020d8fd80dd24c",
        "671f8348a6020d8fd80dd24d",
        "671f8550670694083251c17d",
        "671f8552670694083251c17e",
        "671f8554670694083251c17f",
        "671f8594670694083251c182",
        "671f8e174f7fbd76ed12983b",
        "671fa22c0891b7fb192f9cd8",
    ]

    exhibition_template = {
        "_id": ObjectId(),
        "curator_id": "671126abeaf172ac8eb0f947",
        "title": random.choice(themes),
        "description": random.choice(descriptors),
        "provenance": random.choice(provenances),
        "artworks": random.sample(
            artwork_ids, random.randint(10, 15)
        ),  # Placeholder ID
        "created_at": datetime(
            2024, 10, 14, 16, 20, 53, 650000, tzinfo=timezone.utc
        ).isoformat(),
        "updated_at": datetime(
            2024, 10, 14, 16, 20, 53, 650000, tzinfo=timezone.utc
        ).isoformat(),
    }

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

    reviews = []
    num_reviews = random.randint(17, 35)
    for _ in range(num_reviews):
        exhibition_artworks = random.sample(artwork_ids, random.randint(10, 15))
        reviews = []
        for _ in range(
            random.randint(17, 35)
        ):  # Generate 17-35 reviews for each exhibition
            reviews.append(
                {
                    "_id": ObjectId(),  # Random unique ID for each review
                    "reviewer_id": random.choice(reviewer_ids),
                    "content": generate_review_content(),
                    "rating": random.randint(2, 5),
                    "created_at": datetime.now(timezone.utc).isoformat(),
                }
            )

        exhibition = {
            "_id": ObjectId(),
            "curator_id": "671126abeaf172ac8eb0f947",
            "title": random.choice(themes),
            "description": random.choice(descriptors),
            "provenance": random.choice(provenances),
            "artworks": exhibition_artworks,
            "reviews": reviews,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        exhibitions_list.append(exhibition)

    client = MongoClient(connection_string)
    db = client[db_name]
    exhibitions_collection = db[collection_name]
    result = exhibitions_collection.insert_many(exhibitions_list)
    print(f"Inserted {len(result.inserted_ids)} exhibitions.")

    exhibition_template["reviews"] = reviews
    exhibitions_list.append(exhibition_template)

    return exhibitions_list
