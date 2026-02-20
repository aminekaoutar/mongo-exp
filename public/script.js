const API_CHAMBRES = "/api/chambres";
const API_UTILISATEURS = "/api/utilisateurs";
const API_RESERVATIONS = "/api/reservations";

let toutesLesChambres = [];

// Charger toutes les chambres
async function chargerChambres() {
  try {
    const res = await fetch(API_CHAMBRES);
    toutesLesChambres = await res.json();
    afficherChambres(toutesLesChambres);
  } catch (err) {
    console.error(err);
    document.getElementById("listeChambres").innerHTML = "Erreur chargement chambres";
  }
}

// Afficher les chambres disponibles
function afficherChambres(chambres) {
  const container = document.getElementById("listeChambres");
  container.innerHTML = "";

  chambres
    .filter(ch => ch.disponible)
    .forEach(ch => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <h3>Chambre ${ch.numero}</h3>
        <p>Type: ${ch.type}</p>
        <p>Capacité: ${ch.capacite} personnes</p>
        <p class="price">${ch.prixParNuit} € / nuit</p>
        <button onclick="selectionnerChambre('${ch._id}')">Réserver</button>
      `;
      container.appendChild(div);
    });
}

// Rechercher chambres
function rechercherChambres() {
  const capacite = Number(document.getElementById("searchCapacite").value);
  const prix = Number(document.getElementById("searchPrix").value);

  let resultats = toutesLesChambres;

  if (capacite) resultats = resultats.filter(ch => ch.capacite >= capacite);
  if (prix) resultats = resultats.filter(ch => ch.prixParNuit <= prix);

  afficherChambres(resultats);
}

// Sélection d’une chambre
function selectionnerChambre(id) {
  document.getElementById("chambreSelectionnee").value = id;
  alert("Chambre sélectionnée ✅");
}

// Confirmer réservation
async function confirmerReservation() {
  const chambreId = document.getElementById("chambreSelectionnee").value;
  const nomClient = document.getElementById("clientNom").value;
  const dateDebut = document.getElementById("dateDebut").value;
  const dateFin = document.getElementById("dateFin").value;

  if (!chambreId || !nomClient || !dateDebut || !dateFin) {
    alert("Veuillez remplir tous les champs et sélectionner une chambre !");
    return;
  }

  try {
    const chambre = toutesLesChambres.find(c => c._id === chambreId);
    const nbNuits = (new Date(dateFin) - new Date(dateDebut)) / (1000 * 60 * 60 * 24);
    const prixTotal = nbNuits * chambre.prixParNuit;

    // Créer un utilisateur temporaire
    const resUser = await fetch(API_UTILISATEURS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: nomClient,
        prenom: "",
        email: `${nomClient.replace(/\s+/g, "").toLowerCase()}@hotel.com`,
        mot_de_passe: "temp"
      })
    });
    const utilisateur = await resUser.json();

    // Créer la réservation
    await fetch(API_RESERVATIONS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        utilisateur_id: utilisateur._id,
        chambre_id: chambreId,
        date_arrivee: dateDebut,
        date_depart: dateFin,
        nombre_personnes: chambre.capacite,
        prix_total: prixTotal,
        statut: "confirmée"
      })
    });

    // Marquer la chambre comme indisponible
    await fetch(`${API_CHAMBRES}/${chambreId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disponible: false })
    });

    alert(`Réservation confirmée 🎉 pour ${nomClient}, total: ${prixTotal.toFixed(2)} €`);
    chargerChambres();
  } catch (err) {
    console.error(err);
    alert("Erreur lors de la réservation");
  }
}
// Ajouter une chambre
async function ajouterChambre() {
  const numero = document.getElementById("numero").value;
  const type = document.getElementById("type").value;
  const capacite = Number(document.getElementById("capacite").value);
  const prixParNuit = Number(document.getElementById("prixParNuit").value);
  const equipements = document.getElementById("equipements").value
                        .split(",").map(e => e.trim());

  if (!numero || !type || !capacite || !prixParNuit) {
    alert("Remplissez tous les champs obligatoires !");
    return;
  }

  try {
    const res = await fetch("/api/chambres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numero, type, capacite, prixParNuit, equipements })
    });

    if (!res.ok) {
      const err = await res.json();
      alert("Erreur: " + err.message);
      return;
    }

    alert("Chambre ajoutée ✅");
    chargerChambres(); // recharge la liste
  } catch (err) {
    alert("Erreur fetch: " + err.message);
  }
}

// Charger les chambres au démarrage
window.onload = chargerChambres;
