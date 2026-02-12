const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { version } = require("mongoose");

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

//Enable Routes
app.use("api/v1/auth", require("./routes/authRoutes"));
app.use("api/v1/customers", require("./routes/CustomerRoutes"));
app.use("api/v1/products", require("./routes/ProductRoutes"));
app.use("api/v1/orders", require("./routes/OrderRoutes"));

//Root route
app.get("/", (req, res) => {
  res.json({
    message: "Express MongoDB MVC API",
    version: "1.0.0",
  });
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: error.message,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
