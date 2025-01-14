# My little web3 Server

Ce projet est un serveur HTTP asynchrone pour gérer (créer, récupérer, mettre à jour) des resources web3 comme les images de collections nft. Une collection **Postman** est incluse pour tester facilement l'API.

## Démarrage

1. **Lancer le serveur** :
   ```bash
   cargo run
   ```
   Le serveur démarre sur `http://127.0.0.1:3000`.

## Tester avec Postman

1. **Importer la collection**

2. **Tester les endpoints** :
   - `POST /image` : Créer une image.
   - `GET /image/:id` : Récupérer une image.
   - `PATCH /image/:id` : Mettre à jour une image.
