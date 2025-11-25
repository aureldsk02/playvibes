# ⚡ Configuration Spotify Express (2 minutes)

## 🎯 Objectif
Activer l'authentification Spotify sur l'app déployée.

## 📋 Étape 1: Configurer Spotify Dashboard (1 minute)

### 1. Aller sur Spotify Developer
**URL**: https://developer.spotify.com/dashboard

### 2. Sélectionner ton App
Cliquer sur l'app que tu as créée

### 3. Ajouter Redirect URI
- **Cliquer**: Settings
- **Scroll**: Redirect URIs
- **Ajouter**: `https://playvibes-9w5cu90h9-aureldsk02s-projects.vercel.app/api/auth/callback/spotify`
- **Cliquer**: Save

## 🔐 Étape 2: Configurer Vercel (1 minute)

### 1. Aller dans Vercel Dashboard
**URL**: https://vercel.com/aureldsk02s-projects/playvibes

### 2. Ajouter Variables d'Environnement
**Settings** → **Environment Variables** → **Add New**

Ajouter ces 7 variables (une par une):

```
Name: SPOTIFY_CLIENT_ID
Value: eab91e353ecc4cf99c41cc5816ea849e
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: SPOTIFY_CLIENT_SECRET
Value: 0075c371f8a1432780cb56752422612e
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: BETTER_AUTH_SECRET
Value: playvibes_prod_2024_secure_auth_key_f8a9b2c3d4e5f6g7h8i9j0k1l2m3n4o5
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: BETTER_AUTH_URL
Value: https://playvibes-9w5cu90h9-aureldsk02s-projects.vercel.app
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: NEXTAUTH_URL
Value: https://playvibes-9w5cu90h9-aureldsk02s-projects.vercel.app
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: NEXT_PUBLIC_BETTER_AUTH_URL
Value: https://playvibes-9w5cu90h9-aureldsk02s-projects.vercel.app
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: DATABASE_URL
Value: placeholder
Environments: ✅ Production ✅ Preview ✅ Development
```

### 3. Redéployer
Dans le terminal:
```bash
vercel --prod
```

Ou dans Vercel Dashboard:
**Deployments** → **...** (menu) → **Redeploy**

## ✅ Test

Après redéploiement (2-3 minutes):

1. **Aller sur**: https://playvibes-9w5cu90h9-aureldsk02s-projects.vercel.app
2. **Cliquer**: "Sign in with Spotify"
3. **Autoriser** l'app Spotify
4. **Retour** sur l'app avec profil connecté

## 🎉 Résultat

- ✅ **Authentification Spotify** fonctionnelle
- ✅ **Utilisateurs** peuvent se connecter
- ✅ **Profil** affiché après login
- ✅ **App** complètement opérationnelle

## 📝 Note

Pour sauvegarder les données (playlists, likes, etc.), il faudra configurer une vraie base de données. Voir `QUICK_NEON_SETUP.md` pour cela.

**Temps total: ~2 minutes** ⏱️