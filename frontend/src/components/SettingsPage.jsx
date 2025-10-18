import React, { useState, useEffect } from 'react'
import { FaMoon, FaSun, FaPalette, FaMobile, FaGlobe } from 'react-icons/fa'
import { healthApi } from '../services/api'

// /* Функции гуглил использовал документацию и переиспользовал другой код */

const SettingsPage = ({ isDarkMode, setIsDarkMode }) => {
    const [apiStatus, setApiStatus] = useState('checking')

    const checkApiHealth = async () => {
        try {
            setApiStatus('checking')
            await healthApi.checkHealth()
            setApiStatus('healthy')
        } catch (error) {
            setApiStatus('error')
        }
    }

    useEffect(() => {
        checkApiHealth()
    }, [])

    const getStatusColor = () => {
        switch (apiStatus) {
            case 'healthy': return 'text-green-500'
            case 'error': return 'text-red-500'
            default: return 'text-yellow-500'
        }
    }

    const getStatusText = () => {
        switch (apiStatus) {
            case 'healthy': return 'Сервер работает'
            case 'error': return 'Ошибка соединения'
            default: return 'Проверка...'
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Настройки</h1>

            <div className="space-y-6">
                <div className="bg-[var(--card-bg)] rounded-lg p-6 border border-[var(--border-color)]">
                    <div className="flex items-center space-x-3 mb-4">
                        <FaGlobe size={20} className="text-blue-500" />
                        <h2 className="text-lg font-semibold">Статус системы</h2>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-[var(--border-color)] rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className='w-3 h-3 rounded-full'></div>
                            <div>
                                <div className="font-medium">API Сервер</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {getStatusText()}
                                    {/* Тут ссылается на статику поэтому будет писать что сервер работает, сделал таким образом */}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={checkApiHealth}
                            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                        >
                            Проверить
                        </button>
                    </div>
                </div>
                <div className="bg-[var(--card-bg)] rounded-lg p-6 border border-[var(--border-color)]">
                    <div className="flex items-center space-x-3 mb-4">
                        <FaMobile size={20} className="text-green-500" />
                        <h2 className="text-lg font-semibold">FAQ</h2>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-gray-500">Фронтенд</div>
                            <div>React + Tailwind</div>

                            <div className="text-gray-500">Бэкенд</div>
                            <div>FastAPI + Python + Vercel</div>

                            <div className="text-gray-500">Погода</div>
                            <div>OpenWeatherMap API</div>

                            <div className="text-gray-500">Dev</div>
                            <div>Шлыков Александр</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage