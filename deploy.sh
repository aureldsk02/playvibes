#!/bin/bash

echo "🚀 Déploiement PlayVibes - Guide Rapide"
echo "========================================"

# Vérifier si on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Exécuter ce script depuis le répertoire playvibes"
    exit 1
fi

echo ""
echo "📋 Checklist de déploiement:"
echo ""

# Vérifier les fichiers essentiels
echo "✅ Vérification des fichiers..."
if [ -f ".env.example" ]; then
    echo "  ✓ .env.example trouvé"
else
    echo "  ❌ .env.example manquant"
fi

if [ -f "vercel.json" ]; then
    echo "  ✓ vercel.json trouvé"
else
    echo "  ❌ vercel.json manquant"
fi

echo ""
echo "🎯 Prochaines étapes:"
echo ""
echo "1. 📊 Base de données cloud (choisir une option):"
echo "   • Neon: https://neon.tech (recommandé)"
echo "   • Supabase: https://supabase.com"
echo "   • Railway: https://railway.app"
echo ""
echo "2. 🎵 Configuration Spotify:"
echo "   • Aller sur: https://developer.spotify.com/dashboard"
echo "   • Créer une nouvelle app"
echo "   • Ajouter redirect URI: https://ton-domaine.vercel.app/api/auth/callback/spotify"
echo ""
echo "3. 🚀 Déploiement Vercel:"
echo "   npm i -g vercel"
echo "   vercel"
echo ""
echo "4. ⚙️ Variables d'environnement (dans Vercel dashboard):"
echo "   DATABASE_URL=postgresql://[connection_string]"
echo "   SPOTIFY_CLIENT_ID=your_client_id"
echo "   SPOTIFY_CLIENT_SECRET=your_client_secret"
echo "   BETTER_AUTH_SECRET=your_long_secure_secret"
echo "   BETTER_AUTH_URL=https://ton-domaine.vercel.app"
echo "   NEXTAUTH_URL=https://ton-domaine.vercel.app"
echo "   NEXT_PUBLIC_BETTER_AUTH_URL=https://ton-domaine.vercel.app"
echo ""
echo "5. 📋 Appliquer le schéma de base de données:"
echo "   DATABASE_URL='[production_url]' npm run db:push"
echo ""
echo "📖 Guide complet: Voir DEPLOYMENT_GUIDE.md"
echo ""
echo "🎉 Temps estimé: 5-10 minutes avec Vercel + Neon"