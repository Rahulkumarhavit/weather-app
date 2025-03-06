    /**
 * Main Application
 * Initializes and coordinates the weather app functionality
 */

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
    // Remove city if it already exists to prevent duplicates
    const cityIndex = recentSearches.indexOf(city);
    if (cityIndex !== -1) {
        recentSearches.splice(cityIndex, 1);
    }
    
    // Add city to the beginning of the array
    recentSearches.unshift(city);
    
    // Limit to 5 recent searches
    if (recentSearches.length > 5) {
        recentSearches.pop();
    }
    
    // Save to localStorage
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
        // Fetch current weather
        const currentWeatherData = await weatherAPI.getCurrentWeatherByCity(city);
        
        // Fetch forecast
        const forecastData = await weatherAPI.getForecastByCity(city);
        
        // Update UI with weather data
        weatherUI.updateCurrentWeather(currentWeatherData, weatherAPI);
        weatherUI.updateForecast(forecastData, weatherAPI);
        
        // Add to recent searches
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
        // Fetch current weather
        const currentWeatherData = await weatherAPI.getCurrentWeatherByCoords(lat, lon);
        
        // Fetch forecast
        const forecastData = await weatherAPI.getForecastByCoords(lat, lon);
        
        // Update UI with weather data
        weatherUI.updateCurrentWeather(currentWeatherData, weatherAPI);
        weatherUI.updateForecast(forecastData, weatherAPI);
        
        // Add to recent searches
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
        // Success callback
        position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherForCoords(latitude, longitude);
        },
        // Error callback
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
    
    // Enter key in search input
    weatherUI.citySearchInput.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            const city = weatherUI.citySearchInput.value.trim();
            fetchWeatherForCity(city);
        }
    });
    
    // Current location button click
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
            // Show all recent searches
            weatherUI.displaySearchDropdown(recentSearches);
        } else {
            // Filter recent searches based on input
            const filteredSearches = recentSearches.filter(city => 
                city.toLowerCase().includes(searchText)
            );
            
            weatherUI.displaySearchDropdown(filteredSearches);
        }
    });
    
    // Hide dropdown when clicking outside
    document.addEventListener('click', event => {
        if (!weatherUI.citySearchInput.contains(event.target) && !weatherUI.searchDropdown.contains(event.target)) {
            weatherUI.hideSearchDropdown();
        }
    });
}

// Initialize the application
function initApp() {
    // Load recent searches from localStorage
    loadRecentSearches();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check for default city in URL
    const urlParams = new URLSearchParams(window.location.search);
    const cityParam = urlParams.get('city');
    
    if (cityParam) {
        weatherUI.citySearchInput.value = cityParam;
        fetchWeatherForCity(cityParam);
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);