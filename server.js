const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const path = require("path");

const app = express();

// Connexion MongoDB
connectDB();

// JSON middleware
app.use(express.json());

// Servir les fichiers statiques du front
app.use(express.static(path.join(__dirname, "public")));

// Routes API
const chambreRoutes = require("./routes/chambre.routes");
app.use("/api/chambres", chambreRoutes);

// Route test /health
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 404 pour tout le reste
app.use((req, res) => res.status(404).json({ message: "Route introuvable" }));

// Middleware erreur
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Erreur serveur" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
