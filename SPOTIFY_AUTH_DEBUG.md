# Configuration Spotify & Authentification - Informations de Débogage

## 📋 Informations Spotify Developer

### Credentials
- **Client ID**: `eab91e353ecc4cf99c41cc5816ea849e`
- **Client Secret**: `0075c371f8a1432780cb56752422612e`

### Redirect URIs (Spotify Dashboard)
Les URIs suivants doivent être configurés **exactement** dans le Spotify Developer Dashboard :

```
https://playvibes.vercel.app/api/auth/callback/spotify
http://localhost:3000/api/auth/callback/spotify
```

⚠️ **Important** : Pas de slash `/` à la fin des URLs !

---

## 🔧 Variables d'Environnement Vercel

### Production
```env
BETTER_AUTH_URL=https://playvibes.vercel.app
DATABASE_URL=postgresql://neondb_owner:npg_8p9CFrhqmYjg@ep-weathered-frog-a41a4w5a-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
SPOTIFY_CLIENT_ID=eab91e353ecc4cf99c41cc5816ea849e
SPOTIFY_CLIENT_SECRET=0075c371f8a1432780cb56752422612e
```

### Local (.env)
```env
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://neondb_owner:npg_8p9CFrhqmYjg@ep-weathered-frog-a41a4w5a-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
SPOTIFY_CLIENT_ID=eab91e353ecc4cf99c41cc5816ea849e
SPOTIFY_CLIENT_SECRET=0075c371f8a1432780cb56752422612e
```

---

## 🗄️ Schéma de Base de Données

### Table `users`
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  email_verified TIMESTAMP,
  name TEXT,
  image TEXT,
  spotify_id TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table `accounts`
```sql
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT
);
```

### Table `sessions`
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔍 Problèmes Rencontrés et Solutions

### 1. Session reste `null` après connexion
**Cause** : Schéma Drizzle ne correspondait pas aux attentes de `better-auth`

**Solution** :
- Mapping du schéma : `user: users`, `account: accounts`, `session: sessions`
- Ajout du champ `accountId` dans la table `accounts`
- Ajout du champ `emailVerified` dans la table `users`

### 2. Erreur `e.toISOString is not a function`
**Cause** : Drizzle retournait des strings au lieu d'objets Date

**Solution** : Utiliser `{ mode: 'date' }` pour les champs `timestamp` :
```typescript
emailVerified: timestamp('email_verified', { mode: 'date' })
```

### 3. Redirect URI invalide
**Cause** : URL de callback ne correspondait pas exactement

**Solution** : S'assurer que l'URL dans Spotify Dashboard est **exactement** :
```
https://playvibes.vercel.app/api/auth/callback/spotify
```

---

## 📝 Configuration Better-Auth (lib/auth.ts)

```typescript
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,      // ⚠️ Singulier, pas "users"
      account: accounts, // ⚠️ Singulier, pas "accounts"
      session: sessions, // ⚠️ Singulier, pas "sessions"
      verification: verification,
    },
  }),
  socialProviders: {
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      scope: [
        "user-read-email",
        "user-read-private",
        "playlist-read-private",
        "playlist-read-collaborative",
        "streaming",
        "user-read-playback-state",
        "user-modify-playback-state",
      ],
      mapProfileToUser: (profile) => ({
        spotifyId: profile.id,
      }),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // 24 heures
  },
});
```

---

## 🧪 Tests de Débogage

### 1. Vérifier les variables d'environnement
```bash
# Dans Vercel CLI
vercel env ls

# Localement
cat .env
```

### 2. Vérifier la connexion à la base de données
```bash
# Tester la connexion
DATABASE_URL="<ta_database_url>" npx drizzle-kit push
```

### 3. Vérifier les logs Vercel
1. Aller sur vercel.com → ton projet
2. Onglet "Logs" ou "Functions"
3. Activer "Realtime"
4. Se connecter avec Spotify
5. Chercher les erreurs `[Better Auth]`

### 4. Vérifier les logs console navigateur
Ouvrir la console (F12) et chercher :
```
Session state: {session: ..., isPending: ...}
Spotify profile received: {...}
```

---

## 🚀 Checklist de Vérification

- [ ] Spotify Client ID et Secret configurés dans Vercel
- [ ] Redirect URI exact dans Spotify Dashboard
- [ ] `BETTER_AUTH_URL` défini dans Vercel
- [ ] `DATABASE_URL` défini dans Vercel
- [ ] Tables `users`, `accounts`, `sessions` existent dans la DB
- [ ] Colonne `account_id` existe dans `accounts`
- [ ] Colonne `email_verified` existe dans `users`
- [ ] Schéma Drizzle utilise `{ mode: 'date' }` pour timestamps
- [ ] Mapping du schéma en singulier (`user`, `account`, `session`)

---

## 📞 Informations de Contact

- **Projet Vercel** : playvibes
- **Base de données** : Neon (PostgreSQL)
- **Framework** : Next.js 16.0.1
- **Auth Library** : better-auth
- **ORM** : Drizzle

---

## 🔗 Liens Utiles

- [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Vercel Dashboard](https://vercel.com/dashboard)
