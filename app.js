require("dotenv").config();
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGODB_URI;
const userRoutes = require("./src/routes/user-routes");
const bookRoutes = require("./src/routes/book-routes");

// MongoDB connection Status
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// cors middleware
app.use(cors());
// Express middleware
app.use(express.json());

// Routes
app.use(userRoutes);
app.use("/book", bookRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to book store management");
});

// 404 route
app.use("/", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});
//Error route
app.use((err, req, res, next) => {
  console.log("---ERROR----");
  console.log(err);
  res.status(err.statusCode || 500).json({
    status: err.statusCode || 500,
    message: err.message,
  });
});
// Create HTTP server using Express app
const server = http.createServer(app);

// Start the server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("MONGODB ERROR", err));
