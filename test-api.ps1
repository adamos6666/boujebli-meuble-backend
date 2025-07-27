# Script de test complet pour les API Boujebli Meuble
# Usage: .\test-api.ps1

$BASE_URL = "https://boujebli-meuble-backend.onrender.com"

function Write-TestResult {
    param([string]$Test, [string]$Status, [string]$Message = "", [string]$Color = "White")
    $icon = if ($Status -eq "PASS") { "✅" } elseif ($Status -eq "FAIL") { "❌" } else { "⚠️" }
    Write-Host "$icon $Test - $Status" -ForegroundColor $Color
    if ($Message) {
        Write-Host "   $Message" -ForegroundColor Gray
    }
}

function Test-Endpoint {
    param([string]$Method, [string]$Endpoint, [string]$Body = "", [string]$Description)
    
    try {
        $uri = "$BASE_URL$Endpoint"
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $uri -Method GET -Headers $headers
        } elseif ($Method -eq "POST") {
            $response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $Body
        }
        
        Write-TestResult $Description "PASS" "Response: $($response | ConvertTo-Json -Depth 1)"
        return $true
    }
    catch {
        $errorMsg = $_.Exception.Message
        Write-TestResult $Description "FAIL" "Error: $errorMsg" "Red"
        return $false
    }
}

function Test-Authentication {
    Write-Host "`n🔐 Test d'Authentification" -ForegroundColor Cyan
    
    # Test d'inscription
    $registerBody = '{"name":"Test User","email":"test@boujebli.com","password":"test123"}'
    Test-Endpoint "POST" "/auth/register" $registerBody "Inscription utilisateur"
    
    # Test de connexion
    $loginBody = '{"email":"test@boujebli.com","password":"test123"}'
    Test-Endpoint "POST" "/auth/login" $loginBody "Connexion utilisateur"
    
    # Test avec mauvais mot de passe
    $wrongLoginBody = '{"email":"test@boujebli.com","password":"wrongpassword"}'
    Test-Endpoint "POST" "/auth/login" $wrongLoginBody "Connexion avec mauvais mot de passe"
}

function Test-Produits {
    Write-Host "`n📦 Test des Produits" -ForegroundColor Cyan
    
    # Test récupération tous les produits
    Test-Endpoint "GET" "/produit-standard" "" "Récupération tous les produits"
    
    # Test récupération produit par ID
    Test-Endpoint "GET" "/produit-standard/1" "" "Récupération produit ID 1"
    
    # Test récupération produit inexistant
    Test-Endpoint "GET" "/produit-standard/999" "" "Récupération produit inexistant"
    
    # Test filtrage par langue
    Test-Endpoint "GET" "/produit-standard?langue=fr" "" "Filtrage par langue FR"
    Test-Endpoint "GET" "/produit-standard?langue=en" "" "Filtrage par langue EN"
    Test-Endpoint "GET" "/produit-standard?langue=ar" "" "Filtrage par langue AR"
}

function Test-Traductions {
    Write-Host "`n🌐 Test des Traductions" -ForegroundColor Cyan
    
    # Test récupération toutes les traductions
    Test-Endpoint "GET" "/traduction" "" "Récupération toutes les traductions"
    
    # Test filtrage par langue
    Test-Endpoint "GET" "/traduction?langue=fr" "" "Traductions FR"
    Test-Endpoint "GET" "/traduction?langue=en" "" "Traductions EN"
    Test-Endpoint "GET" "/traduction?langue=ar" "" "Traductions AR"
}

function Test-Demandes {
    Write-Host "`n📋 Test des Demandes sur Mesure" -ForegroundColor Cyan
    
    # Test récupération toutes les demandes
    Test-Endpoint "GET" "/demande-sur-mesure" "" "Récupération toutes les demandes"
    
    # Test récupération demande par ID
    Test-Endpoint "GET" "/demande-sur-mesure/1" "" "Récupération demande ID 1"
}

function Test-Health {
    Write-Host "`n🏥 Test de Santé" -ForegroundColor Cyan
    
    # Test endpoint de santé
    Test-Endpoint "GET" "/" "" "Endpoint racine"
    
    # Test documentation Swagger
    Test-Endpoint "GET" "/api" "" "Documentation Swagger"
}

function Test-Performance {
    Write-Host "`n⚡ Test de Performance" -ForegroundColor Cyan
    
    $startTime = Get-Date
    $response = Invoke-RestMethod -Uri "$BASE_URL/produit-standard" -Method GET
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalMilliseconds
    
    Write-TestResult "Temps de réponse produits" "PASS" "Durée: ${duration}ms"
    
    if ($duration -gt 2000) {
        Write-TestResult "Performance" "WARN" "Réponse lente (>2s)" "Yellow"
    } else {
        Write-TestResult "Performance" "PASS" "Réponse rapide (<2s)"
    }
}

function Test-CORS {
    Write-Host "`n🌍 Test CORS" -ForegroundColor Cyan
    
    try {
        $headers = @{
            "Origin" = "https://boujebli-meuble.vercel.app"
        }
        
        $response = Invoke-RestMethod -Uri "$BASE_URL/produit-standard" -Method GET -Headers $headers
        Write-TestResult "CORS Frontend" "PASS" "CORS configuré correctement"
    }
    catch {
        Write-TestResult "CORS Frontend" "FAIL" "Erreur CORS: $($_.Exception.Message)" "Red"
    }
}

# Fonction principale
function Main {
    Write-Host "🔧 Test Complet des API Boujebli Meuble" -ForegroundColor Green
    Write-Host "URL de base: $BASE_URL" -ForegroundColor Gray
    Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
    Write-Host ""
    
    $results = @{
        Total = 0
        Passed = 0
        Failed = 0
    }
    
    # Tests
    Test-Health
    Test-Produits
    Test-Traductions
    Test-Demandes
    Test-Authentication
    Test-Performance
    Test-CORS
    
    Write-Host "`n📊 Résumé des Tests" -ForegroundColor Cyan
    Write-Host "Total: $($results.Total)" -ForegroundColor White
    Write-Host "Réussis: $($results.Passed)" -ForegroundColor Green
    Write-Host "Échoués: $($results.Failed)" -ForegroundColor Red
}

# Exécution
Main 