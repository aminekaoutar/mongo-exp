const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const reservationRoutes = require('./routes/reservation');

const app = express();
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.log(err));

app.use('/api/reservations', reservationRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur port ${PORT}`));
