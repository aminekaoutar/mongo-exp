require("dotenv").config();
const connectDB = require("./config/db");
const Chambre = require("./models/Chambre");
const Hotel = require("./models/Hotel");

async function seedDatabase() {
  try {
    // Connect to DB
    await connectDB();

    // Clear existing data
    await Chambre.deleteMany({});
    await Hotel.deleteMany({});

    // Create sample hotels
    const sampleHotels = [
      {
        nom: "Hôtel Paris Centre",
        adresse: {
          rue: "123 Rue de Rivoli",
          ville: "Paris",
          codePostal: "75001",
          pays: "France"
        },
        telephone: "+33123456789",
        email: "contact@hotelpariscentre.fr",
        nombreEtoiles: 4,
        description: "Hôtel élégant au cœur de Paris",
        services: ["wifi", "petit-déjeuner", "piscine", "spa"]
      },
      {
        nom: "Hôtel Lyon Confluence",
        adresse: {
          rue: "45 Quai Romain Rolland",
          ville: "Lyon",
          codePostal: "69006",
          pays: "France"
        },
        telephone: "+33456789123",
        email: "contact@hoteillyonconfluence.fr",
        nombreEtoiles: 3,
        description: "Hôtel moderne dans le quartier Confluence",
        services: ["wifi", "restaurant", "parking"]
      }
    ];

    const createdHotels = await Hotel.insertMany(sampleHotels);
    console.log(`Created ${createdHotels.length} hotels`);

    // Create sample rooms
    const sampleRooms = [
      {
        hotel_id: createdHotels[0]._id,
        numero: "101",
        type: "simple",
        capacite: 1,
        prixParNuit: 85.50,
        equipements: ["lit_simple", "salle_de_bain", "tv", "wifi", "climatisation"],
        disponible: true
      },
      {
        hotel_id: createdHotels[0]._id,
        numero: "205",
        type: "double",
        capacite: 2,
        prixParNuit: 120.00,
        equipements: ["lit_double", "salle_de_bain", "tv", "wifi", "climatisation", "balcon"],
        disponible: true
      },
      {
        hotel_id: createdHotels[1]._id,
        numero: "102",
        type: "simple",
        capacite: 1,
        prixParNuit: 75.00,
        equipements: ["lit_simple", "salle_de_bain", "tv", "wifi"],
        disponible: false
      },
      {
        hotel_id: createdHotels[1]._id,
        numero: "301",
        type: "suite",
        capacite: 4,
        prixParNuit: 250.00,
        equipements: ["grand_lit", "salle_de_bain_privative", "tv", "wifi", "jacuzzi", "vue_ville"],
        disponible: true
      },
      {
        numero: "401", // Room not linked to a specific hotel
        type: "double",
        capacite: 2,
        prixParNuit: 100.00,
        equipements: ["lit_double", "salle_de_bain", "tv", "wifi"],
        disponible: true
      }
    ];

    const createdRooms = await Chambre.insertMany(sampleRooms);
    console.log(`Created ${createdRooms.length} rooms`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();