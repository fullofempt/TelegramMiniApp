const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export const chatApi = {
  sendMessage: async (message, userId) => {
    return apiRequest('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, user_id: userId })
    });
  }
};

export const weatherApi = {
  getWeather: async (lat, lon) => {
    return apiRequest('/weather', {
      method: 'POST',
      body: JSON.stringify({ lat, lon })
    });
  },

  getWeatherByCity: async (cityName) => {
    return apiRequest('/weather/city', {
      method: 'POST',
      body: JSON.stringify({ city: cityName })
    });
  }
};

export const healthApi = {
  checkHealth: async () => {
    return apiRequest('/health');
  }
};