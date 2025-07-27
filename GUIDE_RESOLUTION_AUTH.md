# 🔐 Guide de Résolution du Problème d'Authentification

## 🚨 **Problème Identifié**

L'erreur "Unauthorized" se produit lors de la connexion depuis le frontend (localhost:3000) vers le backend.

### **Cause Racine :**
1. **Endpoint manquant :** `/user/profile` n'existait pas dans le backend
2. **Configuration API :** Le frontend utilisait l'URL de production au lieu de l'URL locale
3. **Gestion des réponses :** Le frontend ne gérait pas correctement les réponses de l'API

---

## ✅ **Solutions Appliquées**

### **1. Ajout de l'Endpoint `/user/profile`**

**Fichier :** `backend/src/user/user.controller.ts`
```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
@ApiBearerAuth()
@ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
async getProfile(@Request() req) {
  const userId = req.user.sub;
  const user = await this.userService.findOne(userId);
  
  // Retourner les informations sans le mot de passe
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
```

### **2. Amélioration du Service Utilisateur**

**Fichier :** `backend/src/user/user.service.ts`
```typescript
// Méthodes ajoutées
async findAll(): Promise<User[]>
async findOne(id: number): Promise<User>
async update(id: number, updateUserDto: Partial<User>): Promise<User>
async remove(id: number): Promise<User>
```

### **3. Correction de la Configuration API Frontend**

**Fichier :** `frontend/lib/api.ts`
```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://boujebli-meuble-backend.onrender.com'
    : 'http://localhost:3001', // URL locale pour le développement
  // ...
};
```

### **4. Amélioration du Hook d'Authentification**

**Fichier :** `frontend/hooks/useAuth.ts`
```typescript
// Gestion améliorée des réponses API
const accessToken = response.access_token || response.data?.access_token;
if (!accessToken) {
  throw new Error('Token d\'accès non reçu');
}
```

---

## 🚀 **Instructions pour Résoudre le Problème**

### **Étape 1 : Démarrer le Backend Local**

```powershell
# Dans le dossier backend
cd backend
.\start-local.ps1
```

Le backend sera accessible sur : http://localhost:3001

### **Étape 2 : Vérifier les Endpoints**

Testez ces endpoints dans votre navigateur :

1. **Santé de l'API :** http://localhost:3001/
2. **Documentation Swagger :** http://localhost:3001/api
3. **Test d'authentification :** http://localhost:3001/auth/test-user

### **Étape 3 : Tester l'Authentification**

Utilisez le script de test :
```powershell
.\test-auth-fix.ps1
```

### **Étape 4 : Démarrer le Frontend**

```powershell
# Dans le dossier frontend
cd frontend
npm run dev
```

Le frontend sera accessible sur : http://localhost:3000

---

## 🔧 **Débogage**

### **Vérifier les Logs Backend**

Les logs du backend affichent :
- 🔐 Tentative de connexion
- ✅ Connexion réussie
- 👤 Chargement du profil utilisateur

### **Vérifier les Logs Frontend**

Ouvrez la console du navigateur (F12) pour voir :
- 🌐 Appel API
- 📡 Réponse API
- ✅ Données reçues

### **Problèmes Courants**

1. **Erreur CORS :** Vérifiez que le backend autorise localhost:3000
2. **Port occupé :** Changez le port du backend si nécessaire
3. **Base de données :** Vérifiez que la base de données est accessible

---

## 📊 **Test de Fonctionnement**

### **Test d'Inscription :**
1. Allez sur http://localhost:3000/register
2. Créez un compte avec email et mot de passe
3. Vérifiez que vous êtes automatiquement connecté

### **Test de Connexion :**
1. Allez sur http://localhost:3000/login
2. Entrez vos identifiants
3. Vérifiez que vous êtes connecté

### **Test de Profil :**
1. Après connexion, vérifiez que votre profil est chargé
2. Vérifiez dans la console que `/user/profile` fonctionne

---

## 🎯 **Résultat Attendu**

Après application des corrections :

✅ **Inscription :** Fonctionne sans erreur  
✅ **Connexion :** Fonctionne sans erreur "Unauthorized"  
✅ **Profil :** Chargement automatique des informations utilisateur  
✅ **Token :** Stockage et utilisation correcte du JWT  
✅ **Déconnexion :** Nettoyage complet des données  

---

## 🔗 **Liens Utiles**

- **Backend Local :** http://localhost:3001
- **Frontend Local :** http://localhost:3000
- **Documentation API :** http://localhost:3001/api
- **Repository GitHub :** https://github.com/adamos6666/boujebli-meuble-backend

---

## 📝 **Notes Importantes**

1. **Environnement de développement :** Utilisez toujours localhost:3001 pour le backend
2. **Environnement de production :** L'API utilise automatiquement l'URL de production
3. **Base de données :** Assurez-vous que votre base de données locale est configurée
4. **Variables d'environnement :** Vérifiez que vos variables d'environnement sont correctes

---

*Guide créé le 27 Juillet 2025 - Problème résolu avec succès ! 🎉* 