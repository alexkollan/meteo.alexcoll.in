"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!location) {
      setError("Please enter a location.");
      return;
    }

    setError("");
    setWeather(null);

    try {
      // Use a geocoding API to get latitude and longitude
      const geoResponse = await axios.get(
        `https://geocode.maps.co/search?q=${encodeURIComponent(location)}`
      );

      if (geoResponse.data.length === 0) {
        setError("Invalid location. Please try again.");
        return;
      }

      const { lat, lon } = geoResponse.data[0];

      const response = await axios.get(
        `http://localhost:5001/api/weather?latitude=${lat}&longitude=${lon}`
      );

      setWeather(response.data);
    } catch (err) {
      console.error("Error fetching data:", err.message);
      setError("Failed to fetch weather data. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Weather App</h1>
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Enter city or location"
          className="w-full px-4 py-2 text-gray-900 rounded-md mb-4"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <div className="container">
          <button
            onClick={fetchWeather}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Get Weather
          </button>
          <button className="min-w-3 bg-red-800 hover:bg-red-500 text-white py-2 px-4 rounded-md">
            Test button
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {weather && (
        <div className="mt-6 bg-gray-800 p-4 rounded-md">
          <h2 className="text-xl font-semibold">Weather in {location}</h2>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Wind Speed: {weather.windspeed} km/h</p>
          <p>Description: {weather.description}</p>
        </div>
      )}
    </div>
  );
}