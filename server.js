require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API Routes
const chambreRoutes = require("./routes/chambre.routes");
const reservationRoutes = require("./routes/reservation.routes");
app.use("/api/chambres", chambreRoutes);
app.use("/api/reservations", reservationRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: err.message || "Une erreur serveur s'est produite" 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});