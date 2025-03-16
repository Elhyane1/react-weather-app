import { useState, useEffect } from "react";
import axios from "axios";
import { FaWind } from "react-icons/fa6";
import { IoIosWater } from "react-icons/io";
import { LiaTemperatureHighSolid } from "react-icons/lia";




export default function Weather() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    const fetchWeather = async (location) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}&lang=en`
            );
            setWeather(response.data);
            fetchForecast(location);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setWeather(null);
        }
    };

    const fetchForecast = async (location) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}&lang=en`
            );
            setForecast(response.data.list);
        } catch (error) {
            console.error("Error fetching forecast data:", error);
        }
    };

    const handleSearch = () => {
        if (city) fetchWeather(city);
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                axios
                    .get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}&lang=en`)
                    .then((response) => {
                        setWeather(response.data);
                        fetchForecast(response.data.name);
                    })
                    .catch((error) => console.error("Error fetching location weather:", error));
            },
            (error) => console.error("Error getting location:", error)
        );
    }, []);

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-900 text-white transition-all duration-500 p-4">
            {/* Main Weather Section */}
            <div className="lg:w-3/5 w-full flex flex-col items-center p-6">
                <div className="w-full p-6 rounded-xl shadow-lg bg-gray-800 text-white">
                    <div className="flex justify-between items-center mb-6">
                        <input type="text" placeholder="Search for cities" value={city} onChange={(e) => setCity(e.target.value)} 
                            className="p-3 border border-gray-300 rounded-lg w-full bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        <button onClick={handleSearch} className="ml-3 bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg shadow-md transition">Search</button>
                    </div>

                    {weather && (
                        <div className="text-center">
                            <h2 className="text-3xl font-semibold">{weather.name}, {weather.sys.country}</h2>
                            <p className="text-6xl font-bold">{weather.main.temp}°C</p>
                            <p className="text-xl capitalize">{weather.weather[0].description}</p>
                            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt="Weather icon" className="mx-auto w-24 h-24" />

                            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-lg">
                                <div className="flex justify-center items-center gap-2">
                                    <FaWind /> 
                                    <p>Wind: {weather.wind.speed} m/s</p>
                                </div>
                                <div className="flex justify-center items-center gap-2">
                                    <IoIosWater /> 
                                    <p>Humidity: {weather.main.humidity}%</p>
                                </div>
                                <div className="flex justify-center items-center gap-2">
                                    <LiaTemperatureHighSolid className="text-xl" /> 
                                    <p>Feels Like: {weather.main.feels_like}°C</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {forecast.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-2xl font-semibold mb-4">Today's Forecast</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center">
                                {forecast.slice(0, 6).map((hour, index) => (
                                    <div key={index} className="p-3 bg-gray-700 rounded-lg">
                                        <p>{new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <img src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`} alt="Weather icon" className="w-12 h-12 mx-auto" />
                                        <p className="text-lg font-bold">{hour.main.temp}°C</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 5-Day Forecast Section */}
            {forecast.length > 0 && (
                <div className="w-full lg:w-2/5 mt-6 lg:mt-0 lg:ml-6 bg-gray-800 p-4 rounded-lg text-white">
                    <h3 className="text-lg font-semibold mb-4 text-center lg:text-left">5-DAY FORECAST</h3>
                    <div className="flex flex-col space-y-4">
                        {forecast.filter((_, index) => index % 8 === 0).slice(0, 5).map((day, index) => (
                            <div key={index} className="flex justify-between p-3 border-b border-gray-600 last:border-none">
                                <span className="text-md">{new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}</span>
                                <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt='Weather icon' className="w-8 h-8" />
                                <span className="text-lg font-medium">{day.main.temp.toFixed(1)}°C</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
