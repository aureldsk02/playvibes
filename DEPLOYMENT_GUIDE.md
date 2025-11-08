# 🚀 Guide de Déploiement PlayVibes

## Options d'Hébergement Rapide

### Option 1: Vercel + Neon (Recommandé - 5 minutes)

#### 1. Base de Données Cloud (Neon)
1. Va sur [neon.tech](https://neon.tech)
2. Créer un compte gratuit
3. Créer un nouveau projet "PlayVibes"
4. Copier la connection string

#### 2. Déploiement Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Suivre les prompts:
# - Set up and deploy? Y
# - Which scope? (ton compte)
# - Link to existing project? N
# - Project name? playvibes
# - Directory? ./
# - Override settings? N
```

#### 3. Variables d'Environnement
Dans le dashboard Vercel:
1. Aller dans Settings > Environment Variables
2. Ajouter:
```
DATABASE_URL=postgresql://[neon_connection_string]
BETTER_AUTH_SECRET=your_long_secure_secret_key_here_production
BETTER_AUTH_URL=https://your-app.vercel.app
NEXTAUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-app.vercel.app
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

#### 4. Appliquer le Schéma
```bash
# Localement avec la DB de production
export DATABASE_URL="[neon_connection_string]"
npm run db:push
```

### Option 2: Railway (Alternative)

#### 1. Déploiement Railway
1. Va sur [railway.app](https://railway.app)
2. Connecte ton GitHub
3. "New Project" > "Deploy from GitHub repo"
4. Sélectionner ton repo PlayVibes

#### 2. Ajouter PostgreSQL
1. Dans le projet Railway
2. "New" > "Database" > "PostgreSQL"
3. Copier la connection string

#### 3. Variables d'Environnement
Dans Railway Settings > Variables:
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
BETTER_AUTH_SECRET=your_long_secure_secret_key_here_production
BETTER_AUTH_URL=${{RAILWAY_STATIC_URL}}
NEXTAUTH_URL=${{RAILWAY_STATIC_URL}}
NEXT_PUBLIC_BETTER_AUTH_URL=${{RAILWAY_STATIC_URL}}
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### Option 3: Netlify + Supabase

#### 1. Base de Données (Supabase)
1. Va sur [supabase.com](https://supabase.com)
2. Nouveau projet "PlayVibes"
3. Copier la connection string PostgreSQL

#### 2. Déploiement Netlify
1. Va sur [netlify.com](https://netlify.com)
2. "New site from Git"
3. Connecter GitHub et sélectionner le repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

## Configuration Spotify pour Production

### 1. Mettre à Jour l'App Spotify
1. Aller sur [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Sélectionner ton app
3. Settings > Redirect URIs
4. Ajouter: `https://ton-domaine.vercel.app/api/auth/callback/spotify`

### 2. Demander l'Extension de Quota (Optionnel)
Pour plus de 25 utilisateurs:
1. Dans ton app Spotify > "Quota Extension"
2. Remplir le formulaire de demande
3. Expliquer que c'est pour une plateforme de partage de playlists

## Checklist de Déploiement

### Avant le Déploiement
- [ ] Code committé et pushé sur GitHub
- [ ] Base de données cloud configurée
- [ ] Variables d'environnement préparées
- [ ] App Spotify créée avec bonnes redirect URIs

### Après le Déploiement
- [ ] Schéma de base de données appliqué (`npm run db:push`)
- [ ] Variables d'environnement configurées
- [ ] Test de l'authentification Spotify
- [ ] Vérification que l'app fonctionne

## URLs de Test

Après déploiement, tester:
- [ ] Page d'accueil charge
- [ ] Bouton "Sign in with Spotify" fonctionne
- [ ] Redirection après login fonctionne
- [ ] Interface utilisateur responsive

## Commandes Rapides

```bash
# Déploiement Vercel
vercel --prod

# Appliquer schéma à la DB de production
DATABASE_URL="[production_url]" npm run db:push

# Vérifier les logs
vercel logs
```

## 🎯 Résultat Final

Après ces étapes, tu auras:
- ✅ App hébergée avec URL publique
- ✅ Base de données PostgreSQL cloud
- ✅ Authentification Spotify fonctionnelle
- ✅ Interface responsive et moderne
- ✅ Prêt à partager avec tes utilisateurs !

Temps estimé: **5-10 minutes** avec Vercel + Neon