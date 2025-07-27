# Script simple pour démarrer le backend
Write-Host "🚀 Démarrage du backend Boujebli Meuble..." -ForegroundColor Green

# Vérifier si le port 3001 est libre
$portInUse = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️ Le port 3001 est déjà utilisé. Arrêt du processus..." -ForegroundColor Yellow
    Stop-Process -Id $portInUse.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Installer les dépendances si nécessaire
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
}

# Générer Prisma
Write-Host "🗄️ Génération du client Prisma..." -ForegroundColor Yellow
npx prisma generate

# Démarrer le serveur
Write-Host "🌐 Démarrage du serveur sur http://localhost:3001..." -ForegroundColor Green
Write-Host "📚 Documentation Swagger: http://localhost:3001/api" -ForegroundColor Cyan
Write-Host "🔗 API Endpoints:" -ForegroundColor Cyan
Write-Host "   - Auth: http://localhost:3001/auth" -ForegroundColor Gray
Write-Host "   - Produits: http://localhost:3001/produit-standard" -ForegroundColor Gray
Write-Host "   - Traductions: http://localhost:3001/traduction" -ForegroundColor Gray
Write-Host "   - Utilisateurs: http://localhost:3001/user" -ForegroundColor Gray
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Yellow
Write-Host ""

npm run start:dev 