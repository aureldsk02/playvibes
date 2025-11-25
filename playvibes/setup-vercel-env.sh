#!/bin/bash

echo "🔐 Configuration des Variables d'Environnement Vercel"
echo "===================================================="
echo ""

# Vérifier si vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI n'est pas installé"
    echo "📦 Installation: npm i -g vercel"
    exit 1
fi

echo "📝 Configuration des variables d'environnement..."
echo ""

# Spotify
vercel env add SPOTIFY_CLIENT_ID production <<< "eab91e353ecc4cf99c41cc5816ea849e"
vercel env add SPOTIFY_CLIENT_SECRET production <<< "0075c371f8a1432780cb56752422612e"

# Better Auth
vercel env add BETTER_AUTH_SECRET production <<< "playvibes_prod_2024_secure_auth_key_f8a9b2c3d4e5f6g7h8i9j0k1l2m3n4o5"

# URLs
vercel env add BETTER_AUTH_URL production <<< "https://playvibes-9w5cu90h9-aureldsk02s-projects.vercel.app"
vercel env add NEXTAUTH_URL production <<< "https://playvibes-9w5cu90h9-aureldsk02s-projects.vercel.app"
vercel env add NEXT_PUBLIC_BETTER_AUTH_URL production <<< "https://playvibes-9w5cu90h9-aureldsk02s-projects.vercel.app"

# Database (placeholder)
vercel env add DATABASE_URL production <<< "placeholder"

echo ""
echo "✅ Variables d'environnement configurées !"
echo ""
echo "🔄 Redéploiement..."
vercel --prod

echo ""
echo "⚠️  N'oublie pas de configurer le Redirect URI dans Spotify:"
echo "   https://developer.spotify.com/dashboard"
echo "   Ajouter: https://playvibes-9w5cu90h9-aureldsk02s-projects.vercel.app/api/auth/callback/spotify"
echo ""
echo "🎉 Configuration terminée !"