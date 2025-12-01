# 🐛 Débogage Authentification Spotify

## Problème : "Sign in with Spotify" ne fait rien

### ✅ Checklist de Vérification

#### 1. Credentials Spotify (CRITIQUE)

**Vérifier `.env.local`** :
```bash
cat .env.local | grep SPOTIFY
```

❌ **Si vous voyez** :
```env
SPOTIFY_CLIENT_ID="a367a229736e4f2c8c9d583c578e411c"
SPOTIFY_CLIENT_SECRET="c3f287d553a74900b3cc05694d39a3d2"
```
→ Ce sont des **placeholders** ! Ils ne fonctionnent pas.

✅ **Vous devez avoir** :
```env
SPOTIFY_CLIENT_ID="votre_vrai_client_id"
SPOTIFY_CLIENT_SECRET="votre_vrai_client_secret"
```

#### 2. Obtenir les Vraies Credentials

**Étape par étape** :

1. **Aller sur** : https://developer.spotify.com/dashboard

2. **Se connecter** avec votre compte Spotify

3. **Créer une app** :
   - Cliquer "Create app"
   - App name: `Playvibes Dev`
   - App description: `Development app`
   - Redirect URI: `http://localhost:3000/api/auth/callback/spotify`
   - ⚠️ **IMPORTANT** : Bien ajouter le redirect URI exact !
   - Cocher "Web API"
   - Accepter les termes

4. **Copier les credentials** :
   - Cliquer sur "Settings"
   - Copier le **Client ID**
   - Cliquer "View client secret"
   - Copier le **Client secret**

5. **Mettre à jour `.env.local`** :
   ```bash
   nano .env.local
   ```
   
   Remplacer :
   ```env
   SPOTIFY_CLIENT_ID="votre_client_id_copié"
   SPOTIFY_CLIENT_SECRET="votre_client_secret_copié"
   ```

6. **Redémarrer le serveur** :
   ```bash
   # Ctrl+C pour arrêter
   ./start.sh
   ```

#### 3. Vérifier la Console du Navigateur

**Ouvrir la console** (F12 ou Ctrl+Shift+I) et chercher :

❌ **Erreurs possibles** :
- `Failed to fetch` → Serveur non démarré
- `401 Unauthorized` → Mauvaises credentials
- `redirect_uri_mismatch` → Redirect URI incorrect
- `CORS error` → Problème de configuration

✅ **Comportement attendu** :
- Clic sur "Sign in" → Redirection vers Spotify
- Page Spotify demande autorisation
- Redirection vers l'app → Vous êtes connecté

#### 4. Vérifier les Variables d'Environnement

**Dans le terminal** :
```bash
# Vérifier toutes les variables
cat .env.local

# Vérifier que le serveur les charge
curl http://localhost:3000/api/auth/session
```

#### 5. Vérifier le Redirect URI

**Dans Spotify Dashboard** :
- Aller dans Settings de votre app
- Vérifier que `http://localhost:3000/api/auth/callback/spotify` est bien dans la liste
- ⚠️ Pas de slash final !
- ⚠️ Bien `http://` et pas `https://` en local

#### 6. Logs du Serveur

**Dans le terminal où tourne le serveur**, chercher :
```
Error: SPOTIFY_CLIENT_ID is not set
Error: Invalid client credentials
```

---

## 🔧 Solution Rapide

```bash
# 1. Arrêter le serveur (Ctrl+C)

# 2. Éditer .env.local
nano .env.local

# 3. Remplacer les credentials Spotify par les vraies

# 4. Sauvegarder (Ctrl+X, Y, Enter)

# 5. Redémarrer
./start.sh

# 6. Tester dans le navigateur
```

---

## 🧪 Test Manuel

**Dans la console du navigateur** (F12) :
```javascript
// Tester la fonction signIn
const { signInWithSpotify } = await import('/lib/auth-client.ts');
await signInWithSpotify();
```

---

## 📝 Checklist Complète

- [ ] Credentials Spotify obtenues depuis le Dashboard
- [ ] `.env.local` mis à jour avec vraies credentials
- [ ] Redirect URI configuré : `http://localhost:3000/api/auth/callback/spotify`
- [ ] Serveur redémarré après modification `.env.local`
- [ ] Console navigateur ouverte pour voir les erreurs
- [ ] Pas d'erreurs dans les logs serveur

---

## 🆘 Toujours Bloqué ?

**Vérifier dans cet ordre** :

1. **Le serveur tourne** ?
   ```bash
   curl http://localhost:3000
   ```

2. **Les variables sont chargées** ?
   ```bash
   # Dans le code, ajouter temporairement :
   console.log('SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID?.substring(0, 5) + '...');
   ```

3. **Better Auth est configuré** ?
   ```bash
   curl http://localhost:3000/api/auth/session
   # Devrait retourner un JSON
   ```

4. **Regarder les Network requests** (F12 → Network) :
   - Clic sur "Sign in"
   - Voir quelle requête est faite
   - Vérifier le status code

---

## 💡 Astuce

**Activer le mode debug** :

Ajouter dans `.env.local` :
```env
NODE_ENV=development
DEBUG=better-auth:*
```

Redémarrer → Vous verrez tous les logs Better Auth
