import json
import os
import random
import uuid
from datetime import datetime, timezone

import bcrypt

from bson import ObjectId
from flask import Flask, make_response, jsonify, request
from pymongo import MongoClient, UpdateOne
from pymongo.errors import OperationFailure

app = Flask(__name__)

client = MongoClient(
    "mongodb+srv://Cluster18362:zm5bZcXvos6OfIBU@cluster18362.r9onf.mongodb.net/"
)
db = client["smart-art-gallery"]
artworks_collection = db.arworks

artworks = {}
users = {}
reviews = {}


def generate_artworks_dummy_data():
    titles = [
        "The Last Supper",
        "The Persistence of Memory",
        "The Creation of Adam",
        "The Fall of Man",
        "Whispers of the Forgotten",
        "Eclipse of Serenity",
        "Echoes of the Eternal",
        "Dreamscapes in Indigo",
        "Fragments of Time",
        "Luminescence of Solitude",
        "Veil of the Infinite",
        "Harmony of the Elements",
        "Shadows of a Lost Horizon",
        "Reflections of a Distant Memory",
    ]

    categories = [
        "Abstract",
        "Portraiture",
        "Landscape",
        "Still Life",
        "Surrealism",
        "Impressionism",
        "Cubism",
        "Expressionism",
        "Minimalism",
        "Pop Art",
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
        "671126abeaf172ac8eb0f942",
        "671126abeaf172ac8eb0f944",
        "671126abeaf172ac8eb0f946",
        "671126abeaf172ac8eb0f948",
        "671126abeaf172ac8eb0f94a",
        "671126abeaf172ac8eb0f94b",
        "671126abeaf172ac8eb0f94c",
        "671126abeaf172ac8eb0f94d",
        "671126abeaf172ac8eb0f94f",
        "671126abeaf172ac8eb0f950",
    ]

    # all_image_links = [
    #     "https://drive.google.com/file/d/14GQ6on1xRj20C7VUeKKKDyHRpAUxN59L/view?usp=drive_link, https://drive.google.com/file/d/1_61MLzz3n2qsnLwWUhdljIMCXukvvLPu/view?usp=drive_link, https://drive.google.com/file/d/10Gy-v3nXt68i66y3ISRZ3q_ZSXnq6qPr/view?usp=drive_link, https://drive.google.com/file/d/1mmWy5KiIvnmI8b4vDSVYiZ1ifHBjJ-ME/view?usp=drive_link, https://drive.google.com/file/d/11HP64_qHl_217pI0ZSPKd-NhbV4L5I5y/view?usp=drive_link, https://drive.google.com/file/d/1sUYdoZQkPXKbte-MlHPuxjq5tsbgoShj/view?usp=drive_link, https://drive.google.com/file/d/1rIo36LTDsF11Pe91-tz2qVcdmZbEC_ta/view?usp=drive_link, https://drive.google.com/file/d/1SyMHngtkdy9Il9xiF1ucXZ_9gxrftoj2/view?usp=drive_link, https://drive.google.com/file/d/1OBt4xqbYCweAygY8qIXvC1YwHn2SwcpA/view?usp=drive_link, https://drive.google.com/file/d/1GnKnerPJy7elN2nefjoIr5_L67bbVWjT/view?usp=drive_link, https://drive.google.com/file/d/1Co0-NVHywU1KVGgAkveytL8Azo1QiKcr/view?usp=drive_link, https://drive.google.com/file/d/18p_Fo16UunAsZd7_CVbctk2EzZF7o_a7/view?usp=drive_link, https://drive.google.com/file/d/11mHZoeZ-daiAGCPjdA2fMHIgYuHipFI_/view?usp=drive_link, https://drive.google.com/file/d/1oEP6mRjWH1ZAQgJhyxP0BG2gPYxQay6W/view?usp=drive_link, https://drive.google.com/file/d/1jFocZvJBqBDzsqs6eY6FDpR5wxEPAwei/view?usp=drive_link, https://drive.google.com/file/d/1dVzzDecEHXXay6VO7b-46UBJx7dsuaVE/view?usp=drive_link, https://drive.google.com/file/d/1h2tcrm_ZBu2KR_naI1bLvdVBvR22OaKl/view?usp=drive_link, https://drive.google.com/file/d/1iz7SgvHy4TUDuTAUyM9LcHp82M_C9Rcf/view?usp=drive_link, https://drive.google.com/file/d/191MYE2a-wTgU2ZqPjwjhQiJgr-VgFKfc/view?usp=drive_link, https://drive.google.com/file/d/18meMcEmj6kCzLXN5SuP7wPKvp88ut-di/view?usp=drive_link, https://drive.google.com/file/d/170mLnkPwhvU1p8EKBCNVya9Yta8QFPMI/view?usp=drive_link, https://drive.google.com/file/d/1rEPXLq1encet_GYL0ANCcB5JhehCWEbi/view?usp=drive_link, https://drive.google.com/file/d/1G42OLBzdf1Uu8nS0LB2RkAptbuNw0Zbn/view?usp=drive_link, https://drive.google.com/file/d/1EBdbz2YDmjmZOxu9rQd2Xt50v4vLOLGr/view?usp=drive_link, https://drive.google.com/file/d/1e06c7FJ84A2XN1_fml85hh4pBmNqqFsD/view?usp=drive_link, https://drive.google.com/file/d/1fvllZ0FvYGdyMBmRlWVn1jDMm9_WU7XB/view?usp=drive_link, https://drive.google.com/file/d/1vAqr0IjjlVuAItQsyr0y0aPbf2v6_iM-/view?usp=drive_link, https://drive.google.com/file/d/1WbCKV00QKMnBJ_qCVrTGD8g51XiBZGTP/view?usp=drive_link, https://drive.google.com/file/d/16oNNs9g7kOS90-XdHQbg6K3Y5CPfLTD8/view?usp=drive_link, https://drive.google.com/file/d/1cgDPj50c95rdSaBS7eJBhiYQAS1TZh5o/view?usp=drive_link, https://drive.google.com/file/d/1Uoflfzy0Et3HTf_yzclQ-fuo34hLPjTW/view?usp=drive_link, https://drive.google.com/file/d/16vaF6t9w8JS2ZeO7h8iN3juAnriCXpEq/view?usp=drive_link, https://drive.google.com/file/d/1TrsxbIVBpdblx1qOcah1WslZQSH5EHSN/view?usp=drive_link, https://drive.google.com/file/d/125HG6KjdfgcO3r3mzedN_kXrDS3q9EoC/view?usp=drive_link, https://drive.google.com/file/d/1CzJjSlFprYJzMffl5QbBjWwyHHcFH22e/view?usp=drive_link, https://drive.google.com/file/d/1bvK72jUDv68Jy9Xl5QlhoLMi0NVSHZPy/view?usp=drive_link, https://drive.google.com/file/d/1BQQmrB0rpXzqY58KU_mg5dfr1zGyoyA2/view?usp=drive_link, https://drive.google.com/file/d/1775Yvoc_FCFVBX-TAMO4WjyU_Uhr75ur/view?usp=drive_link, https://drive.google.com/file/d/1WJdX8YUMyYXfgrKZheGAq1ij2cAmJs2S/view?usp=drive_link, https://drive.google.com/file/d/1n6Txi8am86TY90Go7SWVfen9N8aQyhQA/view?usp=drive_link, https://drive.google.com/file/d/1mx3ohxfC9uy1eFyW5ovybo_QSXajzoIM/view?usp=drive_link, https://drive.google.com/file/d/18b7r_Tvhkfg48KDm4VmEdlcGHQtSDdBp/view?usp=drive_link, https://drive.google.com/file/d/10Fi5s0DAD4f7HIwOTpxEVO01wKba4-l-/view?usp=drive_link, https://drive.google.com/file/d/1m9HeofqCpxbwF5pXMSkfXo2hzN5Yq9Rk/view?usp=drive_link, https://drive.google.com/file/d/1Kk92SuUWpSWLJOKyDTmSd6PQnKcrLPKU/view?usp=drive_link, https://drive.google.com/file/d/11m8QynjC2_g1HyMVUMnKbMnyp0lgegEA/view?usp=drive_link, https://drive.google.com/file/d/1CIqgfVbvcWLGTVuowub-Tu0JUa_6jdje/view?usp=drive_link, https://drive.google.com/file/d/1qkzRphm6XCSXltDKJw8QatlcxM9_3dNy/view?usp=drive_link, https://drive.google.com/file/d/1T3vHmRAvEcGMWEN_rvTO7oFhdrwc50gn/view?usp=drive_link, https://drive.google.com/file/d/1XDQ8TmddSHjmYlvOp4FH3Y2wuedbIRSi/view?usp=drive_link, https://drive.google.com/file/d/157r9Z6UEVd8IePNpF3b_kYBi8H7LyFOx/view?usp=drive_link, https://drive.google.com/file/d/1P2fqAT9s0tupG6P73nAzA_NnAAUWFPzj/view?usp=drive_link, https://drive.google.com/file/d/1eF4k7PfNEe_hshe_xZxALmDlS7ftad8H/view?usp=drive_link, https://drive.google.com/file/d/1GexXPESnGfG7l6V3PhaJzy8qwYtV-ONU/view?usp=drive_link, https://drive.google.com/file/d/1a7C6GNUKNvqpP7e5WL8bjPpB9-Cn0cNE/view?usp=drive_link, https://drive.google.com/file/d/1XY5kSm4N8lnjmKp5ZJj_4iOo_3E17D8n/view?usp=drive_link, https://drive.google.com/file/d/1lmHAou940tmCBMrWPv4-iwREXxRGkFTd/view?usp=drive_link, https://drive.google.com/file/d/1Nh1DTonNu61u7mznFfAE7vLrZBDkDxQI/view?usp=drive_link, https://drive.google.com/file/d/16U-H-1bViU6GPkPgKwLkj3aBqGviZ6NH/view?usp=drive_link"
    # ]
    # split by comma into a new array. and remove spaces
    # split_image_links = []
    # for image_link in all_image_links:
    #     split_image_links.append(image_link.split(", "))

    # print(split_image_links)
    image_links = [
        "https://drive.google.com/file/d/14GQ6on1xRj20C7VUeKKKDyHRpAUxN59L/view?usp=drive_link",
        "https://drive.google.com/file/d/1_61MLzz3n2qsnLwWUhdljIMCXukvvLPu/view?usp=drive_link",
        "https://drive.google.com/file/d/10Gy-v3nXt68i66y3ISRZ3q_ZSXnq6qPr/view?usp=drive_link",
        "https://drive.google.com/file/d/1mmWy5KiIvnmI8b4vDSVYiZ1ifHBjJ-ME/view?usp=drive_link",
        "https://drive.google.com/file/d/11HP64_qHl_217pI0ZSPKd-NhbV4L5I5y/view?usp=drive_link",
        "https://drive.google.com/file/d/1sUYdoZQkPXKbte-MlHPuxjq5tsbgoShj/view?usp=drive_link",
        "https://drive.google.com/file/d/1rIo36LTDsF11Pe91-tz2qVcdmZbEC_ta/view?usp=drive_link",
        "https://drive.google.com/file/d/1SyMHngtkdy9Il9xiF1ucXZ_9gxrftoj2/view?usp=drive_link",
        "https://drive.google.com/file/d/1OBt4xqbYCweAygY8qIXvC1YwHn2SwcpA/view?usp=drive_link",
        "https://drive.google.com/file/d/1GnKnerPJy7elN2nefjoIr5_L67bbVWjT/view?usp=drive_link",
        "https://drive.google.com/file/d/1Co0-NVHywU1KVGgAkveytL8Azo1QiKcr/view?usp=drive_link",
        "https://drive.google.com/file/d/18p_Fo16UunAsZd7_CVbctk2EzZF7o_a7/view?usp=drive_link",
        "https://drive.google.com/file/d/11mHZoeZ-daiAGCPjdA2fMHIgYuHipFI_/view?usp=drive_link",
        "https://drive.google.com/file/d/1oEP6mRjWH1ZAQgJhyxP0BG2gPYxQay6W/view?usp=drive_link",
        "https://drive.google.com/file/d/1jFocZvJBqBDzsqs6eY6FDpR5wxEPAwei/view?usp=drive_link",
        "https://drive.google.com/file/d/1dVzzDecEHXXay6VO7b-46UBJx7dsuaVE/view?usp=drive_link",
        "https://drive.google.com/file/d/1h2tcrm_ZBu2KR_naI1bLvdVBvR22OaKl/view?usp=drive_link",
        "https://drive.google.com/file/d/1iz7SgvHy4TUDuTAUyM9LcHp82M_C9Rcf/view?usp=drive_link",
        "https://drive.google.com/file/d/191MYE2a-wTgU2ZqPjwjhQiJgr-VgFKfc/view?usp=drive_link",
        "https://drive.google.com/file/d/18meMcEmj6kCzLXN5SuP7wPKvp88ut-di/view?usp=drive_link",
        "https://drive.google.com/file/d/170mLnkPwhvU1p8EKBCNVya9Yta8QFPMI/view?usp=drive_link",
        "https://drive.google.com/file/d/1rEPXLq1encet_GYL0ANCcB5JhehCWEbi/view?usp=drive_link",
        "https://drive.google.com/file/d/1G42OLBzdf1Uu8nS0LB2RkAptbuNw0Zbn/view?usp=drive_link",
        "https://drive.google.com/file/d/1EBdbz2YDmjmZOxu9rQd2Xt50v4vLOLGr/view?usp=drive_link",
        "https://drive.google.com/file/d/1e06c7FJ84A2XN1_fml85hh4pBmNqqFsD/view?usp=drive_link",
        "https://drive.google.com/file/d/1fvllZ0FvYGdyMBmRlWVn1jDMm9_WU7XB/view?usp=drive_link",
        "https://drive.google.com/file/d/1vAqr0IjjlVuAItQsyr0y0aPbf2v6_iM-/view?usp=drive_link",
        "https://drive.google.com/file/d/1WbCKV00QKMnBJ_qCVrTGD8g51XiBZGTP/view?usp=drive_link",
        "https://drive.google.com/file/d/16oNNs9g7kOS90-XdHQbg6K3Y5CPfLTD8/view?usp=drive_link",
        "https://drive.google.com/file/d/1cgDPj50c95rdSaBS7eJBhiYQAS1TZh5o/view?usp=drive_link",
        "https://drive.google.com/file/d/1Uoflfzy0Et3HTf_yzclQ-fuo34hLPjTW/view?usp=drive_link",
        "https://drive.google.com/file/d/16vaF6t9w8JS2ZeO7h8iN3juAnriCXpEq/view?usp=drive_link",
        "https://drive.google.com/file/d/1TrsxbIVBpdblx1qOcah1WslZQSH5EHSN/view?usp=drive_link",
        "https://drive.google.com/file/d/125HG6KjdfgcO3r3mzedN_kXrDS3q9EoC/view?usp=drive_link",
        "https://drive.google.com/file/d/1CzJjSlFprYJzMffl5QbBjWwyHHcFH22e/view?usp=drive_link",
        "https://drive.google.com/file/d/1bvK72jUDv68Jy9Xl5QlhoLMi0NVSHZPy/view?usp=drive_link",
        "https://drive.google.com/file/d/1BQQmrB0rpXzqY58KU_mg5dfr1zGyoyA2/view?usp=drive_link",
        "https://drive.google.com/file/d/1775Yvoc_FCFVBX-TAMO4WjyU_Uhr75ur/view?usp=drive_link",
        "https://drive.google.com/file/d/1WJdX8YUMyYXfgrKZheGAq1ij2cAmJs2S/view?usp=drive_link",
        "https://drive.google.com/file/d/1n6Txi8am86TY90Go7SWVfen9N8aQyhQA/view?usp=drive_link",
        "https://drive.google.com/file/d/1mx3ohxfC9uy1eFyW5ovybo_QSXajzoIM/view?usp=drive_link",
        "https://drive.google.com/file/d/18b7r_Tvhkfg48KDm4VmEdlcGHQtSDdBp/view?usp=drive_link",
        "https://drive.google.com/file/d/10Fi5s0DAD4f7HIwOTpxEVO01wKba4-l-/view?usp=drive_link",
        "https://drive.google.com/file/d/1m9HeofqCpxbwF5pXMSkfXo2hzN5Yq9Rk/view?usp=drive_link",
        "https://drive.google.com/file/d/1Kk92SuUWpSWLJOKyDTmSd6PQnKcrLPKU/view?usp=drive_link",
        "https://drive.google.com/file/d/11m8QynjC2_g1HyMVUMnKbMnyp0lgegEA/view?usp=drive_link",
        "https://drive.google.com/file/d/1CIqgfVbvcWLGTVuowub-Tu0JUa_6jdje/view?usp=drive_link",
        "https://drive.google.com/file/d/1qkzRphm6XCSXltDKJw8QatlcxM9_3dNy/view?usp=drive_link",
        "https://drive.google.com/file/d/1T3vHmRAvEcGMWEN_rvTO7oFhdrwc50gn/view?usp=drive_link",
        "https://drive.google.com/file/d/1XDQ8TmddSHjmYlvOp4FH3Y2wuedbIRSi/view?usp=drive_link",
        "https://drive.google.com/file/d/157r9Z6UEVd8IePNpF3b_kYBi8H7LyFOx/view?usp=drive_link",
        "https://drive.google.com/file/d/1P2fqAT9s0tupG6P73nAzA_NnAAUWFPzj/view?usp=drive_link",
        "https://drive.google.com/file/d/1eF4k7PfNEe_hshe_xZxALmDlS7ftad8H/view?usp=drive_link",
        "https://drive.google.com/file/d/1GexXPESnGfG7l6V3PhaJzy8qwYtV-ONU/view?usp=drive_link",
        "https://drive.google.com/file/d/1a7C6GNUKNvqpP7e5WL8bjPpB9-Cn0cNE/view?usp=drive_link",
        "https://drive.google.com/file/d/1XY5kSm4N8lnjmKp5ZJj_4iOo_3E17D8n/view?usp=drive_link",
        "https://drive.google.com/file/d/1lmHAou940tmCBMrWPv4-iwREXxRGkFTd/view?usp=drive_link",
        "https://drive.google.com/file/d/1Nh1DTonNu61u7mznFfAE7vLrZBDkDxQI/view?usp=drive_link",
        "https://drive.google.com/file/d/16U-H-1bViU6GPkPgKwLkj3aBqGviZ6NH/view?usp=drive_link",
    ]

    for i in range(100):
        selected_artist_id = random.choice(artist_ids)
        title = titles[random.randint(0, len(titles) - 1)]
        category = categories[random.randint(0, len(categories) - 1)]
        height_cm = random.randint(100, 1000)
        width_cm = random.randint(100, 1000)
        provenance = provenances[random.randint(0, len(provenances) - 1)]
        materials = random.sample(material, random.randint(2, min(3, len(material))))
        image_directories = image_links[random.randint(0, len(image_links) - 1)]

        artwork = {
            "title": title,
            "description": "This will be the description of the artwork",
            "artist_id": selected_artist_id,
            "category": category,
            "images": [image_directories],
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

    user_list = []

    roles = ["ARTIST", "VISITOR", "CURATOR", "ADMIN", "ARTIST", "ARTIST"]
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
        "Nova Ryn",
        "Samantha Williams",
        "Wassily Kandinsky",
        "Vera Rubin",
        "Amelia Earhart",
        "Rene Magritte",
        "Aiden Vos",
        "Lira Hale",
        "Kai Valen",
        "Suri Neven",
        "Orion Kade",
        "Esra Nyx",
        "Zephra Quinn",
        "Mira Skye",
        "Lennox Rae",
    ]

    for i in range(15):
        username = names[random.randint(0, len(names) - 1)]
        email = f"{username}@{username}.com"
        password = "password"
        role = roles[random.randint(0, len(roles) - 1)]
        created_at = "2023-12-01T00:00:00"

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        user = {
            "username": username,
            "email": email,
            "password": hashed_password.decode("utf-8"),
            "role": role,
            "created_at": created_at,
            "updated_at": created_at,
        }
        # user["password"] = bcrypt.hashpw(user["password"], bcrypt.gensalt())
        if user["role"] == "ARTIST":
            user["biography"] = "This is the biography of artist."
        user_list.append(user)
    with open("users.json", "w") as f:
        json.dump(user_list, f, indent=4)
    return user_list


def generate_review():
    review = {
        "_id": ObjectId(),  # Automatically generate an ObjectId
        "reviewer_id": str(ObjectId()),  # Mock reviewer_id as ObjectId in string format
        "content": random.choice(
            [
                "I must say I appreciate the mood tones.",
                "Great experience, would recommend!",
                "The service could be better, but overall decent.",
                "Really loved the ambiance and the staff were friendly.",
                "A bit overpriced, but worth it for a treat!",
                "Absolutely stunning! The colors and texture bring such depth to the piece.",
                "A truly mesmerizing work, I could gaze at it for hours.",
                "The artist's intention shines through, very thought-provoking.",
                "The details in this piece are exquisite, a masterpiece.",
                "Unique and refreshing. The composition is well-balanced.",
                "An amazing artwork that captures the essence of human emotion.",
                "Impressive use of medium, brings out the artist's skills.",
                "A bold statement, the colors evoke strong emotions.",
                "The artist's vision is clear and compelling.",
                "Absolutely loved the abstract elements in this piece!",
                "A solid addition to the exhibition, highly recommend viewing.",
            ]
        ),
        "rating": random.randint(1, 5),  # Random rating from 1 to 5
        "created_at": datetime.now(),  # Set the current UTC time
    }
    return review


# Insert a number of reviews into the database
def insert_reviews(num_reviews=10):
    reviews = [generate_review() for _ in range(num_reviews)]
    result = artworks_collection.insert_many(reviews)
    print(f"Inserted {len(result.inserted_ids)} reviews.")


# Call the function to insert generated reviews
insert_reviews(5)  # Change the number to the desired amount


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


def generate_random_review():
    """Generate a complete review object."""
    return {
        "_id": ObjectId(),
        "reviewer_id": random.choice(reviewer_ids),
        "content": generate_review_content(),
        "rating": random.randint(2, 5),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }


def add_reviews_to_artwork(artwork_data, num_reviews_range=(0, 3)):
    """Add random number of reviews to artwork that has no reviews."""
    modified_data = artwork_data.copy()

    for artwork in modified_data:
        if not artwork["reviews"]:  # Only add reviews if the artwork has none
            num_reviews = random.randint(*num_reviews_range)
            artwork["reviews"] = [generate_random_review() for _ in range(num_reviews)]

    return modified_data


def update_json_file(input_file, output_file):
    """Read JSON file, add reviews, and save to new file."""
    try:
        # Read existing JSON data
        with open(input_file, "r") as f:
            data = json.load(f)

        # Add reviews
        modified_data = add_reviews_to_artwork(data)

        # Save modified data
        with open(output_file, "w") as f:
            json.dump(modified_data, f, indent=2)

        print(f"Successfully updated reviews and saved to {output_file}")

    except FileNotFoundError:
        print(f"Error: Could not find input file {input_file}")
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in {input_file}")
    except Exception as e:
        print(f"An error occurred: {str(e)}")


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


def add_reviews_to_artwork_mongodb(
    db_name, collection_name, connection_string, num_reviews_range=(0, 3)
):
    """Add random reviews to artworks in MongoDB that have no reviews."""
    client = connect_to_mongodb(connection_string)
    if not client:
        return False

    try:
        db = client[db_name]
        collection = db[collection_name]

        # Find all artworks with empty reviews array
        artworks_without_reviews = collection.find({"reviews": {"$size": 0}})

        # Update each artwork
        updates = 0
        for artwork in artworks_without_reviews:
            num_reviews = random.randint(*num_reviews_range)
            new_reviews = [generate_random_review() for _ in range(num_reviews)]

            # Update the document
            result = collection.update_one(
                {"_id": artwork["_id"]},
                {
                    "$set": {
                        "reviews": new_reviews,
                        "updated_at": datetime.now(timezone.utc),
                    }
                },
            )

            if result.modified_count > 0:
                updates += 1

        print(f"Successfully added reviews to {updates} artworks")
        return True

    except OperationFailure as e:
        print(f"MongoDB operation failed: {str(e)}")
        return False
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return False
    finally:
        client.close()


def bulk_add_reviews_mongodb(
    db_name, collection_name, connection_string, num_reviews_range=(0, 3)
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
        artworks_without_reviews = collection.find({"reviews": {"$size": 0}})

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


if __name__ == "__main__":
    # artworks = generate_artworks_dummy_data()
    # users = generate_users_dummy_data()
    # input_file = "artworks.json"  # Your input JSON file
    # output_file = "artworks.json"  # Where to save the modified data

    # update_json_file(input_file, output_file)

    MONGO_CONNECTION_STRING = "mongodb+srv://Cluster18362:zm5bZcXvos6OfIBU@cluster18362.r9onf.mongodb.net/"  # Replace with your connection string
    DB_NAME = "smart-art-gallery"
    COLLECTION_NAME = "artworks"

    update_existing_reviews_with_ids(DB_NAME, COLLECTION_NAME, MONGO_CONNECTION_STRING)

    # Then, add new reviews to artworks without any (these will automatically include ObjectIds)
    bulk_add_reviews_mongodb(DB_NAME, COLLECTION_NAME, MONGO_CONNECTION_STRING)
    app.run(debug=True)
