# My little web3 Server

Ce projet est un serveur HTTP asynchrone pour gérer (créer, récupérer, mettre à jour) des resources web3 comme les images de collections nft. Une collection **Postman** est incluse pour tester facilement l'API.

## Démarrage
1. **Lancer la base de donnée**
   Utiliser le `.env.template` comme model pour votre `.env`.
   ```bash
   source .env
   docker compose up -d
   ```

   Supprimer le volume pour partir d'une DB clean:
   ```bash
   docker compose down
   docker volume rm back_pgdata
   docker compose up -d
   ```

2. **Lancer le serveur** :
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

## Créé une table avec diesel

Pour créer ta table `users` avec Diesel, voici ce que tu dois faire :

1. Créer un fichier de migration

   ```bash
   diesel migration generate create_users
   ```
   
   Cela crée deux fichiers :
   ```
   migrations/
   └── {timestamp}_create_users/
      ├── up.sql
      └── down.sql
   ```

2. Éditer `up.sql`

   ```sql
   CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR NOT NULL UNIQUE,
      password_hash VARCHAR NOT NULL
   );
   ```

3. Éditer `down.sql`

   ```sql
   DROP TABLE users;
   ```

4. Appliquer la migration

   ```bash
   diesel migration run
   ```

   Après ça, tu pourras faire :

   ```bash
   diesel print-schema > src/schema.rs
   ```
