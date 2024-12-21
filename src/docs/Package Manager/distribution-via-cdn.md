---
category: Package Manager
title: Distribution via CDN
date: 2024-12-20
author: Romagny13
---

# Guide : Publier une librairie JavaScript sur les CDN

## Introduction

Un CDN (Content Delivery Network) permet de distribuer votre librairie JavaScript de manière performante à travers le monde. Ce guide explique comment publier votre librairie sur les principaux CDN (jsDelivr, UNPKG, et CDNJS) en la publiant d’abord sur GitHub et npm.

## Prérequis

Avant de commencer, assurez-vous de disposer des outils suivants :

- Un compte **GitHub**
- Un compte **npm**
- **Node.js** installé (avec npm inclus)
- **Git** installé

## 1. Structure du projet

Une structure de projet claire est essentielle pour une distribution efficace. Voici une structure recommandée :

```
my-library/
├── src/              # Code source
│   └── index.js
├── dist/             # Fichiers buildés pour production
│   ├── my-library.js
│   └── my-library.min.js
├── package.json      # Configuration npm
└── README.md         # Documentation
```

### Fichiers importants :

- **src/** : Contient le code source non minifié de votre librairie.
- **dist/** : Contient les fichiers buildés et minifiés pour production.
- **package.json** : Configure les métadonnées de votre projet pour npm.
- **README.md** : Fournit des instructions d’utilisation pour les utilisateurs.

---

## 2. Configuration du package.json

Le fichier `package.json` est indispensable pour publier sur npm. Voici un exemple minimaliste :

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "description": "Une librairie JavaScript exemple",
  "main": "dist/my-library.js",
  "files": ["dist"],
  "scripts": {
    "build": "webpack --mode production",
    "prepublishOnly": "npm run build"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/username/my-library.git"
  },
  "keywords": ["javascript", "library"],
  "author": "Votre nom",
  "license": "MIT"
}
```

### Points à noter :

- **name** : Nom unique de la librairie (tel qu'il apparaîtra sur npm).
- **version** : Utilisez le versioning sémantique (ex. : 1.0.0, 1.0.1).
- **main** : Chemin vers le fichier principal dans `dist/`.
- **files** : Limite les fichiers inclus dans la publication npm à ceux du dossier `dist/`.
- **scripts.build** : Utilisez un outil comme Webpack ou Rollup pour générer les fichiers buildés.

---

## 3. Publication sur GitHub

### A. Initialisation du dépôt GitHub

1. Créez un nouveau dépôt sur GitHub.
2. Initialisez Git localement dans le dossier de votre projet :
   ```bash
   git init
   git remote add origin https://github.com/username/my-library.git
   ```
3. Ajoutez les fichiers et faites un commit initial :
   ```bash
   git add .
   git commit -m "feat: initial commit"
   git branch -M main
   git push -u origin main
   ```

### B. Création d'une Release

Les releases sont importantes pour les utilisateurs de jsDelivr :

1. **Taguer une version** :
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
2. **Publier une release sur GitHub** :
   - Rendez-vous dans l’onglet **Releases**.
   - Cliquez sur **Draft a new release**.
   - Sélectionnez le tag `v1.0.0`.
   - Ajoutez une description et attachez les fichiers du dossier `dist/`.
   - Cliquez sur **Publish release**.

---

## 4. Publication sur npm

Publier sur npm permet à votre librairie d’être accessible depuis jsDelivr et UNPKG.

1. **Se connecter à npm** (si ce n’est pas déjà fait) :

   ```bash
   npm login
   ```

2. **Publier la librairie** :

   ```bash
   npm publish --access public
   ```

3. **Vérifier la publication** :
   Votre librairie est maintenant disponible sur [npm](https://www.npmjs.com/).

---

## 5. Accès via les CDN

Une fois la librairie publiée sur GitHub et npm, elle sera automatiquement disponible sur les CDN suivants :

### A. jsDelivr

- Via GitHub :
  ```html
  <script src="https://cdn.jsdelivr.net/gh/username/my-library@1.0.0/dist/my-library.min.js"></script>
  ```
- Via npm (recommandé pour la production) :
  ```html
  <script src="https://cdn.jsdelivr.net/npm/my-library@1.0.0/dist/my-library.min.js"></script>
  ```

### B. UNPKG

- URL automatique basée sur npm :
  ```html
  <script src="https://unpkg.com/my-library@1.0.0/dist/my-library.min.js"></script>
  ```

### C. CDNJS

- **Critères d’éligibilité** :
  - Plus de 800 téléchargements npm par mois.
  - Demande manuelle via une Pull Request sur [cdnjs/packages](https://github.com/cdnjs/packages).

---

## 6. Intégration dans une page HTML

Voici un exemple d’utilisation dans une page HTML :

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Library Test</title>
    <script src="https://cdn.jsdelivr.net/npm/my-library@1.0.0/dist/my-library.min.js"></script>
  </head>
  <body>
    <h1>Test de ma librairie</h1>
    <script>
      // Exemple d'utilisation de la librairie
      MyLibrary.doSomething();
    </script>
  </body>
</html>
```

---

## Points à retenir

- **Versioning sémantique** : Utilisez des versions claires pour suivre l’évolution de votre librairie (1.0.0, 1.0.1, etc.).
- **Minification** : Fournissez toujours une version minifiée pour les performances.
- **jsDelivr et UNPKG** : Disponibles automatiquement après la publication npm.
- **CDNJS** : Nécessite une demande manuelle et des critères d’éligibilité.

Avec ces étapes, votre librairie sera prête pour une distribution mondiale efficace via les principaux CDN. Bonne publication !
