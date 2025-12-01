# 🚀 Guide de Test - Authentification Spotify

## ✅ Configuration Terminée

Toutes les configurations nécessaires ont été appliquées :

- ✅ **Spotify Credentials** : Client ID et Secret configurés (depuis `SPOTIFY_AUTH_DEBUG.md`)
- ✅ **Base de données locale** : Docker PostgreSQL en cours d'exécution
- ✅ **Schéma DB** : Tables `users`, `accounts`, `sessions` créées
- ✅ **Better Auth** : Configuré avec `trustedOrigins` pour ports 3000-3002

## 🧪 Test de l'Authentification

### 1. Lancer l'application
```bash
./start.sh
```

### 2. Ouvrir dans le navigateur
```
http://localhost:3000  (ou 3001 si 3000 est occupé)
```

### 3. Tester la connexion Spotify
1. Cliquer sur **"Sign in with Spotify"**
2. Vous serez redirigé vers Spotify pour autoriser l'application
3. Après autorisation, vous devriez être redirigé vers l'app **connecté**

### 4. Vérifier la session
Ouvrir la console du navigateur (F12) et vérifier :
```javascript
// La session devrait contenir vos informations utilisateur
{
  user: {
    id: "...",
    email: "...",
    name: "...",
    spotifyId: "..."
  }
}
```

## 🔍 Débogage

### Console Navigateur
Chercher les messages :
- `✅ Spotify profile received: {...}`
- `✅ Session state: {session: ..., isPending: false}`

### Logs Serveur
Chercher les messages Better Auth :
- `[Better Auth]: User authenticated`
- `[Better Auth]: Session created`

### En cas d'erreur

**Erreur "Invalid origin"** :
- ✅ Déjà corrigé avec `trustedOrigins` dans `lib/auth/index.ts`

**Erreur "INVALID_CLIENT"** :
- ✅ Credentials Spotify réels configurés

**Redirect URI invalide** :
- Vérifier que `http://localhost:3000/api/auth/callback/spotify` est dans le Spotify Dashboard
- (Normalement déjà configuré selon `SPOTIFY_AUTH_DEBUG.md`)

## 📊 Résultat Attendu

Après connexion réussie :
1. Vous êtes redirigé vers la page d'accueil
2. Le bouton "Sign in" disparaît
3. Votre nom/photo Spotify apparaît dans la navigation
4. Vous pouvez accéder aux playlists

## 🎯 Prochaines Étapes

Une fois l'authentification validée :
1. Tester la synchronisation des playlists Spotify
2. Tester le partage de playlists
3. Tester les commentaires et likes
4. Déployer sur Vercel (credentials déjà configurés selon `SPOTIFY_AUTH_DEBUG.md`)
