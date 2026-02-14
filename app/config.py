import os

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FAQ_DATA_PATH = os.path.join(BASE_DIR, "data", "faq_data.json")
