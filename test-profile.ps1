Write-Host "Test du profil utilisateur..." -ForegroundColor Green

$BASE_URL = "https://boujebli-meuble-backend.onrender.com"

# Test de connexion
Write-Host "Test de connexion..." -ForegroundColor Yellow
$loginBody = @{
    email = "adam.karoui51@gmail.com"
    password = "11112022Ad"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    Write-Host "Connexion reussie!" -ForegroundColor Green
    
    $token = $loginResponse.data.access_token
    Write-Host "Token extrait" -ForegroundColor Green
    
    # Test du profil
    Write-Host "Test du profil..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $profileResponse = Invoke-RestMethod -Uri "$BASE_URL/user/profile" -Method GET -Headers $headers
    Write-Host "Profil recupere avec succes!" -ForegroundColor Green
    $profileResponse | ConvertTo-Json
    
} catch {
    Write-Host "Erreur: $($_.Exception.Message)" -ForegroundColor Red
} 