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

const Weather = () => {

    
    const [weatherData, setWeatherData] = useState(false);

    const inputRef = useRef();

    const allIcons = {
        "01d": sun,
        "01n": night,
        "02d": cloudy,
        "02n": cloudy,
        "03d": cloudy,
        "03n": cloudy,
        "04d": cloudy,  
        "04n": cloudy,   

        "09d": rainy,
        "09n": rainy,
        "10d": rainy,
        "10n": rainy,

        "11d": thunder,
        "11n": thunder,

        "13d": snow,
        "13n": snow,

        "50d": hail,
        "50n": hail,

           
    }
    const search = async (city)=> {
        // if(city === ""){
        //     alert
        // }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            
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

        <img src={weatherData.icon} alt="" className='weather-icon'/>
        {/* <img src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} alt="" className='weather-icon'/> */}

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
            - Add "Country code" under the "City name"
        */}
    </div>
    
  )
}

export default Weather