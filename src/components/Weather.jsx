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

// import TimestamptoDateTime from './TimestamptoDateTime'


const Weather = () => {

    
    const [weatherData, setWeatherData] = useState(false);
    const [forecastData, setForecastData] = useState([]);


   

    const inputRef = useRef();

    const allIcons = {
        "01d": sun,
        "01n": night,
        "02d": cloudy,
        "02n": cloudy_night,
        "03d": cloudy,
        "03n": cloudy_night,
        "04d": cloudy,  
        "04n": cloudy_night,   

        "09d": rainy,
        "09n": rainy_night,
        "10d": rainy,
        "10n": rainy_night,

        "11d": thunder,
        "11n": thunder,

        "13d": snow,
        "13n": snow,

        "50d": mist,
        "50n": mist,

           
    }
    const search = async (city)=> {
        // if(city === ""){
        //     alert
        // }
        try {
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

            const [weatherResponse, forecastResponse] = await Promise.all([
                fetch(weatherUrl),
                fetch(forecastUrl)
            ]);

            const data = await weatherResponse.json();
            const forecastJson = await forecastResponse.json();
            console.log(data);

            if (forecastJson.list) {
                // Get 1 reading per day (at 12:00:00 PM)
                const dailyData = forecastJson.list.filter(reading => reading.dt_txt.includes("12:00:00"));
                setForecastData(dailyData);
            } else {
                setForecastData([]);
            }
            
            // console.log(data.weather[0].icon);

            const icon = allIcons[data.weather[0].icon];

            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                country: data.sys.country,
                icon: icon,
                // data.weather[0].icon
                sunrise: data.sys.sunrise,
                timezone: data.timezone,
                visibility: data.visibility
                
            })
            



            console.log(weatherData.timezone);
            console.log(weatherData.sunrise);
            console.log(weatherData.visibility);
            
            // var date = new Date();
            // console.log(date);

            // const bobo = Intl.DateTimeFormat().resolvedOptions();
            // console.log(bobo);
            

        } catch (error) {
            
        }}


        // const TstoHuman = TimestamptoDateTime(weatherData.sunrise);
        // console.log(TstoHuman); 

        



          
    

    useEffect(()=>{
        search("Wiesbaden");
    },[])


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          console.log('You pressed Enter to Search')
          search(inputRef.current.value)
        }
    }
  
    
  return (
    <div className='weather'>
        <div className="search-bar">
            <input ref={inputRef} type="text" placeholder='Search' onKeyDown={handleKeyDown} />
            <img src={search_grey_icon}  onClick={()=>search(inputRef.current.value)} alt="search" />
        </div>

        <img src={weatherData.icon} alt="" className='weather-icon'/>
        {/* <img src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} alt="" className='weather-icon'/> */}

        <p className='temperature'>{weatherData.temperature}°C</p>
        <p className='location'>{weatherData.location}</p>
        <p className='country'>{weatherData.country}</p>
        {/* <p className='country'>{weatherData.time}</p> */}


<div className="time-info">
    <Clock />
    {weatherData.sunrise && <p className='sunrise-text'>Sunrise: {new Date(weatherData.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>}
</div>
        

        

        <div className="weather-data">
            <div className="col">
                <img src={humidity_gif} alt="" />
                <div>
                    <p>{weatherData.humidity} %</p>
                    <span>Humidity</span>
                </div>

                
                <div className="col">
                <img src={windy_gif} alt="" />
                <div>
                <p>{weatherData.windSpeed} km/h</p>
                    <span>Wind</span>
                </div>

                </div>
            </div>
        </div>

        {forecastData && forecastData.length > 0 && (
            <div className="forecast-container">
                <h3 className="forecast-title">5-Day Forecast</h3>
                <div className="forecast-table-wrapper">
                    <table className="forecast-table">
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Weather</th>
                                <th>Temp</th>
                                <th>Wind</th>
                                <th>Humidity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {forecastData.map((day, index) => {
                                const date = new Date(day.dt * 1000);
                                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                                const icon = allIcons[day.weather[0].icon] || sun;
                                return (
                                    <tr key={index}>
                                        <td className="fw-bold">{dayName}</td>
                                        <td><img src={icon} alt="icon" className="forecast-icon" /></td>
                                        <td>{Math.floor(day.main.temp)}°C</td>
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

        {/* TO DO:
            - Fetch the expected next 5 days and add
            - Alert/Error when user enters wrong data
            - If possible, list up Country, City to keep user experience easier for searching
            - Add "Country code" under the "City name"
            - Update design and add night with clouds, night rain, night thunder, night snow, etc...
            - Fahrenheit conversion
            - Add pressure, feels like, and other features found in main, timezone and so forth
        */}
    </div>
    
  )
}

export default Weather