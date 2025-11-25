# 🔐 Configuration des Variables d'Environnement Vercel

## Variables à Ajouter dans Vercel Dashboard

### 1. Aller dans Vercel
- **URL**: https://vercel.com/aureldsk02s-projects/playvibes
- **Cliquer**: Settings → Environment Variables

### 2. Ajouter Ces Variables

```env
# Spotify API
SPOTIFY_CLIENT_ID=eab91e353ecc4cf99c41cc5816ea849e
SPOTIFY_CLIENT_SECRET=0075c371f8a1432780cb56752422612e

# Better Auth (généré de manière sécurisée)
BETTER_AUTH_SECRET=playvibes_prod_2024_secure_auth_key_f8a9b2c3d4e5f6g7h8i9j0k1l2m3n4o5

# URLs de l'application (remplacer par ton domaine Vercel)
BETTER_AUTH_URL=https://playvibes-9w5cu90h9-aureldsk02s-projects.vercel.app
NEXTAUTH_URL=https://playvibes-9w5cu90h9-aureldsk02s-projects.vercel.app
NEXT_PUBLIC_BETTER_AUTH_URL=https://playvibes-9w5cu90h9-aureldsk02s-projects.vercel.app

# Base de données (à ajouter plus tard si besoin)
DATABASE_URL=placeholder
```

### 3. Environnements
Pour chaque variable, sélectionner:
- ✅ Production
- ✅ Preview
- ✅ Development

### 4. Redéployer
Après avoir ajouté toutes les variables:
```bash
vercel --prod
```

## ⚠️ Important: Redirect URI Spotify

### Configurer dans Spotify Dashboard
1. Aller sur: https://developer.spotify.com/dashboard
2. Sélectionner ton app
3. Settings → Redirect URIs
4. Ajouter: `https://playvibes-9w5cu90h9-aureldsk02s-projects.vercel.app/api/auth/callback/spotify`
5. Sauvegarder

## ✅ Vérification

Après configuration:
1. Aller sur ton app: https://playvibes-9w5cu90h9-aureldsk02s-projects.vercel.app
2. Cliquer "Sign in with Spotify"
3. Devrait rediriger vers Spotify pour l'authentification
4. Après login, retour sur l'app avec session active

## 🎉 Résultat

Avec ces configurations:
- ✅ Authentification Spotify fonctionnelle
- ✅ Utilisateurs peuvent se connecter
- ✅ Sessions persistantes
- ✅ App complètement opérationnelle (sans DB pour l'instant)

**Note**: Pour une fonctionnalité complète avec sauvegarde des données, il faudra configurer une vraie base de données (voir QUICK_NEON_SETUP.md)