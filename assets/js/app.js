
// Initialize API and UI
const weatherAPI = new WeatherAPI();
const weatherUI = new WeatherUI();

// Storage key for recent searches
const RECENT_SEARCHES_KEY = 'weatherAppRecentSearches';

// Array to store recent searches
let recentSearches = [];

// Load recent searches from localStorage
function loadRecentSearches() {
    const storedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (storedSearches) {
        recentSearches = JSON.parse(storedSearches);
    }
}

// Save recent searches to localStorage
function saveRecentSearches() {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
}

// Add a city to recent searches
function addToRecentSearches(city) {
    
    const cityIndex = recentSearches.indexOf(city);
    if (cityIndex !== -1) {
        recentSearches.splice(cityIndex, 1);
    }
    
  
    recentSearches.unshift(city);
    
   
    if (recentSearches.length > 5) {
        recentSearches.pop();
    }
    
   
    saveRecentSearches();
}

// Fetch weather data for a city
async function fetchWeatherForCity(city) {
    if (!city || city.trim() === '') {
        weatherUI.showError('Please enter a city name');
        return;
    }
    
    weatherUI.hideError();
    weatherUI.showLoading();
    
    try {
      
        const currentWeatherData = await weatherAPI.getCurrentWeatherByCity(city);
     
        const forecastData = await weatherAPI.getForecastByCity(city);
        
        
        weatherUI.updateCurrentWeather(currentWeatherData, weatherAPI);
        weatherUI.updateForecast(forecastData, weatherAPI);
        
        
        addToRecentSearches(city);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherUI.showError(`Could not find weather data for "${city}". Please check the city name and try again.`);
    } finally {
        weatherUI.hideLoading();
    }
}

// Fetch weather data for coordinates
async function fetchWeatherForCoords(lat, lon) {
    weatherUI.hideError();
    weatherUI.showLoading();
    
    try {
        
        const currentWeatherData = await weatherAPI.getCurrentWeatherByCoords(lat, lon);
        
      
        const forecastData = await weatherAPI.getForecastByCoords(lat, lon);
        
       
        weatherUI.updateCurrentWeather(currentWeatherData, weatherAPI);
        weatherUI.updateForecast(forecastData, weatherAPI);
        
        addToRecentSearches(currentWeatherData.name);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherUI.showError('Could not retrieve weather data for your location. Please try again later.');
    } finally {
        weatherUI.hideLoading();
    }
}

// Get user's current location
function getCurrentLocation() {
    if (!navigator.geolocation) {
        weatherUI.showError('Geolocation is not supported by your browser');
        return;
    }
    
    weatherUI.hideError();
    weatherUI.showLoading();
    
    navigator.geolocation.getCurrentPosition(
       
        position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherForCoords(latitude, longitude);
        },
        error => {
            console.error('Geolocation error:', error);
            weatherUI.hideLoading();
            
            let errorMessage = 'Failed to get your location';
            
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'You denied the request for geolocation';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is unavailable';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'The request to get your location timed out';
                    break;
            }
            
            weatherUI.showError(errorMessage);
        }
    );
}

// Set up event listeners
function setupEventListeners() {
    // Search button click
    weatherUI.searchButton.addEventListener('click', () => {
        const city = weatherUI.citySearchInput.value.trim();
        fetchWeatherForCity(city);
    });
    
    weatherUI.citySearchInput.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            const city = weatherUI.citySearchInput.value.trim();
            fetchWeatherForCity(city);
        }
    });
    
    weatherUI.currentLocationButton.addEventListener('click', getCurrentLocation);
    
    // Search input focus to show dropdown
    weatherUI.citySearchInput.addEventListener('focus', () => {
        if (recentSearches.length > 0 && weatherUI.citySearchInput.value.trim() === '') {
            weatherUI.displaySearchDropdown(recentSearches);
        }
    });
    
    // Search input keyup to show/hide dropdown
    weatherUI.citySearchInput.addEventListener('input', () => {
        const searchText = weatherUI.citySearchInput.value.trim().toLowerCase();
        
        if (searchText === '') {
            weatherUI.displaySearchDropdown(recentSearches);
        } else {
            const filteredSearches = recentSearches.filter(city => 
                city.toLowerCase().includes(searchText)
            );
            
            weatherUI.displaySearchDropdown(filteredSearches);
        }
    });
    
    document.addEventListener('click', event => {
        if (!weatherUI.citySearchInput.contains(event.target) && !weatherUI.searchDropdown.contains(event.target)) {
            weatherUI.hideSearchDropdown();
        }
    });
}

// Initialize the application
function initApp() {
    loadRecentSearches();
    
    setupEventListeners();
    
    const urlParams = new URLSearchParams(window.location.search);
    const cityParam = urlParams.get('city');
    
    if (cityParam) {
        weatherUI.citySearchInput.value = cityParam;
        fetchWeatherForCity(cityParam);
    }
}

document.addEventListener('DOMContentLoaded', initApp);