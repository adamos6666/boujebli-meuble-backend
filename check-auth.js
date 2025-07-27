const https = require('https');

const API_BASE_URL = 'https://boujebli-meuble-backend.onrender.com';

function makeRequest(url, method = 'GET', body = null) {
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

    if (body) {
      const bodyString = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(bodyString);
    }

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

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function testAuth() {
  console.log('🔐 Test de l\'authentification...\n');

  try {
    // Test 1: Vérifier que l'API fonctionne
    console.log('1️⃣ Test de la santé de l\'API...');
    const healthResponse = await makeRequest(`${API_BASE_URL}/health`);
    console.log('✅ Santé API:', healthResponse.data);
    console.log('');

    // Test 2: Test d'inscription
    console.log('2️⃣ Test d\'inscription...');
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };

    try {
      const registerResponse = await makeRequest(`${API_BASE_URL}/auth/register`, 'POST', testUser);
      console.log('✅ Inscription:', registerResponse.data);
      console.log('');

      // Test 3: Test de connexion
      console.log('3️⃣ Test de connexion...');
      const loginData = {
        email: testUser.email,
        password: testUser.password
      };

      const loginResponse = await makeRequest(`${API_BASE_URL}/auth/login`, 'POST', loginData);
      console.log('✅ Connexion:', loginResponse.data);
      console.log('');

      // Test 4: Test avec mauvais mot de passe
      console.log('4️⃣ Test avec mauvais mot de passe...');
      const wrongPasswordData = {
        email: testUser.email,
        password: 'wrongpassword'
      };

      try {
        const wrongPasswordResponse = await makeRequest(`${API_BASE_URL}/auth/login`, 'POST', wrongPasswordData);
        console.log('⚠️ Réponse inattendue avec mauvais mot de passe:', wrongPasswordResponse.data);
      } catch (error) {
        console.log('✅ Erreur attendue avec mauvais mot de passe:', error.message);
      }
      console.log('');

    } catch (registerError) {
      console.log('❌ Erreur lors de l\'inscription:', registerError.message);
      
      // Test avec un utilisateur existant
      console.log('5️⃣ Test avec utilisateur existant...');
      const existingUser = {
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123'
      };

      try {
        const existingResponse = await makeRequest(`${API_BASE_URL}/auth/login`, 'POST', existingUser);
        console.log('✅ Connexion utilisateur existant:', existingResponse.data);
      } catch (error) {
        console.log('❌ Erreur avec utilisateur existant:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

testAuth(); 