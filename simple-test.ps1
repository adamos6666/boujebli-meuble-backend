# Test simple des API Boujebli Meuble
$BASE_URL = "https://boujebli-meuble-backend.onrender.com"

Write-Host "=== Test des API Boujebli Meuble ===" -ForegroundColor Green
Write-Host "URL: $BASE_URL" -ForegroundColor Gray
Write-Host ""

# Test 1: Produits
Write-Host "1. Test des produits..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/produit-standard" -Method GET
    Write-Host "   SUCCESS: $($response.count) produits trouves" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Traductions
Write-Host "2. Test des traductions..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/traduction" -Method GET
    Write-Host "   SUCCESS: $($response.Length) traductions trouvees" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Authentification
Write-Host "3. Test d'authentification..." -ForegroundColor Yellow
try {
    $body = '{"email":"test@example.com","password":"test123"}'
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method POST -ContentType "application/json" -Body $body
    Write-Host "   SUCCESS: Authentification reussie" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Produit par ID
Write-Host "4. Test produit par ID..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/produit-standard/1" -Method GET
    Write-Host "   SUCCESS: Produit ID 1 trouve" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Performance
Write-Host "5. Test de performance..." -ForegroundColor Yellow
$startTime = Get-Date
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/produit-standard" -Method GET
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalMilliseconds
    Write-Host "   SUCCESS: Reponse en ${duration}ms" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test termine ===" -ForegroundColor Green 