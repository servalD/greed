# My little web3 Server

Ce projet est un serveur HTTP asynchrone pour gérer (créer, récupérer, mettre à jour) des resources web3 comme les images de collections nft. Une collection **Postman** est incluse pour tester facilement l'API.

## Démarrage
   Un make file a la racine permet de ne devoire lancer qu'un commande:
   ```shell
   make back-up
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

1. Créer un fichier de migration (pour créé de nouveaux tableaux)

   ```bash
   make back-add-migration
   Entrez le nom de la migration(snack case): create_users
   ```
   
   Cela crée deux fichiers a completer:
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

4. Appliquer la migration en comfirmant le prompt
