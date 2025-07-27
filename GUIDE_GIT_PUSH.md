# 🚀 Guide d'Utilisation - Push Automatique Backend

## 📋 Scripts Disponibles

### 1. **git-push.ps1** - Push Manuel
```powershell
# Usage: .\git-push.ps1 "Message de commit"
.\git-push.ps1 "Ajout: Nouvelle fonctionnalité"
```

**Fonctionnalités:**
- ✅ Ajoute automatiquement tous les fichiers modifiés
- ✅ Crée un commit avec votre message
- ✅ Pull les changements distants (évite les conflits)
- ✅ Push vers GitHub
- ✅ Affiche les derniers commits

### 2. **watch-and-push.ps1** - Surveillance Automatique
```powershell
# Usage: .\watch-and-push.ps1
.\watch-and-push.ps1
```

**Fonctionnalités:**
- 👀 Surveille les changements toutes les 30 secondes
- 🔄 Push automatique dès qu'un changement est détecté
- ⏰ Timestamp automatique dans les commits
- 🛑 Ctrl+C pour arrêter la surveillance

## 🎯 Utilisation Recommandée

### **Pour le Développement Quotidien:**
```powershell
# 1. Faire vos modifications dans le code
# 2. Tester vos changements
# 3. Lancer le push manuel
.\git-push.ps1 "Description de vos changements"
```

### **Pour le Développement Continu:**
```powershell
# 1. Lancer la surveillance automatique
.\watch-and-push.ps1

# 2. Travailler normalement - les changements seront poussés automatiquement
# 3. Ctrl+C pour arrêter quand vous avez fini
```

## 📊 Commandes Git Utiles

### **Vérifier le Statut:**
```powershell
git status
```

### **Voir les Derniers Commits:**
```powershell
git log --oneline -10
```

### **Voir les Branches:**
```powershell
git branch -a
```

### **Changer de Branche:**
```powershell
git checkout nom-de-la-branche
```

## 🔧 Configuration

### **Repository Configuré:**
- **URL:** https://github.com/adamos6666/boujebli-meuble-backend.git
- **Branche principale:** main
- **Remote:** origin

### **Configuration Git:**
```powershell
git config user.name "Boujebli Meuble"
git config user.email "contact@boujebli-meuble.tn"
```

## 🚨 Gestion des Erreurs

### **Si le Push Échoue:**
1. Vérifiez votre connexion internet
2. Vérifiez que vous avez les permissions sur le repository
3. Essayez de pull manuellement: `git pull origin main`
4. Résolvez les conflits si nécessaire
5. Relancez le script

### **Si la Surveillance S'Arrête:**
1. Vérifiez les logs d'erreur
2. Redémarrez le script: `.\watch-and-push.ps1`
3. Si le problème persiste, utilisez le push manuel

## 📈 Bonnes Pratiques

### **Messages de Commit:**
- ✅ **Descriptifs:** "Ajout: Système d'authentification JWT"
- ✅ **Spécifiques:** "Fix: Correction du bug de pagination"
- ✅ **Courts:** "Update: Documentation API"

### **Fréquence de Push:**
- 🔄 **Développement actif:** Toutes les 30 minutes
- 🚀 **Fonctionnalités complètes:** Après chaque feature
- 🐛 **Corrections de bugs:** Immédiatement

### **Organisation:**
- 📁 Gardez votre code organisé
- 🧪 Testez avant de pousser
- 📝 Documentez les changements importants

## 🔗 Liens Utiles

- **Repository GitHub:** https://github.com/adamos6666/boujebli-meuble-backend
- **Documentation NestJS:** https://nestjs.com/
- **Guide Git:** https://git-scm.com/doc

## 🎉 Avantages du Système

1. **Automatisation:** Plus besoin de se souvenir des commandes Git
2. **Sécurité:** Pull automatique évite les conflits
3. **Traçabilité:** Messages de commit avec timestamps
4. **Flexibilité:** Push manuel ou automatique selon vos besoins
5. **Simplicité:** Scripts prêts à l'emploi

---

**💡 Conseil:** Utilisez la surveillance automatique pendant le développement et le push manuel pour les commits importants ! 