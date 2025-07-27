# Script pour vérifier et créer l'utilisateur de test
Write-Host "🔍 Vérification de l'utilisateur de test..." -ForegroundColor Green

$BASE_URL = "https://boujebli-meuble-backend.onrender.com"

# Test de connexion
Write-Host "🔐 Test de connexion..." -ForegroundColor Yellow
try {
    $body = '{"email":"adam.karoui51@gmail.com","password":"11112022Ad"}'
    $loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method POST -ContentType "application/json" -Body $body
    Write-Host "✅ Connexion réussie!" -ForegroundColor Green
    Write-Host "📊 Réponse de connexion:" -ForegroundColor Cyan
    $loginResponse | ConvertTo-Json -Depth 3
    
    # Extraire le token
    $token = $loginResponse.data.access_token
    Write-Host "🔑 Token extrait avec succès" -ForegroundColor Green
    
    # Test du profil utilisateur
    Write-Host "👤 Test du profil utilisateur..." -ForegroundColor Yellow
    try {
        $profileResponse = Invoke-RestMethod -Uri "$BASE_URL/user/profile" -Method GET -Headers @{"Authorization"="Bearer $token"}
        Write-Host "✅ Profil utilisateur récupéré avec succès!" -ForegroundColor Green
        Write-Host "📊 Profil utilisateur:" -ForegroundColor Cyan
        $profileResponse | ConvertTo-Json -Depth 3
    } catch {
        Write-Host "❌ Erreur lors de la récupération du profil:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        
        # Essayer de créer l'utilisateur
        Write-Host "🔄 Tentative de création de l'utilisateur..." -ForegroundColor Yellow
        try {
            $registerBody = '{"name":"adam","email":"adam.karoui51@gmail.com","password":"11112022Ad"}'
            $registerResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/register" -Method POST -ContentType "application/json" -Body $registerBody
            Write-Host "✅ Utilisateur créé avec succès!" -ForegroundColor Green
            Write-Host "📊 Réponse d'inscription:" -ForegroundColor Cyan
            $registerResponse | ConvertTo-Json -Depth 3
        } catch {
            Write-Host "❌ Erreur lors de la création de l'utilisateur:" -ForegroundColor Red
            Write-Host $_.Exception.Message -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host "❌ Erreur de connexion:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "🏁 Vérification terminée" -ForegroundColor Green 