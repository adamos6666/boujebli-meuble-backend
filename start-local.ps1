# Script pour démarrer le backend en local
Write-Host "🚀 Démarrage du backend Boujebli Meuble en local..." -ForegroundColor Green

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Vérifier si les dépendances sont installées
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
}

# Vérifier si la base de données est configurée
Write-Host "🗄️ Vérification de la base de données..." -ForegroundColor Yellow
try {
    npx prisma generate
    Write-Host "✅ Prisma configuré" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de la configuration de Prisma" -ForegroundColor Red
    exit 1
}

# Démarrer le serveur de développement
Write-Host "🌐 Démarrage du serveur sur http://localhost:3001..." -ForegroundColor Yellow
Write-Host "📚 Documentation Swagger: http://localhost:3001/api" -ForegroundColor Cyan
Write-Host "🔗 API Endpoints:" -ForegroundColor Cyan
Write-Host "   - Auth: http://localhost:3001/auth" -ForegroundColor Gray
Write-Host "   - Produits: http://localhost:3001/produit-standard" -ForegroundColor Gray
Write-Host "   - Traductions: http://localhost:3001/traduction" -ForegroundColor Gray
Write-Host "   - Utilisateurs: http://localhost:3001/user" -ForegroundColor Gray
Write-Host ""

npm run start:dev 