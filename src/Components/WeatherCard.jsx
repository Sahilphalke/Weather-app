import clear from "../Images/clear.png";
import cloud from "../Images/cloud.png";
import drizzle from "../Images/drizzle.png";
import rain from "../Images/rain.png";
import snow from "../Images/snow.png";
import { Search, Waves, Wind } from "lucide-react";
import React, { useEffect, useState } from "react";

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const allIcons = {
    "01d": clear,
    "01n": clear,
    "02d": cloud,
    "02n": cloud,
    "03d": cloud,
    "03n": cloud,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow,
  };

  const search = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
        import.meta.env.VITE_APP_ID
      }&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.cod == 404) {
        alert(data.message);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear;
      setWeatherData({
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        country: data.sys.country,
        sunrise: data.sys.sunrise,
        icon: icon,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const fetchSuggestions = async (input) => {
    try {
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=10&appid=${
        import.meta.env.VITE_APP_ID
      }`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data, " <== Data");

      setFilteredSuggestions(
        data.map((item) => `${item.name}, ${item.country}`)
      );
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setCity(input);

    if (input) {
      fetchSuggestions(input);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    setFilteredSuggestions([]);
    search(suggestion);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city) {
      search(city);
      setCity("");
      setFilteredSuggestions([]);
    }
  };

  useEffect(() => {
    search("Pune");
  }, []);

  return (
    <div className="min-h-screen mx-auto flex justify-center items-center bg-[#e3d8ff]">
      <div className="space-y-2 p-8 bg-[#3c36ae] text-white rounded-lg w-85">
        <div>
          <form
            onSubmit={handleSearch}
            className="flex justify-center items-center gap-4 relative"
          >
            <input
              placeholder="Search"
              value={city}
              onChange={handleInputChange}
              className="rounded-full py-1 border-2 text-slate-800 bg-white placeholder:text-slate-400 border-white outline-none px-4"
            />
            {filteredSuggestions.length > 0 && (
              <ul className="absolute top-12 bg-white text-slate-800 rounded-lg shadow-lg w-full max-h-40 overflow-y-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
            <button
              type="submit"
              className="w-10 h-10 bg-white text-slate-400 flex justify-center items-center rounded-full"
            >
              <Search />
            </button>
          </form>
        </div>
        {weatherData && (
          <>
            <div className="text-yellow-400 flex justify-center">
              <img src={weatherData.icon} alt="Weather Icon" width={"50%"} />
            </div>
            <div className="text-center">
              <div className="text-5xl font-semibold mb-2">
                {weatherData.temperature}°C
              </div>
              <div className="text-3xl font-semibold">
                {weatherData.location}
                <h6 className="text-xl">{weatherData.country}</h6>
              </div>
            </div>
            <div className="mt-8">
              <div className="grid grid-cols-2">
                <div className="flex justify-center gap-2">
                  <Waves />
                  <div>
                    <div>{weatherData.humidity}%</div>
                    <div>Humidity</div>
                  </div>
                </div>
                <div className="flex justify-center gap-2">
                  <Wind />
                  <div>
                    <div>{weatherData.windspeed} km/h</div>
                    <div>Wind Speed</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;
