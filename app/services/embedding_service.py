import json
from app.config import FAQ_DATA_PATH

class FAQEmbeddingService:
    def __init__(self):
        with open(FAQ_DATA_PATH, "r") as f:
            self.data = json.load(f)

    def search(self, query: str):
        query = query.lower()

        for item in self.data:
            if query in item["question"].lower():
                return item

        return self.data[0]
