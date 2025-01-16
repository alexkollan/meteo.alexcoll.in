const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const weatherRoute = require("./routes/weather");
const geocodeRoute = require("./routes/geocode");
app.use("/api/weather", weatherRoute);
app.use("/api/geocode", geocodeRoute);

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});