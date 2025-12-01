# 🎯 Solutions pour l'Authentification Spotify

## Problème
Impossible de modifier les Redirect URIs dans le Spotify Dashboard (credentials de votre ami).

## ✅ Solution Recommandée : Créer Votre Propre App Spotify (5 minutes)

### Pourquoi ?
- ✅ Gratuit et rapide
- ✅ Contrôle total
- ✅ Pas de dépendance

### Étapes
1. **Allez sur** : https://developer.spotify.com/dashboard
2. **Connectez-vous** avec votre compte Spotify
3. **Cliquez** "Create app"
4. **Remplissez** :
   - App name: `PlayVibes Dev`
   - Description: `Dev app`
   - Redirect URIs: `http://localhost:3000/api/auth/callback/spotify`
   - Website: `http://localhost:3000`
   - Cochez "Web API"
5. **Save** → **Settings** → Copiez Client ID et Client Secret
6. **Mettez à jour** `.env.local` :
   ```bash
   nano .env.local
   # Remplacez SPOTIFY_CLIENT_ID et SPOTIFY_CLIENT_SECRET
   # Ctrl+X, Y, Enter
   ```
7. **Relancez** : `./start.sh`

## Alternative : Tester sur Production

L'app est déjà déployée sur **https://playvibes.vercel.app** avec :
- ✅ Credentials Spotify configurés
- ✅ Base de données Neon
- ✅ Redirect URI valide

Testez directement là-bas !

## Ngrok (Nécessite Inscription)

Si vous voulez vraiment utiliser ngrok :
1. Créez un compte gratuit : https://dashboard.ngrok.com/signup
2. Copiez votre authtoken
3. Exécutez : `./ngrok authtoken VOTRE_TOKEN`
4. Lancez : `./ngrok http 3000`
