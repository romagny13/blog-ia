---
category: GIT
title: Github Pages avec Vite
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
  base: "/nom-de-votre-repo/", // Remplacez par le nom de votre repository
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

Voici un document **Markdown** qui résume les étapes pour résoudre les problèmes de routing avec **GitHub Pages** en utilisant **Vite** et **React Router**, en français :

## 6. Résolution des problèmes de routing

Lorsque vous déployez une application React sur **GitHub Pages**, il est fréquent de rencontrer des erreurs **404** pour des routes autres que la page d'accueil. Ce guide décrit comment configurer correctement votre projet pour éviter ces problèmes.

### Problème

GitHub Pages ne gère pas les routes dynamiques de votre application React (par exemple `/article/:slug`). Une tentative d'accès direct à une route personnalisée peut entraîner une erreur **404**.

### Solution

### 1. Ajouter un fichier `404.html`

GitHub Pages redirige les erreurs **404** vers un fichier **`404.html`**. Pour que votre application gère correctement les routes, vous devez ajouter un fichier **`404.html`** dans le dossier **`public/`** de votre projet.

Créez un fichier **`public/404.html`** avec le contenu suivant :

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>404 Non Trouvée</title>
    <script type="text/javascript">
      // Rediriger vers index.html pour permettre à React Router de gérer la route
      window.location.replace("/nom-de-votre-repo/index.html");
    </script>
  </head>
  <body>
    <h1>Page non trouvée</h1>
    <p>Redirection en cours...</p>
  </body>
</html>
```

### 2. Configurer `vite.config.js` pour GitHub Pages

Si votre application est déployée dans un sous-dossier (par exemple `/nom-de-votre-repo/`), configurez le fichier **`vite.config.js`** pour définir le **`base`**. Cela permet de gérer correctement les chemins relatifs.

Voici un exemple de configuration :

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/nom-de-votre-repo/", // Remplacez par le nom de votre dépôt GitHub
  plugins: [react()],
});
```

### 3. Configurer React Router avec un `basename`

Ajoutez le **`basename`** correspondant au sous-dossier dans votre configuration React Router. Par exemple, si votre application est dans `/nom-de-votre-repo/`, configurez React Router comme suit :

```jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router basename="/nom-de-votre-repo">
      <Routes>
        {/* Gestion des 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
```

### 4. Déployer avec GitHub Pages

Une fois votre projet configuré, déployez-le sur **GitHub Pages**. Si vous utilisez GitHub Actions, assurez-vous que votre workflow est correctement configuré.

### 5. Vérifications après déploiement

- Accédez à l'URL de votre application (par exemple `https://votre-utilisateur.github.io/nom-de-votre-repo/`).
- Testez des routes dynamiques comme `/article/supabase-react`.
- Vérifiez que les routes non valides redirigent vers votre page d'accueil ou affichent un message personnalisé.

---

### Résumé des configurations importantes

| Fichier           | Configuration clé                                                        |
| ----------------- | ------------------------------------------------------------------------ |
| `vite.config.js`  | `base: '/nom-du-repo/'`                                                  |
| `public/404.html` | Redirection vers `/nom-de-votre-repo/index.html`                         |
| `App.js`          | `basename="/nom-du-repo"` dans `BrowserRouter`                           |
| GitHub Actions    | Utilisation d'un workflow pour déployer automatiquement sur GitHub Pages |

Avec cette configuration, votre application devrait fonctionner correctement sur **GitHub Pages**, même avec des routes dynamiques. 🎉

### 7. Alternative avec redirection

#### 1. **Page HTML 404 avec redirection (GitHub Pages)**

Lorsque l'utilisateur tente d'accéder à une URL qui ne correspond pas à un fichier existant sur GitHub Pages (par exemple, un chemin dynamique généré par React Router), GitHub Pages renvoie une erreur 404. Pour éviter cela, on peut utiliser une page 404 personnalisée pour rediriger l'utilisateur vers `index.html` tout en passant le chemin demandé (et son fragment, si applicable).

Voici un exemple de code à mettre dans la page **`404.html`** (qui doit se trouver dans le répertoire `public` de votre projet) :

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>404 Not Found</title>
    <script type="text/javascript">
      // Récupère le chemin actuel et le fragment (ancre)
      const currentPath = window.location.pathname;
      const currentHash = window.location.hash;

      // Tronque le chemin si nécessaire
      const truncatedPath = currentPath.replace(/^\/nom-de-votre-repo/, "");

      // Construit l'URL redirigée avec les informations
      const targetURL = `/nom-de-votre-repo/index.html?redirect=${encodeURIComponent(
        truncatedPath
      )}${currentHash}`;

      // Redirige vers index.html avec les informations ajoutées
      window.location.replace(targetURL);
    </script>
  </head>
  <body>
    <h1>Page non trouvée</h1>
    <p>Redirection en cours...</p>
  </body>
</html>
```

##### Explication :

- **`window.location.pathname`** : récupère le chemin de l'URL actuelle.
- **`window.location.hash`** : récupère le fragment (ancre) de l'URL.
- **`currentPath.replace(/^\/nom-de-votre-repo/, "")`** : supprime le préfixe `/nom-de-votre-repo` du chemin si nécessaire, afin de naviguer correctement vers le chemin demandé sans cette partie.
- **`window.location.replace(targetURL)`** : redirige l'utilisateur vers `index.html`, en ajoutant un paramètre `redirect` dans l'URL, qui contient le chemin demandé.

---

#### 2. **Gestion de la redirection dans React avec `useEffect`**

Dans votre application React, vous pouvez gérer la redirection de manière dynamique en utilisant le `useEffect` pour intercepter le paramètre `redirect` passé dans l'URL. Le paramètre `redirect` contient le chemin que l'utilisateur souhaitait atteindre, et vous pouvez naviguer vers ce chemin tout en maintenant l'intégrité de l'ancre (fragment).

Voici un exemple de code à intégrer dans votre composant principal ou dans un composant de routage :

```javascript
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Récupère le paramètre `redirect` depuis l'URL
    const params = new URLSearchParams(window.location.search);
    const redirectPath = params.get("redirect");

    if (redirectPath) {
      // Décoder le chemin avant de naviguer
      const decodedPath = decodeURIComponent(
        redirectPath + window.location.hash
      );

      // Navigue vers le chemin demandé
      navigate(decodedPath, { replace: true });
    }
  }, [navigate]);

  return null; // Ce composant ne rend rien, il est uniquement utilisé pour la redirection
};

export default RedirectHandler;
```

##### Explication :

- **`URLSearchParams(window.location.search)`** : permet d'extraire les paramètres de l'URL, notamment `redirect`.
- **`decodeURIComponent(redirectPath + window.location.hash)`** : décode le chemin et le fragment de l'URL pour s'assurer qu'ils sont correctement interprétés.

Dans cet exemple, le composant `RedirectHandler` gère la redirection après la réception du paramètre `redirect` dans l'URL. Lorsqu'une redirection est détectée, il utilise le `navigate` de React Router pour naviguer vers le chemin souhaité, en tenant compte des ancres.

---
