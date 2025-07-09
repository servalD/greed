# 🛠️ ESGI Blockchain

Ce projet regroupe plusieurs composants : un backend Rust, un frontend TypeScript, et des smart contracts via Foundry.

## 📁 Structure du repo
```
.
├── front/       # Interface utilisateur (TS/React/...)
├── back/        # Backend Rust (API + Auth)
├── foundry/     # Smart contracts (Forge)
├── Makefile     # Scripts utilitaires
```

## 🚀 Installation rapide
### Pré-requis
- Docker + Docker Compose
- pnpm
- Rust (via rustup)
- Foundry (via `foundryup`)

### Setup global
```bash
make setup-all
```
Cela installe et build le front, le back, et les contrats.


## 📦 Backend Rust

### Démarrage du backend
```bash
make back-up
```
- Lance PostgreSQL via Docker
- Exécute les migrations
- Démarre l’API Rust

### Arrêt et nettoyage
```bash
make back-clean
```

### Ajouter une migration
```bash
make back-add-migration
```

## 🔐 Authentification
Le backend utilise un système JWT + refresh token sécurisé.
👉 Voir la documentation détaillée ici : [`auth_service.md`](/back/src/services/auth_service.md)


## 📜 Contrats (Foundry)

### Deployer sur sepolia
```bash
make foundry-deploy
```

### Verifier les contracts Manager et Agency
```bash
make foundry-verify
```

## Frontend (Next.js)

### Démarage du frontend
```bash
make front-up
```

## 🎯 À venir
- Tests automatisés
- Déploiement CI

## Liste complette des commandes makefile

```bash
  make help
  setup-all            Install Foundry, compile le backend et build le frontend
  setup-front          Install, genere les wagmi hooks et build le frontend (pnpm)
  setup-back           Compile le backend Rust
  setup-foundry        Install les dépendances et compile les smart contracts
  foundry-deploy       Compile, deploie sur Sepolia
  foundry-verify       Vérifie le contrat Manager, Agency et Copro sur Etherscan Sepolia
  back-up              Clean, démarre les services backend et lance l application
  back-clean           Stoppe les conteneurs et supprime les volumes
  back-add-migration   Crée, valide et exécute une nouvelle migration Diesel
  front-up             Démarre le frontend
```

---


