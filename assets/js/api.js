/**
 * Weather API Service
 * Handles all API requests to the OpenWeatherMap API
 */

class WeatherAPI {
    constructor() {
        // OpenWeatherMap API key - replace with your own
        this.apiKey = 'b2d2b85defe432241ed4b23d0427342b';
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    }

    /**
     * Get current weather data by city name
     * @param {string} city - City name to search for
     * @returns {Promise} - Promise containing weather data
     */
    async getCurrentWeatherByCity(city) {
        try {
            const response = await fetch(
                `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}`
            );
            console.log(response)
            if (!response.ok) {
                throw new Error(`Unable to fetch weather data: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get current weather data by geographic coordinates
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @returns {Promise} - Promise containing weather data
     */
    async getCurrentWeatherByCoords(lat, lon) {
        try {
            const response = await fetch(
                `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error(`Unable to fetch weather data: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get 5-day forecast data by city name
     * @param {string} city - City name to search for
     * @returns {Promise} - Promise containing forecast data
     */
    async getForecastByCity(city) {
        try {
            const response = await fetch(
                `${this.baseUrl}/forecast?q=${city}&units=metric&appid=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error(`Unable to fetch forecast data: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get 5-day forecast data by geographic coordinates
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @returns {Promise} - Promise containing forecast data
     */
    async getForecastByCoords(lat, lon) {
        try {
            const response = await fetch(
                `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error(`Unable to fetch forecast data: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get weather icon URL
     * @param {string} iconCode - Weather icon code
     * @returns {string} - URL for weather icon
     */
    getWeatherIconUrl(iconCode) {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    }
}