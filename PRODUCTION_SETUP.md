# Configuration de Production - PlayVibes

## ✅ Déploiement Vercel Complété

**URL de Production:** https://playvibes-isbsq584q-aureldsk02s-projects.vercel.app

## 📋 Étapes Restantes

### 1. Créer la Base de Données Neon

1. Allez sur **https://neon.tech**
2. Cliquez sur "Sign Up" (vous pouvez utiliser GitHub)
3. Créez un nouveau projet:
   - Nom: `playvibes`
   - Région: Choisissez la plus proche (Europe West recommandé)
4. Une fois créé, copiez la **Connection String** qui ressemble à:
   ```
   postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/neondb
   ```

### 2. Configurer les Variables d'Environnement Vercel

1. Allez sur: **https://vercel.com/aureldsk02s-projects/playvibes/settings/environment-variables**
2. Ajoutez ces 5 variables (une par une):

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | `postgresql://[votre_connection_string_neon]` |
| `SPOTIFY_CLIENT_ID` | `eab91e353ecc4cf99c41cc5816ea849e` |
| `SPOTIFY_CLIENT_SECRET` | `0075c371f8a1432780cb56752422612e` |
| `BETTER_AUTH_SECRET` | `1GzIW0Pj33c8twIyA1i6a4GvDic1S6meGccfNwuO8vo=` |
| `BETTER_AUTH_URL` | `https://playvibes-isbsq584q-aureldsk02s-projects.vercel.app` |

3. Pour chaque variable, sélectionnez **Production, Preview, Development**
4. Cliquez sur "Save"

### 3. Appliquer le Schéma à la Base de Données

Une fois la base de données créée, exécutez:

```bash
DATABASE_URL='postgresql://[votre_connection_string_neon]' pnpm db:push
```

### 4. Mettre à Jour Spotify Redirect URI

1. Allez sur: **https://developer.spotify.com/dashboard**
2. Sélectionnez votre app
3. Cliquez sur "Edit Settings"
4. Dans "Redirect URIs", ajoutez:
   ```
   https://playvibes-isbsq584q-aureldsk02s-projects.vercel.app/api/auth/callback/spotify
   ```
5. Cliquez sur "Add" puis "Save"

### 5. Redéployer

Après avoir configuré les variables:

```bash
vercel --prod
```

## ✅ Vérification Finale

1. Visitez: https://playvibes-isbsq584q-aureldsk02s-projects.vercel.app
2. Cliquez sur "Sign in with Spotify"
3. Autorisez l'application
4. Vous devriez être connecté !

---

**Note:** Gardez votre Connection String Neon en sécurité - ne la partagez jamais publiquement.
