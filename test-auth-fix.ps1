# Test des corrections d'authentification
$BASE_URL = "https://boujebli-meuble-backend.onrender.com"

Write-Host "=== Test des Corrections d'Authentification ===" -ForegroundColor Green
Write-Host ""

# Test 1: Créer un utilisateur de test
Write-Host "1. Création d'un utilisateur de test..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/test-user" -Method POST -ContentType "application/json"
    Write-Host "   SUCCESS: Utilisateur de test créé" -ForegroundColor Green
    Write-Host "   Email: $($response.data.email)" -ForegroundColor Gray
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Inscription
Write-Host "2. Test d'inscription..." -ForegroundColor Yellow
try {
    $body = '{"name":"Test User","email":"test@boujebli.com","password":"test123"}'
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/register" -Method POST -ContentType "application/json" -Body $body
    Write-Host "   SUCCESS: Inscription réussie" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Connexion
Write-Host "3. Test de connexion..." -ForegroundColor Yellow
try {
    $body = '{"email":"test@boujebli.com","password":"test123"}'
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method POST -ContentType "application/json" -Body $body
    Write-Host "   SUCCESS: Connexion réussie" -ForegroundColor Green
    Write-Host "   Token: $($response.data.access_token.Substring(0,20))..." -ForegroundColor Gray
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Connexion avec mauvais mot de passe
Write-Host "4. Test connexion avec mauvais mot de passe..." -ForegroundColor Yellow
try {
    $body = '{"email":"test@boujebli.com","password":"wrongpassword"}'
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method POST -ContentType "application/json" -Body $body
    Write-Host "   ERROR: Devrait échouer mais a réussi" -ForegroundColor Red
} catch {
    Write-Host "   SUCCESS: Échec attendu avec mauvais mot de passe" -ForegroundColor Green
}

# Test 5: Endpoint de santé
Write-Host "5. Test endpoint de santé..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/" -Method GET
    Write-Host "   SUCCESS: API en bonne santé" -ForegroundColor Green
    Write-Host "   Version: $($response.version)" -ForegroundColor Gray
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Informations API
Write-Host "6. Test informations API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/info" -Method GET
    Write-Host "   SUCCESS: Informations récupérées" -ForegroundColor Green
    Write-Host "   Nom: $($response.name)" -ForegroundColor Gray
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test terminé ===" -ForegroundColor Green 