# Deployment Guide - Vercel

This guide provides step-by-step instructions for deploying PlayVibes to Vercel.

## Prerequisites

- Vercel account with access to the project
- Neon PostgreSQL database (already configured)
- Spotify Developer App credentials

## Deployment Steps

### 1. Verify Spotify Developer Dashboard

Ensure the following Redirect URIs are configured in your Spotify App settings:

```
https://playvibes.vercel.app/api/auth/callback/spotify
http://localhost:3000/api/auth/callback/spotify
http://localhost:3001/api/auth/callback/spotify
```

**Location**: https://developer.spotify.com/dashboard → Your App → Edit Settings → Redirect URIs

### 2. Configure Vercel Environment Variables

In your Vercel project settings, add the following environment variables:

#### Production Environment

```bash
# Database
DATABASE_URL=postgresql://neondb_owner:npg_8p9CFrhqmYjg@ep-weathered-frog-a41a4w5a-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Authentication
BETTER_AUTH_URL=https://playvibes.vercel.app
BETTER_AUTH_SECRET=<generate-random-secret>

# Spotify
SPOTIFY_CLIENT_ID=eab91e353ecc4cf99c41cc5816ea849e
SPOTIFY_CLIENT_SECRET=0075c371f8a1432780cb56752422612e

# Optional: Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=<your-upstash-url>
UPSTASH_REDIS_REST_TOKEN=<your-upstash-token>
```

**Generate BETTER_AUTH_SECRET**:
```bash
openssl rand -base64 32
```

**Location**: Vercel Dashboard → Your Project → Settings → Environment Variables

### 3. Database Schema

The database schema should already be set up in Neon. If you need to push schema changes:

```bash
# Locally, with production DATABASE_URL
export DATABASE_URL="<production-database-url>"
npm run db:push
```

### 4. Deploy

#### Option A: Automatic Deployment (Recommended)

Push to the `main` branch on GitHub. Vercel will automatically deploy.

```bash
git push origin main
```

#### Option B: Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 5. Verify Deployment

1. **Visit**: https://playvibes.vercel.app
2. **Test Spotify Login**: Click "Sign in with Spotify"
3. **Check Logs**: Vercel Dashboard → Deployments → Latest → Functions

Expected behavior:
- Redirect to Spotify authorization
- Return to app after authorization
- User session created successfully

## Troubleshooting

### "Invalid redirect URI" Error

**Cause**: Redirect URI mismatch between app and Spotify Dashboard

**Solution**: 
1. Check exact URL in error message
2. Add it to Spotify Dashboard Redirect URIs
3. Ensure no trailing slashes

### "INVALID_CLIENT" Error

**Cause**: Incorrect Spotify credentials

**Solution**:
1. Verify `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in Vercel
2. Check they match Spotify Dashboard values
3. Redeploy after updating

### Database Connection Errors

**Cause**: Incorrect `DATABASE_URL` or network issues

**Solution**:
1. Verify `DATABASE_URL` in Vercel environment variables
2. Check Neon database is active
3. Ensure connection string includes `sslmode=require`

### Session Not Persisting

**Cause**: Missing or incorrect `BETTER_AUTH_SECRET`

**Solution**:
1. Generate new secret: `openssl rand -base64 32`
2. Set in Vercel environment variables
3. Redeploy

## Monitoring

### Vercel Logs

**Access**: Vercel Dashboard → Your Project → Deployments → Functions

**Look for**:
- `[Better Auth]` messages for authentication flow
- API route errors
- Database connection issues

### Database Monitoring

**Access**: Neon Dashboard → Your Database → Monitoring

**Check**:
- Connection count
- Query performance
- Storage usage

## Performance Optimization

### Caching

The app uses SWR for client-side caching. No additional configuration needed.

### Rate Limiting

For production rate limiting with Redis:

1. Create Upstash Redis database
2. Add environment variables to Vercel:
   ```
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=...
   ```
3. Redeploy

Without Redis, the app falls back to in-memory rate limiting (per-instance).

## Rollback

If deployment fails or has issues:

1. **Vercel Dashboard** → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

## Environment-Specific Notes

### Production
- Uses Neon PostgreSQL (pooled connection)
- Requires HTTPS for Spotify OAuth
- Rate limiting recommended (Upstash Redis)

### Preview Deployments
- Automatically created for pull requests
- Use same environment variables as production
- Useful for testing before merging

## Security Checklist

- [ ] `BETTER_AUTH_SECRET` is random and secure
- [ ] Spotify credentials are correct
- [ ] Database URL uses SSL (`sslmode=require`)
- [ ] Redirect URIs match exactly in Spotify Dashboard
- [ ] Environment variables are set in Vercel (not committed to git)

## Support

For deployment issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test locally with production environment variables
4. Contact team if issues persist

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
