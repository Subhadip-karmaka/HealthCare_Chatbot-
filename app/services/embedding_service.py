from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import json
from app.config import FAQ_DATA_PATH

model = SentenceTransformer("all-MiniLM-L6-v2")

class FAQEmbeddingService:
    def __init__(self):
        with open(FAQ_DATA_PATH, "r") as f:
            self.data = json.load(f)

        self.questions = [item["question"] for item in self.data]
        self.embeddings = model.encode(self.questions)

        dimension = self.embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(np.array(self.embeddings))

    def search(self, query: str):
        query_embedding = model.encode([query])
        distances, indices = self.index.search(np.array(query_embedding), 1)

        best_match = self.data[indices[0][0]]
        return best_match
