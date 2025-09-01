
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import { Wind, Droplets, Eye, Thermometer } from 'lucide-react';

export default function SearchComponent() {

    const [city, setCity] = useState("")
    const [error, setError] = useState(null);
    const [weatherData, setWeatherData] = useState(null)
    const API_URL = "https://api.openweathermap.org/data/2.5/weather";
    const API_KEY = "5aaefadce9d04dff44261021293e878b";

    async function getWeatherDetails() {
        try {
            if (!city.trim()) {
                setError("Please enter a city name.");
                toast.error("⚠️ Please enter a city name.");
                return;
            }
            setError(null); // reset error

            let response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metrics`)

            if (!response.ok) {
                toast.error("City not found. Please enter a valid city name.")
                throw new Error("City not found. Please enter a valid city name.");

            }

            let responsejson = await response.json();
            console.log(responsejson)

            const result = {
                name: responsejson.name,
                temp: (responsejson.main.temp - 273.15).toFixed(2),   // Celsius
                temp_max: (responsejson.main.temp_max - 273.15).toFixed(2),
                temp_min: (responsejson.main.temp_min - 273.15).toFixed(2),
                feels: (responsejson.main.feels_like - 273.15).toFixed(2),
                humidity: responsejson.main.humidity,
                description: responsejson.weather[0].description,
                visibility: responsejson.visibility,
                speed: responsejson.wind.speed,
                condition: responsejson.weather[0].main
            };

            let data = localStorage.setItem("weatherdata", JSON.stringify(result))
            let getdata = localStorage.getItem("weatherdata");
            let parsedata = JSON.parse(getdata)
            setWeatherData(parsedata)
            console.log('parsedata', parsedata.feels)

            toast.success(`Weather data for ${result.name} loaded successfully!`);
        } catch (err) {
            console.error(err.message);
            setWeatherData(null);
            setError(err.message);
            toast.error(error)
        }
    }

    function searchCity(e) {
        console.log(e.target.value)
        setCity(e.target.value)
    }

    function submit(e) {
        e.preventDefault()
        console.log(city)
        setCity("")
        getWeatherDetails()
    }
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timeDate = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
        return () => clearInterval(timeDate);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div>
            <h1 className='m-4 text-[40px] font-bold text-black'>Search Weather Widget</h1>
            <TextField
                hiddenLabel
                id="filled-hidden-label-normal"
                placeholder="Search for a city"
                variant="outlined"
                onChange={searchCity} required /><br></br><br></br>
            <Button variant="contained" type='submit' onClick={submit}>Search</Button><br></br><br></br>

            {/* Toastify Container */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

            <div className="w-96 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 rounded-3xl p-6 text-white shadow-2xl  m-auto ">

                {/* Header */}
                < div className="flex justify-between items-start mb-6 ">
                    <div>
                        <h2 className="text-lg font-bold flex  items-start">{weatherData?.name}</h2>
                        <p className="text-sm opacity-80 flex  items-start">{formatDate(currentDateTime)}</p>
                        <p className="text-sm opacity-80 flex  items-start">{formatTime(currentDateTime)}</p>
                    </div>
                </div>

                {/* Main Temperature */}
                <div className="text-center mb-6">
                    <div className="text-6xl font-lightbold mb-2">{weatherData?.temp}°</div>
                    <p className="text-lg opacity-90">{weatherData?.condition}</p>
                    <p className="text-sm opacity-70">Feels like {weatherData?.feels}°C</p>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Droplets size={16} className="opacity-80" />
                            <span className="text-sm opacity-80">Humidity</span>
                        </div>
                        <p className="text-xl font-medium">{weatherData?.humidity}%</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Wind size={16} className="opacity-80" />
                            <span className="text-sm opacity-80">Wind</span>
                        </div>
                        <p className="text-xl font-medium">{weatherData?.speed} km/h</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Eye size={16} className="opacity-80" />
                            <span className="text-sm opacity-80">Visibility</span>
                        </div>
                        <p className="text-xl font-medium">{weatherData?.visibility} km</p>
                    </div>
                </div>
            </div>
        </div >
    )
}

