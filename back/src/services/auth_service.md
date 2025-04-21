# 🔐 Authentification - Documentation technique

## 1. Vue d'ensemble
Le système d'authentification repose sur deux types de jetons :
- Un **JWT** (token d'accès court terme)
- Un **refresh token** (jeton longue durée stocké en base)

Les deux sont liés via une signature et permettent un **contrôle d'accès sécurisé et réversible** tout en **optimisant les performances** via un mécanisme de validation espacé.

---

## 2. Structure du JWT
Le JWT est signé avec une clé secrète et contient :

```json
{
  "sub": 42,               // ID utilisateur
  "exp": 1712500000,       // expiration Unix timestamp
  "start": 1712499700,     // timestamp d'émission
  "refresh": "uuid-token" // jeton de session lié
}
```

---

## 3. Fonctionnement du refresh token
Le refresh token :
- est généré à la connexion
- est **persisté en base**
- contient : `user_id`, `token`, `expires_at`

Il est **utilisé pour générer un nouveau JWT** ou pour invalider des sessions (logout).

---

## 4. Validation des JWT (avec "division windows")
Chaque JWT contient un champ `start`. Lors de la validation :

```rust
let current_refresh = (now - start) / jwt_check_interval;
```

- Si ce **compteur a changé** depuis le dernier appel → on **revalide en base** que le refresh token existe encore.
- Sinon, la validation est **stateless et rapide**.

Cette technique équilibre **performance** (moins de hits DB) et **révocabilité**.

---

## 5. Révocation & Sécurité
- Révocation immédiate possible : en supprimant un refresh token en base
- JWTs liés à un refresh révoqué sont automatiquement invalidés
- `logout`, `refresh` ou `rotation` peuvent supprimer les anciens refresh tokens

---

## 6. Flux d'authentification

### 🔐 Login
- Vérifie les credentials
- Crée un refresh token
- Génère un JWT à partir du refresh token

### ♻️ Refresh
- Reçoit un refresh token
- Vérifie sa validité en base
- Supprime l'ancien, génère un nouveau refresh + JWT

### 🚪 Logout
- Reçoit un refresh token
- Le supprime de la base → tous les JWTs liés deviennent invalides

---

## 7. Avantages / Compromis

| Critère           | Résultat                               |
|-------------------|----------------------------------------|
| Révocation JWT    | ✅ via refresh token                  |
| Perf en lecture   | ✅ (JWT direct, DB parfois)          |
| Complexité        | ⚠️ modérée (stock, tracking refresh) |
| Sécurité          | ✅ élevée, rotation + vérif régulière |
| Stateless pur     | ❌ compromis en faveur du contrôle    |

---

## 8. Extension possible
- Support multi-session par device
- Invalidation par `user_agent`
- Ajout de `scope` ou `role` dans les claims
- Limite de durée max de session (pas juste `exp`)

---

🧠 Ce système combine **stateless** et **stateful** intelligemment pour obtenir un bon compromis entre **contrôle**, **performance** et **sécurité**.

