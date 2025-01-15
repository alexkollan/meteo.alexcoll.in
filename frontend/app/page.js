'use client';

import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  Alert,
} from '@mui/material';

export default function Home() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!location) {
      setError('Please enter a location.');
      return;
    }

    setError('');
    setWeather(null);

    try {
      const geoResponse = await axios.get(
        `https://geocode.maps.co/search?q=${encodeURIComponent(location)}`
      );

      if (geoResponse.data.length === 0) {
        setError('Invalid location. Please try again.');
        return;
      }

      const { lat, lon } = geoResponse.data[0];

      const response = await axios.get(
        `http://localhost:5001/api/weather?latitude=${lat}&longitude=${lon}`
      );

      setWeather(response.data);
    } catch (err) {
      console.error('Error fetching data:', err.message);
      setError('Failed to fetch weather data. Please try again.');
    }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Weather App
      </Typography>
      <Box
        component="form"
        sx={{
          width: '100%',
          maxWidth: 400,
          mb: 4,
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          fullWidth
          label="Enter city or location"
          variant="outlined"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={fetchWeather}
          sx={{ mb: 2 }}
        >
          Get Weather
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {weather && (
        <Card sx={{ mt: 4, width: '100%', maxWidth: 400 }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              Weather in {location}
            </Typography>
            <Typography variant="body1">
              Temperature: {weather.temperature}°C
            </Typography>
            <Typography variant="body1">
              Wind Speed: {weather.windspeed} km/h
            </Typography>
            <Typography variant="body1">
              Description: {weather.description}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
