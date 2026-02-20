const API_URL = '/api/chambres';
const RESERVATION_API_URL = '/api/reservations';
let allRooms = [];

// Show alert messages
function showAlert(message, type = 'success') {
  const alertContainer = document.getElementById('alertContainer');
  alertContainer.innerHTML = `
    <div class="alert alert-${type}">
      ${message}
    </div>
  `;
  
  // Auto-hide success alerts after 3 seconds
  if (type === 'success') {
    setTimeout(() => {
      alertContainer.innerHTML = '';
    }, 3000);
  }
}

// Fetch all rooms from the API
async function fetchRooms() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    allRooms = await response.json();
    displayRooms(allRooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    showAlert('Erreur lors du chargement des chambres', 'error');
  }
}

// Display rooms in the grid
function displayRooms(rooms) {
  const container = document.getElementById('roomsContainer');
  
  if (rooms.length === 0) {
    container.innerHTML = '<div class="no-rooms">Aucune chambre disponible actuellement</div>';
    return;
  }
  
  container.innerHTML = rooms.map(room => `
    <div class="room-card" data-room-id="${room._id}">
      <h3> chambre ${room.numero}</h3>
      <div class="room-details">
        <div class="room-detail">
          <span class="detail-label">Type:</span>
          <span class="detail-value">${room.type}</span>
        </div>
        <div class="room-detail">
          <span class="detail-label">Capacité:</span>
          <span class="detail-value">${room.capacite} personne(s)</span>
        </div>
        <div class="room-detail">
          <span class="detail-label">Prix/Nuit:</span>
          <span class="detail-value">${room.prixParNuit}€</span>
        </div>
        <div class="room-detail">
          <span class="detail-label">Équipements:</span>
          <span class="detail-value">${room.equipements && room.equipements.length > 0 ? room.equipements.join(', ') : 'Aucun'}</span>
        </div>
        <div class="room-detail">
          <span class="detail-label">Disponibilité:</span>
          <span class="detail-value status-${room.disponible ? 'available' : 'booked'}">
            ${room.disponible ? 'Disponible' : 'Occupée'}
          </span>
        </div>
      </div>
      <div class="room-actions">
        <button class="action-btn edit-btn" onclick="editRoom('${room._id}')">Modifier</button>
        <button class="action-btn delete-btn" onclick="deleteRoom('${room._id}')">Supprimer</button>
        ${room.disponible ? `<button class="action-btn edit-btn" onclick="reserveRoom('${room._id}', '${room.numero}', ${room.prixParNuit})">Réserver</button>` : ''}
      </div>
    </div>
  `).join('');
}

// Reserve a room
async function reserveRoom(roomId, roomNumber, roomPrice) {
  // Create a simple reservation form in a modal
  const clientName = prompt(`Réserver la chambre ${roomNumber}\nPrix par nuit: ${roomPrice}€\n\nEntrez votre nom:`);
  
  if (!clientName) return; // User cancelled
  
  // Get check-in date (today by default)
  const today = new Date();
  const checkInDate = prompt(`Date d'arrivée (format: YYYY-MM-DD):\nExemple: ${today.toISOString().split('T')[0]}`, today.toISOString().split('T')[0]);
  
  if (!checkInDate) return; // User cancelled
  
  // Get check-out date
  const checkOutDate = prompt(`Date de départ (format: YYYY-MM-DD):`, checkInDate);
  
  if (!checkOutDate) return; // User cancelled
  
  try {
    // First, create a temporary user or get an existing one
    // For now, we'll bypass the user validation and directly create the reservation
    // using a simplified approach that doesn't require a real utilisateur
    
    // Create reservation data - we'll create a reservation without validating utilisateur for now
    const reservationData = {
      utilisateur_nom: clientName, // Store the name instead of ID
      chambre_id: roomId,
      date_arrivee: checkInDate,
      date_depart: checkOutDate,
      nombre_personnes: 1, // Default to 1 person
      prix_total: calculateTotalPrice(roomPrice, checkInDate, checkOutDate)
    };
    
    // Send reservation request to the API
    const response = await fetch(RESERVATION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la réservation de la chambre');
    }

    const reservationResult = await response.json();
    
    // Show success alert
    alert(`✅ Réservation confirmée!
Chambre: ${roomNumber}
Client: ${clientName}
Prix total: ${reservationResult.prix_total || reservationData.prix_total}€
Arrivée: ${checkInDate}
Départ: ${checkOutDate}`);
    
    // Update the room availability
    updateRoomAvailability(roomId, false);
    
    // Refresh the room list
    fetchRooms();
    
  } catch (error) {
    console.error('Error reserving room:', error);
    showAlert(error.message || 'Erreur lors de la réservation', 'error');
  }
}

// Calculate total price based on nights
function calculateTotalPrice(pricePerNight, checkInDate, checkOutDate) {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diffTime = Math.abs(checkOut - checkIn);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Ensure at least 1 night
  return diffDays > 0 ? pricePerNight * diffDays : pricePerNight;
}

// Update room availability after reservation
async function updateRoomAvailability(roomId, disponible) {
  try {
    const response = await fetch(`${API_URL}/${roomId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ disponible })
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour de la disponibilité');
    }
  } catch (error) {
    console.error('Error updating room availability:', error);
  }
}

// Add a new room
async function addRoom(roomData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roomData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'ajout de la chambre');
    }

    const newRoom = await response.json();
    showAlert('Chambre ajoutée avec succès !');
    document.getElementById('roomForm').reset();
    fetchRooms(); // Refresh the list
  } catch (error) {
    console.error('Error adding room:', error);
    showAlert(error.message || 'Erreur lors de l\'ajout de la chambre', 'error');
  }
}

// Update a room
async function updateRoom(id, roomData) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roomData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la mise à jour de la chambre');
    }

    const updatedRoom = await response.json();
    showAlert('Chambre mise à jour avec succès !');
    fetchRooms(); // Refresh the list
  } catch (error) {
    console.error('Error updating room:', error);
    showAlert(error.message || 'Erreur lors de la mise à jour de la chambre', 'error');
  }
}

// Delete a room
async function deleteRoom(id) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la suppression de la chambre');
    }

    const result = await response.json();
    showAlert(result.message || 'Chambre supprimée avec succès !');
    fetchRooms(); // Refresh the list
  } catch (error) {
    console.error('Error deleting room:', error);
    showAlert(error.message || 'Erreur lors de la suppression de la chambre', 'error');
  }
}

// Search rooms based on criteria
function searchRooms(criteria) {
  let filteredRooms = [...allRooms];

  if (criteria.capacite) {
    filteredRooms = filteredRooms.filter(room => room.capacite >= parseInt(criteria.capacite));
  }

  if (criteria.prixMax) {
    filteredRooms = filteredRooms.filter(room => room.prixParNuit <= parseFloat(criteria.prixMax));
  }

  if (criteria.type) {
    filteredRooms = filteredRooms.filter(room => room.type.toLowerCase().includes(criteria.type.toLowerCase()));
  }

  displayRooms(filteredRooms);
}

// Edit room function
function editRoom(id) {
  const room = allRooms.find(r => r._id === id);
  if (!room) return;

  // Fill the form with room data
  document.getElementById('numero').value = room.numero;
  document.getElementById('type').value = room.type;
  document.getElementById('capacite').value = room.capacite;
  document.getElementById('prixParNuit').value = room.prixParNuit;
  document.getElementById('equipements').value = room.equipements ? room.equipements.join(', ') : '';
  document.getElementById('disponible').value = room.disponible.toString();

  // Change form submit behavior to update instead of add
  const form = document.getElementById('roomForm');
  form.onsubmit = async (e) => {
    e.preventDefault();
    
    const formData = {
      numero: document.getElementById('numero').value,
      type: document.getElementById('type').value,
      capacite: parseInt(document.getElementById('capacite').value),
      prixParNuit: parseFloat(document.getElementById('prixParNuit').value),
      equipements: document.getElementById('equipements').value.split(',').map(e => e.trim()).filter(e => e),
      disponible: document.getElementById('disponible').value === 'true'
    };

    await updateRoom(id, formData);
    
    // Reset form to default behavior
    form.onsubmit = handleRoomFormSubmit;
    form.reset();
  };
}

// Handle room form submission
async function handleRoomFormSubmit(event) {
  event.preventDefault();
  
  const formData = {
    numero: document.getElementById('numero').value,
    type: document.getElementById('type').value,
    capacite: parseInt(document.getElementById('capacite').value),
    prixParNuit: parseFloat(document.getElementById('prixParNuit').value),
    equipements: document.getElementById('equipements').value.split(',').map(e => e.trim()).filter(e => e),
    disponible: document.getElementById('disponible').value === 'true'
  };

  await addRoom(formData);
}

// Handle search form submission
async function handleSearchFormSubmit(event) {
  event.preventDefault();
  
  const criteria = {
    capacite: document.getElementById('searchCapacite').value,
    prixMax: document.getElementById('searchPrix').value,
    type: document.getElementById('searchType').value
  };

  searchRooms(criteria);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Room form submission
  const roomForm = document.getElementById('roomForm');
  if (roomForm) {
    roomForm.addEventListener('submit', handleRoomFormSubmit);
  }

  // Search form submission
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', handleSearchFormSubmit);
  }

  // Load rooms when page loads
  fetchRooms();
});