# Переиспользовал бэк и переписал его чуть под другую API
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="Weather API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

class WeatherRequest(BaseModel):
    lat: float
    lon: float

class CityRequest(BaseModel):
    city: str

@app.get("/")
async def root():
    return {"message": "Weather API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/weather")
async def get_weather(weather_req: WeatherRequest):
    try:
        if not OPENWEATHER_API_KEY:
            raise HTTPException(status_code=500, detail="API ключ не настроен")        
        current_data = await get_current_weather(weather_req.lat, weather_req.lon)
        forecast_data = await get_forecast(weather_req.lat, weather_req.lon)
        location_name = await get_location_name(weather_req.lat, weather_req.lon)
        return {
            "location": {
                "name": location_name,
                "lat": weather_req.lat,
                "lon": weather_req.lon
            },
            "current": current_data,
            "daily": forecast_data
        }
    except Exception as e:
        print(f"Ошибка получения погоды: {e}")
        raise HTTPException(status_code=500, detail=str(e))
@app.post("/api/weather/city")
async def get_weather_by_city(city_req: CityRequest):
    try:
        if not OPENWEATHER_API_KEY:
            raise HTTPException(status_code=500, detail="API ключ не настроен")
        lat, lon, location_name = await get_city_coordinates(city_req.city)
        weather_req = WeatherRequest(lat=lat, lon=lon)
        return await get_weather(weather_req)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Ошибка поиска города: {e}")
        raise HTTPException(status_code=500, detail=f"Ошибка поиска: {str(e)}")

async def get_current_weather(lat: float, lon: float):
    """Получить текущую погоду"""
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "lat": lat,
        "lon": lon,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric",
        "lang": "ru"
    }
    
    response = requests.get(url, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Ошибка API погоды")
    data = response.json()
    return {
        "temp": round(data["main"]["temp"], 1),
        "feels_like": round(data["main"]["feels_like"], 1),
        "humidity": data["main"]["humidity"],
        "pressure": data["main"]["pressure"],
        "wind_speed": data.get("wind", {}).get("speed", 0),
        "weather": data["weather"][0]["description"].capitalize(),
        "icon": data["weather"][0]["icon"]
    }

async def get_forecast(lat: float, lon: float):
    """Получить прогноз на 5 дней"""
    url = "https://api.openweathermap.org/data/2.5/forecast"
    params = {
        "lat": lat,
        "lon": lon,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric",
        "lang": "ru",
        "cnt": 40
    }
    
    response = requests.get(url, params=params)
    if response.status_code != 200:
        return []
    data = response.json()
    daily_forecast = []
    for forecast in data["list"]:
        if forecast["dt_txt"].endswith("12:00:00"):
            daily_forecast.append({
                "dt": forecast["dt"],
                "temp": round(forecast["main"]["temp"], 1),
                "min": round(forecast["main"]["temp_min"], 1),
                "max": round(forecast["main"]["temp_max"], 1),
                "weather": forecast["weather"][0]["description"].capitalize(),
                "icon": forecast["weather"][0]["icon"]
            })
    if not daily_forecast:
        for i in range(0, min(5, len(data["list"]))):
            forecast = data["list"][i]
            daily_forecast.append({
                "dt": forecast["dt"],
                "temp": round(forecast["main"]["temp"], 1),
                "min": round(forecast["main"]["temp_min"], 1),
                "max": round(forecast["main"]["temp_max"], 1),
                "weather": forecast["weather"][0]["description"].capitalize(),
                "icon": forecast["weather"][0]["icon"]
            })
    
    return daily_forecast[:5]

async def get_city_coordinates(city_name: str):
    """Получить координаты города"""
    url = "https://api.openweathermap.org/geo/1.0/direct"
    params = {
        "q": city_name,
        "limit": 1,
        "appid": OPENWEATHER_API_KEY
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Ошибка геокодинга")
    data = response.json()
    if not data:
        raise HTTPException(status_code=404, detail="Город не найден")
    city = data[0]
    location_name = f"{city['name']}, {city.get('country', '')}"
    return city["lat"], city["lon"], location_name

async def get_location_name(lat: float, lon: float):
    """Получить название местоположения по координатам"""
    try:
        url = "https://api.openweathermap.org/geo/1.0/reverse"
        params = {
            "lat": lat,
            "lon": lon,
            "limit": 1,
            "appid": OPENWEATHER_API_KEY
        }
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            if data:
                return f"{data[0]['name']}, {data[0].get('country', '')}"
    except:
        pass
    return f"{lat:.4f}, {lon:.4f}"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)