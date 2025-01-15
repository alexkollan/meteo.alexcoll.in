const express = require("express");
const axios = require("axios");
const router = express.Router();

const OPEN_WEATHER_URL = "https://api.openweathermap.org/data/3.0/onecall";
require("dotenv").config();
const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;

router.get("/", async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  try {
    const response = await axios.get(OPEN_WEATHER_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: OPEN_WEATHER_API_KEY,
        units: "metric", // Temperature in Celsius
        exclude: "minutely,hourly,daily,alerts", // Only get current weather
      },
    });
    console.log(response.data);
    console.log(response.data.current);
    // Map OpenWeatherMap response to your desired structure
    const weatherData = {
      temperature: response.data.current.temp,
      windspeed: response.data.current.wind_speed,
      weathercode: response.data.current.weather[0].id,
      description: response.data.current.weather[0].description,
    };

    res.json(weatherData);
  } catch (err) {
    console.error("Error fetching weather data:", err.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

module.exports = router;