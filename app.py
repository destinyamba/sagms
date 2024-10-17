import json
import os
import random
import uuid
import bcrypt

from bson import ObjectId
from flask import Flask, make_response, jsonify, request

app = Flask(__name__)


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


if __name__ == "__main__":
    artworks = generate_artworks_dummy_data()
    # users = generate_users_dummy_data()
    app.run(debug=True)
