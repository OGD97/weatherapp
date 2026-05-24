import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_grey_icon from '../assets/search-grey.svg'
import search_white_icon from '../assets/search-white.svg'
import humidity_gif from '../assets/humidity.gif'
import humidity_icon from '../assets/humidity.png'
import night_icon from '../assets/night.png'
import partiallysunny_icon from '../assets/partially-sunny.png'
import rainy_icon from '../assets/rainy.png'
import sunny_icon from '../assets/sunny.png'
import thunder_icon from '../assets/thunder.png'
import windy_gif from '../assets/wind.gif'
import wind_icon from '../assets/wind.png'

import cloudy from '../assets/SVGweatherconditions/cloudy.svg'
import hail from '../assets/SVGweatherconditions/hail.svg'
import lightrainnight from '../assets/SVGweatherconditions/lightrainnight.svg'
import night from '../assets/SVGweatherconditions/night.svg'
import nightsnowfall from '../assets/SVGweatherconditions/nightsnowfall.svg'
import rain from '../assets/SVGweatherconditions/rain.svg'
import rainy from '../assets/SVGweatherconditions/rainy.svg'
import sleet from '../assets/SVGweatherconditions/sleet.svg'
import snow from '../assets/SVGweatherconditions/snow.svg'
import sun from '../assets/SVGweatherconditions/sun.svg'
import temperature from '../assets/SVGweatherconditions/temperature.svg'
import thunder from '../assets/SVGweatherconditions/thunder.svg'
import wind from '../assets/SVGweatherconditions/wind.svg'
import cloudy_night from '../assets/SVGweatherconditions/cloudy_night.svg'
import mist from '../assets/SVGweatherconditions/mist.svg'
import rainy_night from '../assets/SVGweatherconditions/rainy_night.svg'
import rainy_sun from '../assets/SVGweatherconditions/rainy_sun.svg'

import Clock from './Clock'

const formatLocalTime = (unixTimestamp, timezoneOffset) => {
    if (!unixTimestamp || timezoneOffset === undefined) return '';
    const targetDate = new Date((unixTimestamp + timezoneOffset) * 1000);
    let hours = targetDate.getUTCHours();
    const minutes = targetDate.getUTCMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
};

const mapWmoToOwmIconCode = (wmoCode, isDay = true) => {
    const suffix = isDay ? "d" : "n";
    if (wmoCode === 0) return "01" + suffix;
    if ([1, 2, 3].includes(wmoCode)) return "02" + suffix;
    if ([45, 48].includes(wmoCode)) return "50" + suffix;
    if ([51, 53, 55, 80, 81, 82].includes(wmoCode)) return "09" + suffix;
    if ([61, 63, 65].includes(wmoCode)) return "10" + suffix;
    if ([56, 57, 66, 67, 71, 73, 75, 77, 85, 86].includes(wmoCode)) return "13" + suffix;
    if ([95, 96, 99].includes(wmoCode)) return "11" + suffix;
    return "01" + suffix;
};

const Weather = () => {
    const [weatherData, setWeatherData] = useState(false);
    const [forecastData, setForecastData] = useState([]);
    const inputRef = useRef();

    const allIcons = {
        "01d": sun, "01n": night, "02d": cloudy, "02n": cloudy_night,
        "03d": cloudy, "03n": cloudy_night, "04d": cloudy, "04n": cloudy_night,
        "09d": rainy, "09n": rainy_night, "10d": rainy, "10n": rainy_night,
        "11d": thunder, "11n": thunder, "13d": snow, "13n": snow,
        "50d": mist, "50n": mist,
    }

    const search = async (city) => {
        try {
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const weatherResponse = await fetch(weatherUrl);
            const data = await weatherResponse.json();

            if (data.cod && data.cod !== 200) {
                console.error(data.message || "Error fetching weather data");
                return;
            }

            const { lat, lon } = data.coord;
            const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,relative_humidity_2m_max&hourly=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto`;
            const forecastResponse = await fetch(forecastUrl);
            const forecastJson = await forecastResponse.json();

            if (forecastJson.daily && forecastJson.hourly) {
                const daily = forecastJson.daily;
                const hourly = forecastJson.hourly;
                const formattedForecast = daily.time.map((timeStr, index) => {
                    const date = new Date(timeStr);
                    const dt = Math.floor(date.getTime() / 1000);
                    
                    // Indices for 12:00 PM (Noon/Day) and 11:00 PM (Night)
                    const morningHourIndex = index * 24 + 12;
                    const nightHourIndex = index * 24 + 23;
                    
                    const morningWmo = hourly.weather_code[morningHourIndex] !== undefined ? hourly.weather_code[morningHourIndex] : daily.weather_code[index];
                    const morningIconCode = mapWmoToOwmIconCode(morningWmo, true);
                    
                    const nightWmo = hourly.weather_code[nightHourIndex] !== undefined ? hourly.weather_code[nightHourIndex] : daily.weather_code[index];
                    const nightIconCode = mapWmoToOwmIconCode(nightWmo, false);
                    
                    return {
                        dt,
                        morning: {
                            temp: daily.temperature_2m_max[index],
                            icon: morningIconCode
                        },
                        night: {
                            temp: daily.temperature_2m_min[index],
                            icon: nightIconCode
                        },
                        main: {
                            humidity: daily.relative_humidity_2m_max[index]
                        },
                        wind: {
                            speed: daily.wind_speed_10m_max[index]
                        }
                    };
                });
                setForecastData(formattedForecast);
            } else {
                setForecastData([]);
            }

            const icon = allIcons[data.weather[0].icon];

            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                feelsLike: Math.floor(data.main.feels_like),
                pressure: data.main.pressure,
                description: data.weather[0].description,
                location: data.name,
                country: data.sys.country,
                icon: icon,
                sunrise: data.sys.sunrise,
                sunset: data.sys.sunset,
                timezone: data.timezone,
                visibility: data.visibility
            })
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        search("Wiesbaden");
    }, [])

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            search(inputRef.current.value)
        }
    }

    return (
        <div className='weather'>
            <div className="search-bar">
                <input ref={inputRef} type="text" placeholder='Search' onKeyDown={handleKeyDown} />
                <img src={search_grey_icon} onClick={() => search(inputRef.current.value)} alt="search" />
            </div>

            {weatherData && (
                <div className="weather-layout">
                    {/* Left Column: Current Weather */}
                    <div className="weather-left">
                        <img src={weatherData.icon} alt="" className='weather-icon' />
                        <p className='temperature'>{weatherData.temperature}°C</p>
                        <p className='weather-description' style={{ textTransform: 'capitalize', color: '#666', fontSize: '1.2rem', marginBottom: '5px', fontWeight: '600' }}>{weatherData.description}</p>
                        <p className='location'>{weatherData.location}, {weatherData.country}</p>
                        <div className="time-info">
                            <Clock timezone={weatherData.timezone} />
                        </div>
                    </div>

                    {/* Right Column: Grid & Forecast */}
                    <div className="weather-right">
                        <div className="weather-data-grid">
                            <div className="data-item">
                                <span className="data-label">Feels Like</span>
                                <span className="data-value">{weatherData.feelsLike}°C</span>
                            </div>
                            <div className="data-item">
                                <span className="data-label">Humidity</span>
                                <span className="data-value">{weatherData.humidity}%</span>
                            </div>
                            <div className="data-item">
                                <span className="data-label">Wind</span>
                                <span className="data-value">{weatherData.windSpeed} km/h</span>
                            </div>
                            <div className="data-item">
                                <span className="data-label">Pressure</span>
                                <span className="data-value">{weatherData.pressure} hPa</span>
                            </div>
                            <div className="data-item">
                                <span className="data-label">Visibility</span>
                                <span className="data-value">{(weatherData.visibility / 1000).toFixed(1)} km</span>
                            </div>
                            <div className="data-item">
                                <span className="data-label">Sunset & Sunrise</span>
                                <span className="data-value" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                                    {formatLocalTime(weatherData.sunrise, weatherData.timezone)}
                                    <br />
                                    {formatLocalTime(weatherData.sunset, weatherData.timezone)}
                                </span>
                            </div>
                        </div>

                        {forecastData && forecastData.length > 0 && (
                            <div className="forecast-container">
                                <h3 className="forecast-title">7-Day Forecast</h3>
                                <div className="forecast-table-wrapper">
                                    <table className="forecast-table">
                                        <thead>
                                            <tr>
                                                <th>Day</th>
                                                <th>Morning</th>
                                                <th>Night</th>
                                                <th>Wind</th>
                                                <th>Humidity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {forecastData.map((day, index) => {
                                                const date = new Date(day.dt * 1000);
                                                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                                                const morningIcon = allIcons[day.morning.icon] || sun;
                                                const nightIcon = allIcons[day.night.icon] || night;
                                                return (
                                                    <tr key={index}>
                                                        <td className="fw-bold">{dayName}</td>
                                                        <td>
                                                            <div className="forecast-cell-content">
                                                                <img src={morningIcon} alt="morning icon" className="forecast-icon" />
                                                                <span>{Math.floor(day.morning.temp)}°C</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="forecast-cell-content">
                                                                <img src={nightIcon} alt="night icon" className="forecast-icon" />
                                                                <span>{Math.floor(day.night.temp)}°C</span>
                                                            </div>
                                                        </td>
                                                        <td>{Math.floor(day.wind.speed)} km/h</td>
                                                        <td>{day.main.humidity}%</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Weather