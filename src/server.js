const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hotel API running ✅" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});


const chambreRoutes = require("./routes/chambre.routes");
app.use("/api/chambres", chambreRoutes);


// 404 - route non trouvée
app.use((req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

// Middleware global d'erreur (JSON)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Erreur serveur",
  });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
