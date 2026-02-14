from fastapi import APIRouter
from pydantic import BaseModel
from app.services.faq_service import get_faq_response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat(request: ChatRequest):
    response = get_faq_response(request.message)
    return {
        "question": response["question"],
        "answer": response["answer"]
    }
