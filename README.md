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

- Docker Desktop installé et en cours d'exécution
- Docker Compose

## Installation

1. Assurez-vous que Docker Desktop est en cours d'exécution sur votre machine
2. Clonez ce dépôt
3. Exécutez la commande suivante pour démarrer le conteneur MongoDB :

```bash
docker-compose up -d
```

Cela va créer :
- Un conteneur MongoDB nommé `mongo-hotel`
- Une base de données `hotel_reservation`
- Les collections avec des données d'exemple

## Accéder à la base de données

Pour accéder à MongoDB via le shell :

```bash
docker exec -it mongo-hotel mongosh hotel_reservation
```

## Informations de connexion

- Adresse : `localhost:27017`
- Nom de la base de données : `hotel_reservation`
- Identifiant administrateur : `admin`
- Mot de passe : `pass`

## Interface Web

Accédez à l'interface web à l'adresse suivante :
- URL : `http://localhost:8081`
- Identifiant : `admin`
- Mot de passe : `pass`

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