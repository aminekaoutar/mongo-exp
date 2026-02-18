// Initialisation de la base de données hotel_reservation en français
db = db.getSiblingDB('hotel_reservation');

// Création des collections avec exemples de schémas
db.createCollection("utilisateurs");
db.createCollection("hotels");
db.createCollection("chambres");
db.createCollection("reservations");
db.createCollection("paiements");
db.createCollection("avis");

// Insertion d'exemples de données pour chaque collection

// Utilisateurs
db.utilisateurs.insertMany([
  {
    _id: ObjectId(),
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@email.com",
    telephone: "+33123456789",
    mot_de_passe: "motdepassehashé",
    date_creation: new Date(),
    derniere_connexion: new Date()
  },
  {
    _id: ObjectId(),
    nom: "Martin",
    prenom: "Sophie",
    email: "sophie.martin@email.com",
    telephone: "+33987654321",
    mot_de_passe: "motdepassehashé",
    date_creation: new Date(),
    derniere_connexion: new Date()
  }
]);

// Hotels
db.hotels.insertMany([
  {
    _id: ObjectId(),
    nom: "Hôtel Paris Centre",
    adresse: {
      rue: "123 Rue de Rivoli",
      ville: "Paris",
      code_postal: "75001",
      pays: "France"
    },
    telephone: "+33123456789",
    email: "contact@hotelpariscentre.fr",
    nombre_etoiles: 4,
    description: "Hôtel élégant au cœur de Paris",
    services: ["wifi", "petit-déjeuner", "piscine", "spa"],
    date_creation: new Date()
  },
  {
    _id: ObjectId(),
    nom: "Hôtel Lyon Confluence",
    adresse: {
      rue: "45 Quai Romain Rolland",
      ville: "Lyon",
      code_postal: "69006",
      pays: "France"
    },
    telephone: "+33456789123",
    email: "contact@hoteillyonconfluence.fr",
    nombre_etoiles: 3,
    description: "Hôtel moderne dans le quartier Confluence",
    services: ["wifi", "restaurant", "parking"],
    date_creation: new Date()
  }
]);

// Chambres
db.chambres.insertMany([
  {
    _id: ObjectId(),
    hotel_id: db.hotels.findOne({nom: "Hôtel Paris Centre"})._id,
    numero: "101",
    type: "simple",
    capacite: 1,
    prix_nuit: 85.50,
    equipements: ["lit_simple", "salle_de_bain", "tv", "wifi", "climatisation"],
    disponible: true,
    date_creation: new Date()
  },
  {
    _id: ObjectId(),
    hotel_id: db.hotels.findOne({nom: "Hôtel Paris Centre"})._id,
    numero: "205",
    type: "double",
    capacite: 2,
    prix_nuit: 120.00,
    equipements: ["lit_double", "salle_de_bain", "tv", "wifi", "climatisation", "balcon"],
    disponible: true,
    date_creation: new Date()
  },
  {
    _id: ObjectId(),
    hotel_id: db.hotels.findOne({nom: "Hôtel Lyon Confluence"})._id,
    numero: "102",
    type: "simple",
    capacite: 1,
    prix_nuit: 75.00,
    equipements: ["lit_simple", "salle_de_bain", "tv", "wifi"],
    disponible: false,
    date_creation: new Date()
  }
]);

// Réservations
db.reservations.insertMany([
  {
    _id: ObjectId(),
    utilisateur_id: db.utilisateurs.findOne({email: "jean.dupont@email.com"})._id,
    chambre_id: db.chambres.findOne({numero: "101", hotel_id: db.hotels.findOne({nom: "Hôtel Paris Centre"})._id})._id,
    date_arrivee: ISODate("2023-06-15"),
    date_depart: ISODate("2023-06-18"),
    nombre_personnes: 1,
    statut: "confirmée",
    date_reservation: new Date(),
    prix_total: 256.50
  },
  {
    _id: ObjectId(),
    utilisateur_id: db.utilisateurs.findOne({email: "sophie.martin@email.com"})._id,
    chambre_id: db.chambres.findOne({numero: "205", hotel_id: db.hotels.findOne({nom: "Hôtel Paris Centre"})._id})._id,
    date_arrivee: ISODate("2023-07-10"),
    date_depart: ISODate("2023-07-15"),
    nombre_personnes: 2,
    statut: "confirmée",
    date_reservation: new Date(),
    prix_total: 600.00
  }
]);

// Paiements
db.paiements.insertMany([
  {
    _id: ObjectId(),
    reservation_id: db.reservations.findOne({statut: "confirmée"})._id,
    utilisateur_id: db.utilisateurs.findOne({email: "jean.dupont@email.com"})._id,
    montant: 256.50,
    devise: "EUR",
    methode_paiement: "carte_bancaire",
    statut: "payé",
    date_paiement: new Date(),
    transaction_id: "TXN001234567890"
  },
  {
    _id: ObjectId(),
    reservation_id: db.reservations.findOne({prix_total: 600.00})._id,
    utilisateur_id: db.utilisateurs.findOne({email: "sophie.martin@email.com"})._id,
    montant: 600.00,
    devise: "EUR",
    methode_paiement: "carte_bancaire",
    statut: "payé",
    date_paiement: new Date(),
    transaction_id: "TXN002345678901"
  }
]);

// Avis
db.avis.insertMany([
  {
    _id: ObjectId(),
    utilisateur_id: db.utilisateurs.findOne({email: "jean.dupont@email.com"})._id,
    hotel_id: db.hotels.findOne({nom: "Hôtel Paris Centre"})._id,
    chambre_id: db.chambres.findOne({numero: "101", hotel_id: db.hotels.findOne({nom: "Hôtel Paris Centre"})._id})._id,
    reservation_id: db.reservations.findOne({utilisateur_id: db.utilisateurs.findOne({email: "jean.dupont@email.com"})._id})._id,
    note: 4,
    commentaire: "Très bon séjour, personnel accueillant et chambre propre",
    date_avis: new Date()
  },
  {
    _id: ObjectId(),
    utilisateur_id: db.utilisateurs.findOne({email: "sophie.martin@email.com"})._id,
    hotel_id: db.hotels.findOne({nom: "Hôtel Paris Centre"})._id,
    chambre_id: db.chambres.findOne({numero: "205", hotel_id: db.hotels.findOne({nom: "Hôtel Paris Centre"})._id})._id,
    reservation_id: db.reservations.findOne({utilisateur_id: db.utilisateurs.findOne({email: "sophie.martin@email.com"})._id})._id,
    note: 5,
    commentaire: "Parfait ! La vue depuis la chambre était magnifique",
    date_avis: new Date()
  }
]);

print("Base de données hotel_reservation initialisée avec succès !");
print("Collections créées : utilisateurs, hotels, chambres, reservations, paiements, avis");