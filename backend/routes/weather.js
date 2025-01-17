const express = require("express");
const axios = require("axios");
const redis = require("redis");
const router = express.Router();

const OPEN_WEATHER_URL = "https://api.openweathermap.org/data/3.0/onecall";
require("dotenv").config();
const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;

// Initialize Redis client
const redisClient = redis.createClient();

redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.connect(); // Connect to Redis server

router.get("/", async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  try {
    // Create a cache key based on latitude and longitude
    const cacheKey = `weather:${latitude}:${longitude}`;

    // Check if data is cached
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("Weather Serving from cache");
      return res.json(JSON.parse(cachedData)); // Serve cached data
    }

    // If not cached, fetch data from OpenWeatherMap API
    const response = await axios.get(OPEN_WEATHER_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: OPEN_WEATHER_API_KEY,
        units: "metric", // Temperature in Celsius
        exclude: "minutely,hourly,daily,alerts", // Only get current weather
      },
    });

    // Map OpenWeatherMap response to your desired structure
    const weatherData = {
      temperature: response.data.current.temp,
      windspeed: response.data.current.wind_speed,
      weathercode: response.data.current.weather[0].id,
      description: response.data.current.weather[0].description,
    };

    // Cache the data in Redis for 10 minutes (600 seconds)
    await redisClient.setEx(cacheKey, 6000, JSON.stringify(weatherData));

    console.log("Serving from API");
    res.json(weatherData);
  } catch (err) {
    console.error("Error fetching weather data:", err.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

module.exports = router;
