# Script de push automatique pour le backend Boujebli Meuble
# Usage: .\git-push.ps1 "Message de commit"

param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage
)

Write-Host "🚀 Début du processus de push automatique..." -ForegroundColor Green

# Vérifier le statut Git
Write-Host "📊 Vérification du statut Git..." -ForegroundColor Yellow
git status

# Ajouter tous les fichiers modifiés
Write-Host "📁 Ajout des fichiers modifiés..." -ForegroundColor Yellow
git add .

# Vérifier s'il y a des changements
$status = git status --porcelain
if ([string]::IsNullOrEmpty($status)) {
    Write-Host "⚠️ Aucun changement détecté. Push annulé." -ForegroundColor Yellow
    exit 0
}

# Créer le commit
Write-Host "💾 Création du commit..." -ForegroundColor Yellow
git commit -m "$CommitMessage"

# Pull les changements distants (éviter les conflits)
Write-Host "⬇️ Récupération des changements distants..." -ForegroundColor Yellow
git pull origin main --rebase

# Push vers le repository distant
Write-Host "⬆️ Push vers GitHub..." -ForegroundColor Yellow
git push origin main

# Vérifier le statut final
Write-Host "✅ Push terminé avec succès!" -ForegroundColor Green
Write-Host "🔗 Repository: https://github.com/adamos6666/boujebli-meuble-backend" -ForegroundColor Cyan

# Afficher les derniers commits
Write-Host "📝 Derniers commits:" -ForegroundColor Yellow
git log --oneline -5 