from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()



# Create FastAPI app
app = FastAPI()

# Allow React frontend to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Configure Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
# Define request body structure
class AskRequest(BaseModel):
    question: str
    city: str
    temp: str
    condition: str
    unit: str

@app.get("/")
def root():
    return {"status": "WeatherMind AI backend is running — powered by owlAlphaX"}

@app.post("/ask")
async def ask(request: AskRequest):
    try:
        prompt = f"""You are a helpful weather assistant for WeatherMind AI, built by owlAlphaX.

Current weather context:
- City: {request.city}
- Temperature: {request.temp}{request.unit}
- Condition: {request.condition}

User question: {request.question}

Answer in 2-3 sentences maximum. Be friendly, practical, and specific to the 
current weather conditions. Give actionable advice the user can act on right now. 
Do not repeat the weather data back — just give the insight."""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful, friendly weather assistant. Give concise, practical weather advice."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=150,
            temperature=0.7,
        )

        answer = response.choices[0].message.content
        return {"answer": answer}

    except Exception as e:
        return {"answer": f"Error: {str(e)}"}