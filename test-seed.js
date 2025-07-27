const https = require('https');

const API_BASE_URL = 'https://boujebli-meuble-backend.onrender.com';

function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'boujebli-meuble-backend.onrender.com',
      port: 443,
      path: url.replace(API_BASE_URL, ''),
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function testBackend() {
  console.log('🧪 Test de la connexion au backend...\n');

  try {
    // Test 1: Endpoint de santé
    console.log('1️⃣ Test de l\'endpoint de santé...');
    const healthResponse = await makeRequest(`${API_BASE_URL}/health`);
    console.log('✅ Santé:', healthResponse.data);
    console.log('');

    // Test 2: Test de la base de données
    console.log('2️⃣ Test de la base de données...');
    const testResponse = await makeRequest(`${API_BASE_URL}/produit-standard/test`);
    console.log('✅ Test DB:', testResponse.data);
    console.log('');

    // Test 3: Récupération des produits
    console.log('3️⃣ Récupération des produits...');
    const productsResponse = await makeRequest(`${API_BASE_URL}/produit-standard`);
    console.log('✅ Produits (format brut):', JSON.stringify(productsResponse.data, null, 2));
    console.log('✅ Type de données:', typeof productsResponse.data);
    console.log('✅ Est-ce un tableau?', Array.isArray(productsResponse.data));
    if (productsResponse.data.produits) {
      console.log('✅ Nombre de produits dans .produits:', productsResponse.data.produits.length);
      console.log('✅ Titres des produits:');
      productsResponse.data.produits.forEach((produit, index) => {
        console.log(`   ${index + 1}. ${produit.titre}`);
      });
    }
    console.log('');

    // Test 4: Exécution du seed si nécessaire
    if (productsResponse.data.count === 0 || productsResponse.data.produits.length === 0) {
      console.log('4️⃣ Aucun produit trouvé, exécution du seed...');
      try {
        const seedResponse = await makeRequest(`${API_BASE_URL}/seed`, 'POST');
        console.log('✅ Seed:', seedResponse.data);
        console.log('');

        // Test 5: Vérification après seed
        console.log('5️⃣ Vérification après seed...');
        const productsAfterSeed = await makeRequest(`${API_BASE_URL}/produit-standard`);
        console.log('✅ Produits après seed:', productsAfterSeed.data);
      } catch (seedError) {
        console.log('❌ Erreur lors du seed:', seedError.message);
      }
    } else {
      console.log('✅ Des produits sont déjà présents dans la base de données');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

testBackend(); 