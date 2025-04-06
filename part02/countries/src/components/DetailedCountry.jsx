import { useEffect, useState } from "react"
import axios from "axios"

export const DetailedCountry = ({country}) => {
    const [weather, setWeather] = useState(null)
    
    useEffect(() => {
        
        if (country) {
            let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${country["latlng"][0]}&lon=${country["latlng"][1]}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
            axios.get(weatherApiUrl).then(response => {
                console.log(response.data)
                setWeather(response.data)})

        }
      }, [country])
    
    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>Capital(s): {country.capital.join(", ")}</p>
            <p>Area: {country.area}</p>
            <h2>Languages</h2>
            <ul>
                {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
            </ul>
            <img src={country.flags.png} alt={country.flags.alt}/>
            <h2>Weather in {country.capital}</h2>
            <p>Temperature {weather?.main.temp} Celsius</p>
            <img src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}></img>
            <p>Wind {weather?.wind.speed} m/s</p>
        </div>
    )
}
