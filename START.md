# 🚀 Démarrage Rapide de Playvibes

## Méthode 1 : Script Automatique (Recommandé)

```bash
./start.sh
```

Le script va automatiquement :
- ✅ Vérifier et créer `.env.local` si nécessaire
- ✅ Installer les dépendances si manquantes
- ✅ Vérifier la configuration de la base de données
- ✅ Lancer le serveur de développement

## Méthode 2 : Commandes NPM

### Première installation
```bash
npm run setup
```

### Démarrage normal
```bash
npm run dev
```

### Démarrage avec Turbopack (plus rapide)
```bash
npm run dev:turbo
```

## Méthode 3 : Commandes Manuelles

### 1. Installation
```bash
npm install
```

### 2. Configuration
```bash
# Copier le fichier d'exemple
cp env.example .env.local

# Éditer avec vos credentials
nano .env.local
```

### 3. Base de données
```bash
# Pousser le schéma vers la DB
npm run db:push

# Optionnel: Ouvrir Drizzle Studio
npm run db:studio
```

### 4. Lancer l'app
```bash
npm run dev
```

## 🌐 URLs

- **Application** : http://localhost:3000
- **Drizzle Studio** : http://localhost:4983 (si lancé)

## 🛠️ Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `./start.sh` | 🚀 Démarrage automatique avec vérifications |
| `npm run setup` | 📦 Installation complète (deps + DB) |
| `npm run dev` | 🔥 Serveur de développement |
| `npm run dev:turbo` | ⚡ Dev avec Turbopack (plus rapide) |
| `npm run build` | 🏗️ Build de production |
| `npm run start` | ▶️ Serveur de production |
| `npm test` | 🧪 Lancer les tests |
| `npm run lint:fix` | 🔧 Corriger le code |
| `npm run format` | 💅 Formater le code |
| `npm run db:studio` | 🗄️ Interface DB graphique |

## ⚙️ Configuration Requise

### Variables d'Environnement (.env.local)

```env
# Database (REQUIS)
DATABASE_URL="postgresql://user:pass@host:5432/playvibes"

# Auth (REQUIS)
BETTER_AUTH_SECRET="votre-secret-aleatoire-long"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Spotify (REQUIS pour OAuth)
SPOTIFY_CLIENT_ID="votre-client-id"
SPOTIFY_CLIENT_SECRET="votre-client-secret"

# Redis (OPTIONNEL - pour rate limiting en prod)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
```

### Obtenir les Credentials Spotify

1. Aller sur https://developer.spotify.com/dashboard
2. Créer une nouvelle app
3. Ajouter redirect URI : `http://localhost:3000/api/auth/callback/spotify`
4. Copier Client ID et Client Secret dans `.env.local`

## 🐛 Dépannage

### Erreur "DATABASE_URL is not set"
→ Configurez `DATABASE_URL` dans `.env.local`

### Erreur "Port 3000 already in use"
```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 <PID>
```

### Erreur de dépendances
```bash
# Supprimer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

## 📝 Notes

- Le script `start.sh` est la méthode la plus simple
- En développement, le rate limiting utilise la mémoire (pas besoin de Redis)
- Les tests se lancent avec `npm test`
- Le pre-commit hook formate automatiquement le code
