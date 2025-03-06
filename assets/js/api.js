

class WeatherAPI {
    constructor() {
        // OpenWeatherMap API key
        this.apiKey = 'b2d2b85defe432241ed4b23d0427342b';
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    }

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

    getWeatherIconUrl(iconCode) {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    }
}