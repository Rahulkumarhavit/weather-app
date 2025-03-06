        /**
 * UI Manager
 * Handles all UI updates and user interactions
 */

class WeatherUI {
    constructor() {
        // Search elements
        this.citySearchInput = document.getElementById('city-search');
        this.searchButton = document.getElementById('search-button');
        this.currentLocationButton = document.getElementById('current-location-button');
        this.searchDropdown = document.getElementById('search-dropdown');
        
        // Current weather elements
        this.currentWeatherSection = document.getElementById('current-weather');
        this.locationNameElement = document.getElementById('location-name');
        this.currentDateElement = document.getElementById('current-date');
        this.currentTempElement = document.getElementById('current-temp');
        this.weatherDescriptionElement = document.getElementById('weather-description');
        this.feelsLikeElement = document.getElementById('feels-like');
        this.humidityElement = document.getElementById('humidity');
        this.windSpeedElement = document.getElementById('wind-speed');
        this.pressureElement = document.getElementById('pressure');
        this.weatherIconElement = document.getElementById('weather-icon');
        
        // Forecast elements
        this.forecastSection = document.getElementById('forecast-section');
        this.forecastContainer = document.getElementById('forecast-container');
        
        // Error elements
        this.errorAlert = document.getElementById('error-alert');
        this.errorMessage = document.getElementById('error-message');
    }

    /**
     * Update current weather display
     * @param {Object} data - Current weather data
     * @param {Object} api - WeatherAPI instance for icon URLs
     */
    updateCurrentWeather(data, api) {
        // Show the current weather section
        this.currentWeatherSection.classList.remove('hidden');
        
        // Update location and date
        this.locationNameElement.textContent = `${data.name}, ${data.sys.country}`;
        this.currentDateElement.textContent = this.formatDate(new Date());
        
        // Update temperature and description
        this.currentTempElement.textContent = `${Math.round(data.main.temp)}°C`;
        this.weatherDescriptionElement.textContent = this.capitalizeFirstLetter(data.weather[0].description);
        
        // Update additional weather details
        this.feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}°C`;
        this.humidityElement.textContent = `${data.main.humidity}%`;
        this.windSpeedElement.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
        this.pressureElement.textContent = `${data.main.pressure} hPa`;
        
        // Update weather icon
        this.weatherIconElement.src = api.getWeatherIconUrl(data.weather[0].icon);
        this.weatherIconElement.alt = data.weather[0].description;
    }

    /**
     * Update 5-day forecast display
     * @param {Object} data - Forecast data
     * @param {Object} api - WeatherAPI instance for icon URLs
     */
    updateForecast(data, api) {
        // Show the forecast section
        this.forecastSection.classList.remove('hidden');
        
        // Clear previous forecast data
        this.forecastContainer.innerHTML = '';
        
        // Process forecast data to get daily forecasts (noon time)
        const dailyForecasts = this.processForecastData(data);
        
        // Create a card for each day's forecast
        dailyForecasts.forEach(day => {
            const forecastCard = this.createForecastCard(day, api);
            this.forecastContainer.appendChild(forecastCard);
        });
    }

    /**
     * Process raw forecast data to get one forecast per day (at noon)
     * @param {Object} data - Raw forecast data from API
     * @returns {Array} - Array of processed daily forecasts
     */
    processForecastData(data) {
        const dailyForecasts = [];
        const forecastsByDay = {};

        // Group forecasts by day
        data.list.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toISOString().split('T')[0];
            
            if (!forecastsByDay[day]) {
                forecastsByDay[day] = [];
            }
            
            forecastsByDay[day].push(forecast);
        });

        // Get forecast for each day (preferably around noon)
        Object.keys(forecastsByDay).forEach(day => {
            // Find forecast closest to noon
            const forecasts = forecastsByDay[day];
            let noonForecast = forecasts[0];
            let minDiff = Infinity;
            
            forecasts.forEach(forecast => {
                const date = new Date(forecast.dt * 1000);
                const hours = date.getHours();
                const diff = Math.abs(hours - 12);
                
                if (diff < minDiff) {
                    minDiff = diff;
                    noonForecast = forecast;
                }
            });
            
            dailyForecasts.push(noonForecast);
        });

        // Limit to 5 days
        return dailyForecasts.slice(0, 5);
    }

    /**
     * Create a forecast card for a single day
     * @param {Object} forecastData - Forecast data for a single day
     * @param {Object} api - WeatherAPI instance for icon URLs
     * @returns {HTMLElement} - Forecast card element
     */
    createForecastCard(forecastData, api) {
        const date = new Date(forecastData.dt * 1000);
        const temp = Math.round(forecastData.main.temp);
        const iconUrl = api.getWeatherIconUrl(forecastData.weather[0].icon);
        const description = this.capitalizeFirstLetter(forecastData.weather[0].description);
        const humidity = forecastData.main.humidity;
        const windSpeed = Math.round(forecastData.wind.speed * 3.6); // Convert m/s to km/h
        
        const card = document.createElement('div');
        card.className = 'bg-blue-50 rounded-lg p-4 text-center';
        
        card.innerHTML = `
            <h3 class="font-bold text-gray-800">${this.formatDayName(date)}</h3>
            <p class="text-sm text-gray-500 mb-2">${this.formatShortDate(date)}</p>
            <img src="${iconUrl}" alt="${description}" class="mx-auto w-16 h-16 my-2">
            <p class="text-2xl font-bold mb-1">${temp}°C</p>
            <p class="text-sm text-gray-600 mb-2">${description}</p>
            <div class="text-xs text-gray-500 grid grid-cols-2 gap-1">
                <div><i class="fas fa-wind mr-1"></i>${windSpeed} km/h</div>
                <div><i class="fas fa-tint mr-1"></i>${humidity}%</div>
            </div>
        `;
        
        return card;
    }

    /**
     * Display search dropdown with recently searched cities
     * @param {Array} cities - Array of recently searched cities
     */
    displaySearchDropdown(cities) {
        if (cities.length === 0) {
            this.searchDropdown.classList.add('hidden');
            return;
        }

        // Clear previous dropdown items
        this.searchDropdown.innerHTML = '';
        
        // Create dropdown items for each city
        cities.forEach(city => {
            const item = document.createElement('div');
            item.className = 'px-4 py-2 cursor-pointer search-dropdown-item';
            item.textContent = city;
            
            item.addEventListener('click', () => {
                this.citySearchInput.value = city;
                this.searchDropdown.classList.add('hidden');
            });
            
            this.searchDropdown.appendChild(item);
        });
        
        // Show the dropdown
        this.searchDropdown.classList.remove('hidden');
    }

    /**
     * Hide search dropdown
     */
    hideSearchDropdown() {
        this.searchDropdown.classList.add('hidden');
    }

    /**
     * Show loading state
     */
    showLoading() {
        // Add loading state to search button
        this.searchButton.innerHTML = `
            <div class="loading-spinner"></div>
        `;
        this.searchButton.disabled = true;
        this.currentLocationButton.disabled = true;
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        // Restore search button
        this.searchButton.innerHTML = 'Search';
        this.searchButton.disabled = false;
        this.currentLocationButton.disabled = false;
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorAlert.classList.remove('hidden');
    }

    /**
     * Hide error message
     */
    hideError() {
        this.errorAlert.classList.add('hidden');
    }

    /**
     * Format date to display day name
     * @param {Date} date - Date to format
     * @returns {string} - Formatted day name
     */
    formatDayName(date) {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    }

    /**
     * Format date to display short date
     * @param {Date} date - Date to format
     * @returns {string} - Formatted short date
     */
    formatShortDate(date) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    /**
     * Format date to display full date
     * @param {Date} date - Date to format
     * @returns {string} - Formatted full date
     */
    formatDate(date) {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    /**
     * Capitalize first letter of a string
     * @param {string} string - String to capitalize
     * @returns {string} - Capitalized string
     */
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}