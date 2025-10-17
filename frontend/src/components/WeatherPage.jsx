import React, { useState } from 'react'
import { 
  FaMapMarkerAlt, 
  FaThermometerHalf, 
  FaTint, 
  FaWind, 
  FaTachometerAlt, 
  FaSearch 
} from 'react-icons/fa'
import { weatherApi } from '../services/api'

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const fetchWeatherByCity = async (cityName) => {
    setLoading(true)
    setError('')
    
    try {
      console.log('Поиск города:', cityName)
      const data = await weatherApi.getWeatherByCity(cityName)
      console.log('Данные получены:', data)
      setWeatherData(data)
    } catch (err) {
      console.error('Ошибка поиска города:', err)
      setError('error city')
    } finally {
      setLoading(false)
    }
  }

  const fetchWeatherByCoordinates = async (lat, lon) => {
    setLoading(true)
    setError('')
    
    try {
      console.log('Поиск по координатам:', lat, lon)
      const data = await weatherApi.getWeather(lat, lon)
      console.log('Данные получены:', data)
      setWeatherData(data)
    } catch (err) {
      console.error('Ошибка координат:', err)
      setError('error cord')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchInput.trim()) return

    const coords = searchInput.split(',').map(coord => coord.trim())
    if (coords.length === 2) {
      const lat = parseFloat(coords[0])
      const lon = parseFloat(coords[1])
      if (!isNaN(lat) && !isNaN(lon)) {
        await fetchWeatherByCoordinates(lat, lon)
        return
      }
    }
    await fetchWeatherByCity(searchInput.trim())
  }

  const WeatherCard = ({ title, value, icon: Icon, unit = '' }) => (
    <div className="bg-blue-200 rounded-lg p-4 text-center border border-[var(--border-color)]">
      <Icon className="mx-auto mb-2 text-blue-500" size={24} />
      <div className="text-sm text-gray-50 dark:text-blue-200 mb-1">{title}</div>
      <div className="text-xl font-semibold">
        {value}
        {unit && <span className="text-sm ml-1">{unit}</span>}
      </div>
    </div>
  )
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Погода</h1>
      <div className="bg-[#ffffff] rounded-lg p-6 mb-6 border border-[var(--border-color)]">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Введите город или координаты"
              className="w-full px-4 py-3 pl-10 border border-2xl rounded-lg bg-white dark:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200" />
          </div>
          <button
            type="submit"
            disabled={loading || !searchInput.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2 transition-colors"
          >
            <FaSearch size={16} />
            <span>{loading ? 'Поиск...' : 'Найти'}</span>
          </button>
        </form>

        <div className="text-sm text-blue-100 dark:text-gray-400">
          <p>Примеры поиска:</p>
          <ul className="list-disc list-inside mt-1">
            <li>Город: <span className="text-blue-500 cursor-pointer" onClick={() => setSearchInput('Москва')}>Москва</span></li>
            <li>Координаты: <span className="text-blue-500 cursor-pointer" onClick={() => setSearchInput('55.7558, 37.6173')}>55.7558, 37.6173</span></li>
          </ul>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-4">Получаем данные о погоде...</span>
        </div>
      )}
      
      {weatherData && !loading && (
        <>
          <div className="bg-[var(--card-bg)] rounded-lg p-6 mb-6 border border-[var(--border-color)]">
            <div className="flex items-center space-x-2 mb-6">
              <FaMapMarkerAlt size={20} className="text-red-500" />
              <span className="text-lg font-semibold">{weatherData.location.name}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <WeatherCard
                title="Температура"
                value={Math.round(weatherData.current.temp)}
                icon={FaThermometerHalf}
                unit="°C"
              />
              <WeatherCard
                title="Ощущается"
                value={Math.round(weatherData.current.feels_like)}
                icon={FaThermometerHalf}
                unit="°C"
              />
              <WeatherCard
                title="Влажность"
                value={weatherData.current.humidity}
                icon={FaTint}
                unit="%"
              />
              <WeatherCard
                title="Давление"
                value={weatherData.current.pressure}
                icon={FaTachometerAlt}
                unit="hPa"
              />
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white dark:bg-blue-200 rounded-lg">
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.current.icon}@2x.png`}
                alt="Иконка погоды"
                className="w-16 h-16"
              />
              <div>
                <div className="text-xl font-semibold capitalize">
                  {weatherData.current.weather}
                </div>
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <FaWind size={16} />
                  <span>Ветер: {weatherData.current.wind_speed} м/с</span>
                </div>
              </div>
            </div>
          </div>

          {weatherData.daily && weatherData.daily.length > 0 && (
            <div className="bg-[var(--card-bg)] rounded-lg p-6 border border-[var(--border-color)]">
              <h2 className="text-xl font-semibold mb-4">Прогноз на 5 дней</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {weatherData.daily.map((day, index) => (
                  <div key={index} className="text-center bg-white dark:bg-blue-200 rounded-lg p-3">
                    <div className="text-sm font-medium mb-2">
                      {new Date(day.dt * 1000).toLocaleDateString('ru-RU', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </div>
                    <img
                      src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                      alt="Иконка погоды"
                      className="mx-auto w-12 h-12"
                    />
                    <div className="text-lg font-semibold">
                      {Math.round(day.temp)}°
                    </div>
                    <div className="text-sm text-blue-200 dark:text-gray-400 capitalize">
                      {day.weather}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!weatherData && !loading && (
        <div className="text-center py-12 text-gray-500 dark:text-blue-200">
          <FaMapMarkerAlt size={48} className="mx-auto mb-4 text-gray-300" />
          <p>Введите город или координаты для отображения погоды</p>
        </div>
      )}
    </div>
  )
}

export default WeatherPage