# Script de surveillance et push automatique
# Usage: .\watch-and-push.ps1

Write-Host "👀 Surveillance des changements du backend..." -ForegroundColor Green
Write-Host "Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Yellow

$lastHash = git rev-parse HEAD

while ($true) {
    try {
        $currentHash = git rev-parse HEAD
        $status = git status --porcelain
        
        if ($status -or $currentHash -ne $lastHash) {
            Write-Host "🔄 Changements détectés, push automatique..." -ForegroundColor Yellow
            
            # Ajouter tous les fichiers
            git add .
            
            # Commit avec timestamp
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            git commit -m "Auto-commit: $timestamp"
            
            # Pull et push
            git pull origin main --rebase
            git push origin main
            
            Write-Host "✅ Push automatique terminé!" -ForegroundColor Green
            $lastHash = git rev-parse HEAD
        }
        
        Start-Sleep -Seconds 30
    }
    catch {
        Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
        Start-Sleep -Seconds 60
    }
} 