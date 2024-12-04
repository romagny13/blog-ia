---
category: Web > React
title: Debug
date: 2024-11-26
author: Romagny13
---

# **Guide : Comment Débugger du Code JavaScript/React avec CRA et Vite**

Voici un guide complet pour débugger efficacement du code **JavaScript/React** en utilisant différents outils et environnements comme **WebStorm**, **Visual Studio Code**, **Visual Studio**, et **Google Chrome**.

---

## **1. Avec WebStorm**

WebStorm offre des fonctionnalités intégrées pour déboguer des projets React avec Create React App (CRA) ou Vite.

### **Configuration**

1. **Créer une configuration de débogage :**

   - Allez dans `Run > Edit Configurations`.
   - Cliquez sur le bouton `+` et choisissez **JavaScript Debug**.
   - Configurez l'URL en indiquant `http://localhost:3000` pour CRA ou le port de votre projet Vite.

2. **Lancer le débogueur :**
   - Démarrez votre projet en mode développement :
     ```bash
     npm start # Pour CRA
     npm run dev # Pour Vite
     ```
   - Lancez la configuration de débogage dans WebStorm. Cela ouvrira automatiquement Chrome avec un débogueur attaché.

### **Points forts**

- Breakpoints accessibles directement dans l'éditeur.
- Console intégrée.
- Inspection du DOM et des composants React via l'onglet **React DevTools**.

---

## **2. Avec Visual Studio Code (VS Code)**

### **Extensions utiles**

- **Debugger for Chrome/Edge** : Permet de déboguer dans le navigateur.
- **React Developer Tools** : Pour inspecter les composants React.
- **ESLint** : Identifier les erreurs et les mauvais styles de code.

### **Configuration de débogage**

1. **Créer une configuration dans `launch.json` :**

   - Appuyez sur `Ctrl + Shift + D` ou ouvrez l'onglet Débogage.
   - Cliquez sur `Create a launch.json file`.
   - Ajoutez la configuration suivante :
     ```json
     {
       "version": "0.2.0",
       "configurations": [
         {
           "type": "chrome",
           "request": "launch",
           "name": "Launch Chrome against localhost",
           "url": "http://localhost:3000",
           "webRoot": "${workspaceFolder}/src"
         }
       ]
     }
     ```

2. **Lancer le projet :**
   - Démarrez le serveur de développement :
     ```bash
     npm start # Pour CRA
     npm run dev # Pour Vite
     ```
   - Démarrez la configuration dans l’onglet Débogage.

### **Inspection des composants React**

- Utilisez **React Developer Tools** pour inspecter les états, props, et hiérarchies de vos composants.

---

## **3. Avec Visual Studio**

### **Déboguer une application React**

Visual Studio supporte les applications React à travers des projets Node.js ou une intégration avec des applications ASP.NET Core.

1. **Configurer le projet :**

   - Créez un projet **Node.js** ou **ASP.NET Core avec React**.
   - Ajoutez votre code React au dossier `ClientApp`.

2. **Configurer le débogage :**
   - Définissez un breakpoint dans votre fichier JavaScript/TypeScript.
   - Lancez le projet avec **IIS Express** ou un serveur intégré.

### **Extension conseillée**

- **JavaScript Debugger** : Ajoute des fonctionnalités avancées de débogage.

---

## **4. Avec Google Chrome**

### **Utilisation des outils de développement**

1. **Ouvrir DevTools :**

   - Faites un clic droit sur la page, puis sélectionnez **Inspecter**.
   - Ou utilisez le raccourci `Ctrl + Shift + I` (Windows/Linux) ou `Cmd + Option + I` (Mac).

2. **Déboguer le code :**

   - Allez dans l'onglet **Sources**.
   - Trouvez vos fichiers dans la section **Files** ou utilisez **Ctrl + P** pour rechercher.
   - Placez un breakpoint en cliquant sur le numéro de ligne.

3. **Inspecter les composants React :**
   - Installez l'extension **React Developer Tools** depuis le Chrome Web Store.
   - Un nouvel onglet **React** apparaîtra dans DevTools.

---

## **Conseils généraux**

### **Extensions indispensables**

- **React Developer Tools** : Inspection des composants.
- **Redux DevTools** : Debug des états pour les projets utilisant Redux.
- **ESLint** : Pour prévenir les erreurs de syntaxe et de style.

### **Configuration de la source map**

Les source maps permettent de mapper le code minifié aux fichiers originaux, facilitant ainsi le débogage. CRA et Vite les gèrent automatiquement en mode développement, mais vous pouvez les activer explicitement dans `vite.config.js` :

```javascript
export default defineConfig({
  build: {
    sourcemap: true,
  },
});
```

---

## **Bonnes pratiques de débogage**

1. **Utiliser des breakpoints** : Préférez-les aux `console.log` pour une meilleure visibilité.
2. **Inspecter les erreurs** : Consultez la console pour analyser les messages d'erreur.
3. **Surveiller le DOM** : Utilisez l'onglet **Elements** de DevTools pour voir les changements en direct.
4. **Analyser les requêtes réseau** : L'onglet **Network** de DevTools montre les requêtes envoyées, leur statut et leur contenu.

---

## **Comparaison des outils**

| **Caractéristique**  | **WebStorm** | **VS Code** | **Visual Studio** | **Chrome** |
| -------------------- | ------------ | ----------- | ----------------- | ---------- |
| Débogueur intégré    | ✅           | ✅          | ✅                | ✅         |
| Extensions tierces   | ❌           | ✅          | ✅                | ✅         |
| Inspection DOM/React | ✅           | ✅          | ❌                | ✅         |
| Complexité           | Moyen        | Facile      | Élevé             | Facile     |

---

Avec ces outils et techniques, vous serez en mesure de déboguer efficacement vos projets React, que vous utilisiez CRA ou Vite. 😊
