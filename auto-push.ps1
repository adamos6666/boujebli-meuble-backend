# Script de push automatique pour le backend Boujebli Meuble
param(
    [switch]$Watch = $false,
    [string]$CommitMessage = "Auto-commit: Mise à jour du backend"
)

$REPO_URL = "https://github.com/adamos6666/boujebli-meuble-backend.git"
$BRANCH = "main"

function Write-Status {
    param([string]$Message, [string]$Color = "White")
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

function Test-GitStatus {
    $status = git status --porcelain
    return ![string]::IsNullOrEmpty($status)
}

function Push-Changes {
    param([string]$Message)
    
    Write-Status "🚀 Début du processus de push..." "Green"
    
    if (-not (Test-GitStatus)) {
        Write-Status "⚠️ Aucun changement détecté." "Yellow"
        return $false
    }
    
    try {
        Write-Status "📁 Ajout des fichiers modifiés..." "Yellow"
        git add .
        
        Write-Status "💾 Création du commit..." "Yellow"
        git commit -m $Message
        
        Write-Status "⬇️ Récupération des changements distants..." "Yellow"
        git pull origin $BRANCH --rebase
        
        Write-Status "⬆️ Push vers GitHub..." "Yellow"
        git push origin $BRANCH
        
        Write-Status "✅ Push terminé avec succès!" "Green"
        Write-Status "🔗 Repository: $REPO_URL" "Cyan"
        
        Write-Status "📝 Derniers commits:" "Yellow"
        git log --oneline -3
        
        return $true
    }
    catch {
        Write-Status "❌ Erreur lors du push: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Watch-Changes {
    Write-Status "👀 Surveillance des changements activée..." "Green"
    Write-Status "Appuyez sur Ctrl+C pour arrêter" "Yellow"
    
    $lastHash = git rev-parse HEAD
    
    while ($true) {
        try {
            $currentHash = git rev-parse HEAD
            $hasChanges = Test-GitStatus
            
            if ($hasChanges -or $currentHash -ne $lastHash) {
                Write-Status "🔄 Changements détectés, push automatique..." "Yellow"
                $success = Push-Changes "Auto-commit: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
                
                if ($success) {
                    $lastHash = git rev-parse HEAD
                }
            }
            
            Start-Sleep -Seconds 30
        }
        catch {
            Write-Status "❌ Erreur de surveillance: $($_.Exception.Message)" "Red"
            Start-Sleep -Seconds 60
        }
    }
}

Write-Host "🔧 Script de Push Automatique - Backend Boujebli Meuble" -ForegroundColor Cyan
Write-Host "Repository: $REPO_URL" -ForegroundColor Gray
Write-Host ""

if ($Watch) {
    Watch-Changes
} else {
    Push-Changes $CommitMessage
} 