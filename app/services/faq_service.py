from app.services.embedding_service import FAQEmbeddingService

faq_engine = FAQEmbeddingService()

def get_faq_response(query: str):
    return faq_engine.search(query)
