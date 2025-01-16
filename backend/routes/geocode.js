const express = require("express");
const axios = require("axios");
const redis = require("redis");
const router = express.Router();

const OPEN_WEATHER_GEO_URL = "http://api.openweathermap.org/geo/1.0/direct";
require("dotenv").config();
const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;

// Initialize Redis client
const redisClient = redis.createClient();

redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.connect(); // Connect to Redis server

router.get("/", async (req, res) => {
  const { cityName } = req.query;
  const clientDetails = {
    // ip: req.socket.remoteAddress,
    method: req.method,
    // url: req.originalUrl,
    query: req.query,
    // headers: req.headers,
    // userAgent: req.headers['user-agent'],
    // acceptLanguage: req.headers['accept-language'],
    // protocol: req.protocol,
    host: req.headers['host'],
    // referrer: req.headers['referer'] || req.headers['referrer'],
    // cookies: req.headers['cookie'],
    // contentType: req.headers['content-type'],
    // encoding: req.headers['accept-encoding'],
    // port: req.socket.remotePort,
    // isSecure: req.socket.encrypted,
  };
  console.log(clientDetails);
  
  if (!cityName) {
    return res.status(400).json({ error: "City name is required" });
  }

  try {
    // Check if data is already cached
    const cacheKey = `weather:${cityName.toLowerCase()}`; // Use city name as cache key
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("Serving from cache");
      return res.json(JSON.parse(cachedData)); // Send cached response
    }

    // Fetch data from OpenWeatherMap API
    const response = await axios.get(OPEN_WEATHER_GEO_URL, {
      params: {
        q: cityName,
        appid: OPEN_WEATHER_API_KEY,
      },
    });

    // Map OpenWeatherMap response to desired structure
    const cityCords = {
      city: cityName,
      lat: response.data[0].lat,
      lon: response.data[0].lon,
      countryCode: response.data[0].country,
      state: response.data[0].state,
    };

    // Cache the result in Redis for 10 minutes (600 seconds)
    await redisClient.setEx(cacheKey, 600, JSON.stringify(cityCords));

    console.log("Serving from API");
    res.json(cityCords);
  } catch (err) {
    console.error("Error fetching weather data:", err.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

module.exports = router;
