document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        cityInput: document.getElementById('city-input'),
        searchBtn: document.getElementById('search-btn'),
        weatherIcon: document.getElementById('weather-icon'),
        temperature: document.querySelector('.temperature'),
        weatherDesc: document.querySelector('.weather-description'),
        locationName: document.getElementById('location-name'),
        windSpeed: document.getElementById('wind-speed'),
        humidity: document.getElementById('humidity'),
        feelsLike: document.getElementById('feels-like'),
        visibility: document.getElementById('visibility'),
        particles: document.getElementById('particles'),
        weatherCard: document.querySelector('.weather-card'),
        body: document.body
    };

    // Configuration
    const config = {
        apiKey: 'bbb2b9eb40b740c0999112722251804', // Replace with your actual API key
        defaultCity: 'London',
        apiBaseUrl: 'https://api.weatherapi.com/v1/current.json'
    };

    // Initialize app
    init();

    function init() {
        // Set up event listeners
        elements.searchBtn.addEventListener('click', handleSearch);
        elements.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });

        // Load default city weather
        fetchWeather(config.defaultCity);
    }

    function handleSearch() {
        const city = elements.cityInput.value.trim();
        if (!city) {
            showError('Please enter a city name');
            return;
        }
        fetchWeather(city);
    }

    async function fetchWeather(city) {
        showLoadingState(city);

        try {
            const url = `${config.apiBaseUrl}?key=${config.apiKey}&q=${encodeURIComponent(city)}&aqi=yes`;
            
            const response = await fetch(url, {
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error?.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data?.current || !data?.location) {
                throw new Error('Invalid data structure from API');
            }

            updateWeatherUI(data);
            createWeatherEffects(data.current.condition.text, data.current.is_day);

        } catch (error) {
            console.error('Weather fetch error:', error);
            showError(`Failed to get weather: ${error.message}`);
            resetWeatherDisplay();
        }
    }

    function showLoadingState(city) {
        elements.temperature.textContent = '...';
        elements.weatherDesc.textContent = 'Loading...';
        elements.locationName.textContent = city;
    }

    function showError(message) {
        alert(message); // Or implement a nicer error display
    }

    function resetWeatherDisplay() {
        elements.temperature.textContent = '--°C';
        elements.weatherDesc.textContent = 'Search for a city';
        elements.locationName.textContent = '--';
        elements.windSpeed.textContent = '-- km/h';
        elements.humidity.textContent = '--%';
        elements.feelsLike.textContent = '--°C';
        elements.visibility.textContent = '-- km';
    }

    function updateWeatherUI(data) {
        const { current, location } = data;
        
        // Update main weather info
        elements.temperature.textContent = `${current.temp_c}°C`;
        elements.weatherDesc.textContent = current.condition.text;
        elements.locationName.textContent = `${location.name}, ${location.country}`;
        
        // Update weather icon with 3D effect
        const iconClass = getWeatherIconClass(current.condition.text, current.is_day);
        elements.weatherIcon.className = `weather-icon ${iconClass}`;
        
        // Apply 3D rotation effect
        animateWeatherIcon();
        
        // Update details
        elements.windSpeed.textContent = `${current.wind_kph} km/h`;
        elements.humidity.textContent = `${current.humidity}%`;
        elements.feelsLike.textContent = `${current.feelslike_c}°C`;
        elements.visibility.textContent = `${current.vis_km} km`;
    }

    function animateWeatherIcon() {
        elements.weatherIcon.style.transform = 'rotateY(0)';
        setTimeout(() => {
            elements.weatherIcon.style.transform = 'rotateY(360deg)';
            setTimeout(() => {
                elements.weatherIcon.style.transform = 'rotateY(0)';
            }, 1000);
        }, 100);
    }

    function getWeatherIconClass(condition, isDay) {
        condition = condition.toLowerCase();
        
        if (condition.includes('sunny') || condition.includes('clear')) {
            return isDay ? 'fas fa-sun sunny' : 'fas fa-moon night';
        } else if (condition.includes('cloud')) {
            return isDay ? 'fas fa-cloud cloudy' : 'fas fa-cloud-moon night';
        } else if (condition.includes('rain')) {
            return 'fas fa-cloud-rain rainy';
        } else if (condition.includes('snow')) {
            return 'fas fa-snowflake snowy';
        } else if (condition.includes('thunder') || condition.includes('storm')) {
            return 'fas fa-bolt thunder';
        } else if (condition.includes('fog') || condition.includes('mist')) {
            return 'fas fa-smog cloudy';
        } else {
            return 'fas fa-cloud-sun cloudy';
        }
    }

    function createWeatherEffects(condition, isDay) {
        // Clear previous effects
        elements.particles.innerHTML = '';
        elements.body.className = '';
        elements.weatherCard.className = 'weather-card';
        
        condition = condition.toLowerCase();
        let weatherClass = '';
        
        // Determine weather class and create effects
        if (condition.includes('sunny') || (condition.includes('clear') && isDay)) {
            weatherClass = 'sunny';
            createSunEffects();
        } else if (condition.includes('clear') && !isDay) {
            weatherClass = 'night';
            createNightEffects();
        } else if (condition.includes('cloud')) {
            weatherClass = 'cloudy';
            createCloudEffects();
        } else if (condition.includes('rain')) {
            weatherClass = 'rainy';
            createRainEffects();
        } else if (condition.includes('snow')) {
            weatherClass = 'snowy';
            createSnowEffects();
        } else if (condition.includes('thunder') || condition.includes('storm')) {
            weatherClass = 'thunder';
            createThunderEffects();
        } else {
            weatherClass = 'cloudy';
        }
        
        elements.body.classList.add(weatherClass);
    }

    // Weather effect creation functions
    function createSunEffects() {
        // Sun rays
        for (let i = 0; i < 8; i++) {
            const ray = document.createElement('div');
            ray.className = 'sun-ray';
            ray.style.transform = `rotate(${i * 45}deg)`;
            elements.particles.appendChild(ray);
        }
        
        // Floating particles
        createParticles('fas fa-circle', 15, {
            size: () => Math.random() * 5 + 2,
            color: 'rgba(255, 255, 255, 0.8)',
            animation: 'float',
            duration: () => Math.random() * 5 + 5
        });
    }

    function createNightEffects() {
        // Stars
        createParticles('fas fa-star', 50, {
            size: () => Math.random() * 3 + 1,
            color: 'white',
            animation: 'twinkle',
            duration: () => Math.random() * 3 + 2,
            opacity: () => Math.random() * 0.8 + 0.2
        });
    }

    function createCloudEffects() {
        // Cloud particles
        createParticles('fas fa-cloud', 20, {
            size: () => Math.random() * 30 + 10,
            color: 'rgba(255, 255, 255, 0.7)',
            animation: 'float',
            duration: () => Math.random() * 20 + 10
        });
    }

    function createRainEffects() {
        // Rain drops
        createParticles('fas fa-tint', 60, {
            size: () => Math.random() * 15 + 5,
            color: 'rgba(174, 194, 224, 0.7)',
            animation: 'rain',
            duration: () => Math.random() * 0.5 + 0.5,
            left: () => Math.random() * 100
        });

        // Occasional lightning
        if (Math.random() > 0.7) {
            setTimeout(createLightning, Math.random() * 5000);
        }
    }

    function createSnowEffects() {
        // Snowflakes
        createParticles('fas fa-snowflake', 40, {
            size: () => Math.random() * 10 + 5,
            color: 'white',
            animation: 'snow',
            duration: () => Math.random() * 10 + 5,
            left: () => Math.random() * 100
        });
    }

    function createThunderEffects() {
        createRainEffects();
        setInterval(() => {
            if (Math.random() > 0.5) createLightning();
        }, 3000);
    }

    function createLightning() {
        const lightning = document.createElement('div');
        lightning.className = 'lightning-flash';
        elements.particles.appendChild(lightning);
        setTimeout(() => lightning.remove(), 300);
    }

    function createParticles(iconClass, count, options) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('i');
            particle.className = `${iconClass} particle`;
            
            // Set styles
            particle.style.fontSize = `${options.size()}px`;
            particle.style.color = options.color;
            particle.style.opacity = options.opacity ? options.opacity() : '1';
            particle.style.left = options.left ? `${options.left()}%` : `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animation = `${options.animation} ${options.duration()}s infinite ${Math.random() * 5}s`;
            
            elements.particles.appendChild(particle);
        }
    }

    // Initial floating particles
    createParticles('fas fa-circle', 15, {
        size: () => Math.random() * 5 + 2,
        color: 'rgba(255, 255, 255, 0.5)',
        animation: 'float',
        duration: () => Math.random() * 10 + 5
    });
});