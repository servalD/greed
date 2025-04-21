# 🛠️ ESGI Blockchain Architecture Project

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


## 📜 Contrats (Foundry) *TODO*
```bash
make foundry-deploy
```
⚠️ Assurez-vous que `anvil` est lancé avant de déployer.


## 🎯 À venir
- Tests automatisés
- Déploiement CI

---


