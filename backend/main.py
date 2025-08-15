from fastapi import FastAPI, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import requests
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "API is running"}


OPENROUTER_API_KEY = os.environ.get(
    "OPENROUTER_API_KEY")  
MODEL = "openai/gpt-4o-mini"


@app.post("/ask_ai")
async def ask_ai(user_id: str = Form(...),
                 question: str = Form(...),
                 file: UploadFile = File(None)):
    file_content_text = ""

    if file:
        try:
            file_bytes = await file.read()
            file_content_text = file_bytes.decode("utf-8", errors="ignore")
        except Exception as e:
            file_content_text = f"[Error reading file: {str(e)}]"

    combined_input = question
    if file_content_text:
        combined_input += f"\n\n[File Content]:\n{file_content_text}"

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": MODEL,
        "messages": [{
            "role": "user",
            "content": combined_input
        }],
    }

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"Request to AI failed: {str(e)}"}
