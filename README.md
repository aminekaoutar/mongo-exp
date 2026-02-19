# Système de Réservation d'Hôtel avec MongoDB

Ce projet met en place une base de données MongoDB pour un système de réservation d'hôtel à l'aide de Docker.

## Architecture

```
Docker
 └── mongo-hotel container
        └── hotel_reservation DB
              ├── utilisateurs
              ├── hotels
              ├── chambres
              ├── reservations
              ├── paiements
              └── avis
```

## Prérequis

- Node.js installé
- MongoDB installé et en fonctionnement (local ou via Docker)
- Navigateur pour tester le front
- Terminal / PowerShell

## Installation

# 1 Cloner le projet :

```bash
git clone https://github.com/aminekaoutar/mongo-exp
cd mongo-exp
```
# 2 Installer les dépendances Node.js :

```bash
npm install
```
#  3 Créer un fichier .env à la racine avec le contenu suivant :
```bash
MONGO_URI=mongodb://localhost:27017/hotel
PORT=5000
```
# Lancer MongoDB 
# Lancer le serveur Node.js :
```bash
node server.js
Le serveur sera accessible sur : http://localhost:5000
Vous pourrez :

Ajouter une chambre

Voir la liste des chambres

Supprimer une chambre
```
## Structure des collections

### utilisateurs
Contient les informations des clients : nom, prénom, email, téléphone, etc.

### hotels
Détails des hôtels : nom, adresse, services, nombre d'étoiles, etc.

### chambres
Informations sur les chambres : numéro, type, capacité, prix, équipements, disponibilité.

### reservations
Réservations des clients : dates, statut, prix total, etc.

### paiements
Informations de paiement : montant, méthode, statut, transaction.

### avis
Avis et commentaires des clients sur leur séjour.
