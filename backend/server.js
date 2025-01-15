const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const weatherRoute = require("./routes/weather");
app.use("/api/weather", weatherRoute);

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});