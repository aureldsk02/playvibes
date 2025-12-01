# 🔧 Fix Spotify Redirect URI - Port 3001

## Problème
Erreur : `INVALID_CLIENT: Invalid redirect URI`

**Cause** : Le serveur tourne sur le port **3001** (car 3000 est occupé), mais Spotify Dashboard n'a que `http://localhost:3000/api/auth/callback/spotify` configuré.

## Solution Rapide

### Option 1 : Ajouter le port 3001 au Spotify Dashboard (Recommandé)

1. Aller sur [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Sélectionner votre app **PlayVibes**
3. Cliquer sur **"Edit Settings"**
4. Dans **"Redirect URIs"**, ajouter :
   ```
   http://localhost:3001/api/auth/callback/spotify
   ```
5. Cliquer sur **"Add"** puis **"Save"**

### Option 2 : Libérer le port 3000

```bash
# Trouver le processus sur le port 3000
lsof -ti:3000

# Le tuer
kill -9 $(lsof -ti:3000)

# Relancer l'app (elle utilisera 3000)
./start.sh
```

### Option 3 : Forcer le port 3000 dans package.json

Modifier `package.json` :
```json
"scripts": {
  "dev": "next dev -p 3000"
}
```

Puis relancer.

## Vérification

Une fois l'URI ajoutée, réessayer de se connecter. Vous devriez être redirigé vers Spotify puis revenir connecté.

## URIs Complètes à Avoir

Dans votre Spotify Dashboard, vous devriez avoir :
```
https://playvibes.vercel.app/api/auth/callback/spotify
http://localhost:3000/api/auth/callback/spotify
http://localhost:3001/api/auth/callback/spotify
http://localhost:3002/api/auth/callback/spotify  (optionnel)
```
