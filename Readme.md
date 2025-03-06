    # Weather Forecast Application

A responsive weather forecast application built with JavaScript, HTML, and Tailwind CSS that allows users to check current weather conditions and 5-day forecasts for locations worldwide.

## Features

- Search for weather forecasts by city name
- Get weather forecast for current location using geolocation
- Display current weather conditions (temperature, humidity, wind speed, etc.)
- Show 5-day weather forecast
- Responsive design that works on desktop, tablet, and mobile
- Recent searches history with dropdown functionality when you click on input field
- Error handling and validation

## Technologies Used

- HTML5
- CSS3 with Tailwind CSS
- JavaScript (ES6+)
- OpenWeatherMap API
- Local Storage for saving recent searches
- Font Awesome for icons

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/weather-forecast-app.git
   cd weather-forecast-app
   ```

2. Get an API key from OpenWeatherMap:
   - Create an account at [OpenWeatherMap](https://openweathermap.org/)
   - Generate an API key from your account dashboard

3. Open `assets/js/api.js` and replace `YOUR_API_KEY_HERE` with your actual API key:
   ```javascript
   this.apiKey = 'your-actual-api-key';
   ```

4. Open the application in a web browser:
   - You can use a local development server like Live Server in Visual Studio Code
   - Or simply open the `index.html` file in your browser

## Project Structure

```
weather-app/
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js
│   │   ├── api.js
│   │   └── ui.js
│   └── icons/
│       └── (weather icons)
├── README.md
└── .gitignore