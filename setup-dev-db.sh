#!/bin/bash

echo "🚀 Setting up development database..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop and remove existing container if it exists
docker stop playvibes-postgres 2>/dev/null || true
docker rm playvibes-postgres 2>/dev/null || true

echo "📦 Starting PostgreSQL container..."

# Start PostgreSQL container
docker run --name playvibes-postgres \
  -e POSTGRES_DB=playvibes \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

echo "⏳ Waiting for PostgreSQL to start..."
sleep 10

echo "📋 Applying database schema..."

# Try to push the schema
npm run db:push

if [ $? -eq 0 ]; then
    echo "✅ Database setup complete!"
    echo "🎉 You can now run: npm run dev"
else
    echo "❌ Schema push failed. Check the logs above."
    echo "💡 Try running 'npm run db:push' manually in a few seconds."
fi