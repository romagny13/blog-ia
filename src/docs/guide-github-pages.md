---
category: GIT
title: Gihtub Pages
date: 2024-11-21
author: Romagny13
---

# Guide de déploiement React Vite sur GitHub Pages

Ce guide vous montre comment configurer et déployer une application React Vite sur GitHub Pages en utilisant GitHub Actions.

## 1. Configuration initiale

### 1.1 Configuration du vite.config.js

Dans votre projet, modifiez ou créez le fichier `vite.config.js` :

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/nom-de-votre-repo/" // Remplacez par le nom de votre repository
});
```

### 1.2 Création du workflow GitHub Actions

Créez les dossiers et le fichier suivants dans votre projet :

```
.github/
  └── workflows/
      └── deploy.yml
```

Contenu du fichier `deploy.yml` :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: "npm"

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "./dist"

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 1.3 Vérification du package.json

Assurez-vous d'avoir le script build dans votre `package.json` :

```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

## 2. Configuration GitHub

### 2.1 Créer et pousser le repository

```bash
# Si le repository n'est pas encore initialisé
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/votre-username/nom-de-votre-repo.git
git push -u origin main

# Si le repository existe déjà
git add .
git commit -m "Configuration GitHub Pages"
git push origin main
```

### 2.2 Activer GitHub Pages

1. Allez sur votre repository GitHub
2. Cliquez sur "Settings"
3. Dans le menu gauche, descendez jusqu'à "Pages"
4. Dans "Build and deployment":
   - Source : Sélectionnez "GitHub Actions"
   - Ne sélectionnez pas de branche

## 3. Vérification du déploiement

1. Allez dans l'onglet "Actions" de votre repository
2. Vous devriez voir le workflow "Deploy to GitHub Pages" en cours d'exécution
3. Attendez que le workflow soit terminé (symbole vert ✓)
4. Votre site sera accessible à l'adresse : `https://votre-username.github.io/nom-de-votre-repo/`

## 4. Dépannage courant

### Le déploiement échoue avec "Get Pages site failed"

➡️ Solution : Vérifiez que GitHub Pages est bien activé dans les paramètres du repository et configuré pour utiliser GitHub Actions.

### Les assets (JS/CSS) ne se chargent pas

➡️ Solution : Vérifiez que le `base` dans `vite.config.js` correspond exactement au nom de votre repository.

### L'URL de déploiement n'est pas accessible

➡️ Solution :

- Attendez quelques minutes après le déploiement réussi
- Vérifiez que le workflow est bien terminé (symbole vert)
- Vérifiez l'URL dans Settings > Pages

## 5. Mises à jour futures

Pour mettre à jour votre site :

1. Faites vos modifications localement
2. Commitez et poussez sur main
3. Le workflow se déclenchera automatiquement
4. Attendez que le déploiement soit terminé

## Note importante

- Le nom dans `base: '/nom-de-votre-repo/'` doit contenir uniquement le nom du repository (pas le nom d'utilisateur)
- L'URL finale sera automatiquement construite comme : `username.github.io/repository-name`
