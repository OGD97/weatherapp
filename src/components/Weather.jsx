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

const Weather = () => {

    
    const [weatherData, setWeatherData] = useState(false);

    const inputRef = useRef();

    const allIcons = {
        "01d": sunny_icon,
        "01n": night_icon,
        "02d": partiallysunny_icon,
        "02n": partiallysunny_icon,
        "03d": partiallysunny_icon,
        "03n": partiallysunny_icon,
        "04d": partiallysunny_icon,   
        "09d": rainy_icon,
        "09n": rainy_icon, 
        "10d": rainy_icon,
        "10n": rainy_icon,     
    }
    const search = async (city)=> {
        if(city === ""){
            alert
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

            const response = await fetch(url);
            const data = await response.json();
            console.log(data.weather[0].icon);

            const icon = allIcons[data.weather[0].icon];

            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: data.weather[0].icon,
                
            })

        } catch (error) {
            
        }}
    

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

        {/* <img src={weatherData.icon} alt="" className='weather-icon'/> */}
        <img src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} alt="" className='weather-icon'/>

        <p className='temperature'>{weatherData.temperature}°C</p>
        <p className='location'>{weatherData.location}</p>

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

        {/* TO DO:
            - Fetch the expected next 5 days and add
            - Alert/Error when user enters wrong data
            - If possible, list up Country, City to keep user experience easier for searching
        */}
    </div>
    
  )
}

export default Weather