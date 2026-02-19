const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // plus besoin d'options
    console.log("MongoDB connecté ✅");
  } catch (err) {
    console.error("Erreur MongoDB :", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
