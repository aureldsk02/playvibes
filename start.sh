#!/bin/bash

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🚀 Démarrage de Playvibes..."
echo ""

# Vérifier si .env.local existe
if [ ! -f .env.local ]; then
  echo -e "${YELLOW}⚠️  Fichier .env.local non trouvé${NC}"
  echo "📝 Création depuis .env.example..."
  cp .env.example .env.local
  echo -e "${GREEN}✅ .env.local créé - N'oubliez pas de configurer vos credentials !${NC}"
  echo ""
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
  echo "📦 Installation des dépendances..."
  npm install
  echo ""
fi

# Vérifier la base de données
echo "🔍 Vérification de la base de données..."
if grep -q "DATABASE_URL" .env.local; then
  echo -e "${GREEN}✅ DATABASE_URL configurée${NC}"
else
  echo -e "${RED}❌ DATABASE_URL manquante dans .env.local${NC}"
  exit 1
fi
echo ""

# Tuer tout processus sur le port 3000
echo "🧹 Nettoyage du port 3000..."
PORT_PID=$(lsof -ti:3000)
if [ ! -z "$PORT_PID" ]; then
  echo "   Arrêt du processus $PORT_PID..."
  kill -9 $PORT_PID 2>/dev/null
  sleep 1
  echo -e "${GREEN}✅ Port 3000 libéré${NC}"
else
  echo -e "${GREEN}✅ Port 3000 déjà libre${NC}"
fi
echo ""

# Lancer le serveur
echo "🎵 Lancement du serveur Playvibes..."
echo "📍 URL: http://localhost:3000"
echo "💡 Ctrl+C pour arrêter"
echo ""

npm run dev
