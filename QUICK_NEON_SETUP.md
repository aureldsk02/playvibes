# ⚡ Configuration Neon Express

## 🎯 Créer la Base de Données (2 minutes)

### 1. Aller sur Neon
- **URL**: https://neon.tech
- **Cliquer**: "Sign up" (gratuit)
- **Se connecter** avec GitHub (plus rapide)

### 2. Créer le Projet
- **Cliquer**: "Create a project"
- **Nom**: `playvibes`
- **Région**: Choisir la plus proche (Europe West par exemple)
- **PostgreSQL Version**: Laisser par défaut
- **Cliquer**: "Create project"

### 3. Copier la Connection String
Après création, tu verras une page avec:
```
Database URL: postgresql://username:password@host/database
```

**Copier cette URL complète** (commence par `postgresql://`)

### 4. Ajouter à Vercel
1. **Aller dans le dashboard Vercel**: https://vercel.com/dashboard
2. **Cliquer sur ton projet** "playvibes"
3. **Settings** → **Environment Variables**
4. **Ajouter ces variables**:

```
DATABASE_URL = [coller_ta_connection_string_neon]
BETTER_AUTH_SECRET = playvibes_production_secret_2024_secure_key
BETTER_AUTH_URL = https://[ton-domaine].vercel.app
NEXTAUTH_URL = https://[ton-domaine].vercel.app  
NEXT_PUBLIC_BETTER_AUTH_URL = https://[ton-domaine].vercel.app
SPOTIFY_CLIENT_ID = temp_client_id
SPOTIFY_CLIENT_SECRET = temp_client_secret
```

**Remplacer `[ton-domaine]` par ton vrai domaine Vercel**

### 5. Redéployer
```bash
vercel --prod
```

### 6. Appliquer le Schéma
```bash
# Utiliser ta connection string Neon
DATABASE_URL="[ta_connection_string_neon]" npm run db:push
```

## ✅ Résultat
- **Base de données cloud** opérationnelle
- **App déployée** avec URL publique
- **Prêt à partager** !

## 🔗 Liens Utiles
- **Neon Dashboard**: https://console.neon.tech
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Ton App**: https://[ton-domaine].vercel.app

**Temps total: ~3 minutes** ⏱️