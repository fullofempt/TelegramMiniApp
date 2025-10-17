from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import requests
import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

# Environment variables
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

class WeatherRequest(BaseModel):
    lat: float
    lon: float
    units: str = "metric"

class ChatRequest(BaseModel):
    message: str
    user_id: str


@app.get("/")
async def read_index():
    return FileResponse("static/index.html")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Telegram Mini App Backend"}

@app.post("/api/weather")
async def get_weather(weather_req: WeatherRequest):
    """
    Get weather data from OpenWeatherMap API
    """
    try:
        url = f"https://api.openweathermap.org/data/3.0/onecall"
        params = {
            "lat": weather_req.lat,
            "lon": weather_req.lon,
            "appid": OPENWEATHER_API_KEY,
            "units": weather_req.units,
            "exclude": "minutely,hourly,alerts"
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        weather_data = response.json()
        
        # Format the response
        formatted_data = {
            "current": {
                "temp": weather_data["current"]["temp"],
                "feels_like": weather_data["current"]["feels_like"],
                "humidity": weather_data["current"]["humidity"],
                "pressure": weather_data["current"]["pressure"],
                "wind_speed": weather_data["current"]["wind_speed"],
                "weather": weather_data["current"]["weather"][0]["description"],
                "icon": weather_data["current"]["weather"][0]["icon"]
            },
            "daily": [
                {
                    "dt": day["dt"],
                    "temp": day["temp"]["day"],
                    "min": day["temp"]["min"],
                    "max": day["temp"]["max"],
                    "weather": day["weather"][0]["description"],
                    "icon": day["weather"][0]["icon"]
                }
                for day in weather_data["daily"][:5]
            ]
        }
        
        return formatted_data
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Weather API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/chat")
async def chat_with_bot(chat_req: ChatRequest):
    """
    Mock chat bot - не функциональный, только демо-ответы
    """
    # Простые заготовленные ответы для демонстрации
    mock_responses = [
        "Привет! Я демо-бот. Настоящий функционал не реализован.",
        "Это тестовая версия чата. В реальном приложении здесь был бы AI.",
        "Я просто показываю, как работает интерфейс чата!",
        "Вы сказали: '{}'. Но я не могу обработать этот запрос.".format(chat_req.message),
        "Это демо-режим. Интегрируйте с реальным AI API для полноценной работы.",
        "Чем могу помочь? (Это просто демонстрация интерфейса)"
    ]
    
    import random
    import time
    
    # Имитация задержки ответа
    time.sleep(1)
    
    return {"response": random.choice(mock_responses)}

@app.post("/api/telegram/webhook")
async def telegram_webhook(update: dict):
    """
    Webhook for Telegram bot
    """
    try:
        message = update.get("message", {})
        text = message.get("text", "")
        chat_id = message.get("chat", {}).get("id")
        
        if text and chat_id:
            telegram_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
            payload = {
                "chat_id": chat_id,
                "text": f"Вы сказали: {text}\n\nОткройте мини-приложение для полного функционала!",
                "reply_markup": {
                    "inline_keyboard": [[
                        {
                            "text": "📱 Открыть приложение",
                            "web_app": {"url": "https://your-vercel-app.vercel.app"}
                        }
                    ]]
                }
            }
            
            requests.post(telegram_url, json=payload)
        
        return {"status": "ok"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Telegram webhook error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)