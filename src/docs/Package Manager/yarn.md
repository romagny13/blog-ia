---
category: Package Manager
title: Yarn
date: 2024-11-26
author: Romagny13
---

# Guide de Yarn

Yarn est un gestionnaire de paquets rapide, fiable et sécurisé pour JavaScript et Node.js. Il a été créé par Facebook pour répondre à certaines limitations de NPM, notamment en termes de performance, de cohérence et de sécurité. Ce guide vous accompagnera dans l'installation de Yarn, son utilisation pour gérer les dépendances, ainsi que dans la découverte de certaines fonctionnalités utiles.

---

## 1. **Installation**

Pour commencer à utiliser Yarn, il faut d'abord l'installer. Voici comment procéder :

### **Via npm (si vous avez déjà installé NPM) :**

```bash
npm install -g yarn
```

### **Via Homebrew (macOS et Linux) :**

```bash
brew install yarn
```

### **Via l'installateur Yarn (Windows) :**

Téléchargez directement l'installateur pour Windows depuis le site officiel de Yarn : [https://yarnpkg.com/](https://yarnpkg.com/).

### **Via un script d'installation (Linux) :**

```bash
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn
```

---

## 2. **Créer un fichier `package.json`**

Tout comme NPM, Yarn utilise le fichier `package.json` pour suivre les dépendances de votre projet. Pour générer un fichier `package.json`, exécutez la commande suivante :

```bash
yarn init
```

Cette commande vous posera une série de questions pour configurer votre fichier de projet. Une fois les réponses données, elle générera un fichier `package.json` dans votre répertoire de projet.

Si vous souhaitez ignorer toutes les questions et générer le fichier avec les valeurs par défaut, vous pouvez exécuter :

```bash
yarn init -y
```

---

## 3. **Ajouter des dépendances**

Pour ajouter des dépendances à votre projet, vous utilisez la commande `yarn add`.

### **Installer un package spécifique :**

```bash
yarn add <nom-du-package>
```

Exemple :

```bash
yarn add react
```

### **Installer une version spécifique d'un package :**

```bash
yarn add <nom-du-package>@<version>
```

Exemple :

```bash
yarn add react@17.0.0
```

### **Installer un package en tant que dépendance de développement :**

```bash
yarn add <nom-du-package> --dev
```

Exemple :

```bash
yarn add eslint --dev
```

Cela ajoutera la dépendance à la section `devDependencies` de votre fichier `package.json`.

---

## 4. **Installer toutes les dépendances**

Après avoir configuré votre fichier `package.json`, vous pouvez installer toutes les dépendances listées en exécutant :

```bash
yarn install
```

Cette commande est similaire à `npm install` et installera à la fois les dépendances de production et de développement. Si le dossier `node_modules` existe déjà, Yarn l'utilisera plutôt que de réinstaller toutes les dépendances, ce qui accélère les installations suivantes.

---

## 5. **Supprimer des dépendances**

Pour supprimer une dépendance de votre projet, vous pouvez utiliser :

```bash
yarn remove <nom-du-package>
```

Exemple :

```bash
yarn remove react
```

Cela désinstallera le package et le retirera du fichier `package.json`.

---

## 6. **Contrôle des versions des dépendances**

Yarn utilise un fichier de verrouillage, `yarn.lock`, pour garantir que votre projet utilise les mêmes versions de dépendances, peu importe qui installe ou où cela est installé. Ce fichier est généré automatiquement lorsque vous exécutez `yarn install`.

### **Avantages du fichier `yarn.lock`** :

- Assure la cohérence des environnements de développement.
- Accélère les installations en résolvant et en mettant en cache les dépendances plus efficacement.

Il est important de commettre le fichier `yarn.lock` dans votre gestionnaire de version pour garantir que tout le monde sur le projet utilise les mêmes versions des dépendances.

---

## 7. **Exécuter des scripts**

Tout comme NPM, Yarn vous permet de définir des scripts personnalisés dans le fichier `package.json` et de les exécuter via la commande `yarn run`.

Exemple de section `scripts` dans `package.json` :

```json
"scripts": {
  "start": "node app.js",
  "test": "jest",
  "build": "webpack"
}
```

Vous pouvez exécuter les scripts comme ceci :

```bash
yarn start
yarn test
yarn build
```

Yarn permet aussi d'exécuter les scripts sans le mot-clé `run` :

```bash
yarn start
yarn test
yarn build
```

---

## 8. **Mettre à jour des packages**

Pour mettre à jour un package vers la dernière version, vous pouvez utiliser :

```bash
yarn upgrade <nom-du-package>
```

### **Mettre à jour un package spécifique :**

```bash
yarn upgrade react
```

### **Mettre à jour toutes les dépendances :**

```bash
yarn upgrade
```

---

## 9. **Workspaces**

Yarn supporte les **workspaces**, qui permettent de gérer plusieurs packages dans un même dépôt (monorepo). Les workspaces vous permettent de :

- Regrouper des packages liés.
- Partager des dépendances entre plusieurs packages.

Pour activer les workspaces, ajoutez la configuration suivante dans votre `package.json` :

```json
{
  "private": true,
  "workspaces": ["packages/*"]
}
```

Ensuite, vous pouvez gérer toutes les dépendances dans le monorepo avec Yarn, qui les centralisera automatiquement dans le dossier `node_modules` à la racine.

---

## 10. **Mode Hors-Ligne**

Yarn permet de travailler en **mode hors-ligne**, ce qui signifie que vous pouvez installer des packages même sans connexion Internet, à condition qu'ils aient déjà été installés au préalable.

Pour activer le mode hors-ligne :

```bash
yarn install --offline
```

Cela est particulièrement utile lorsque vous travaillez en avion ou dans un environnement avec une connexion Internet limitée.

---

## 11. **Mise en cache**

Yarn met en cache tous les packages qu'il télécharge, ce qui permet de gagner du temps lors des installations futures. Vous pouvez vider le cache si nécessaire avec la commande suivante :

```bash
yarn cache clean
```

Cela videra le cache de Yarn et obligera à télécharger à nouveau toutes les dépendances lors de la prochaine installation.

---

## 12. **Publier un package**

Pour publier un package sur le registre Yarn (qui utilise le même registre que NPM), vous pouvez utiliser la commande `yarn publish`. Assurez-vous que votre `package.json` contient les informations nécessaires (nom, version, etc.), et que vous êtes connecté au registre avec :

```bash
yarn login
```

Ensuite, pour publier votre package :

```bash
yarn publish
```

Yarn vous demandera la version (si vous ne l'avez pas mise à jour) et publiera le package sur le registre.

---

## 13. **Comparer Yarn à NPM**

- **Performance** : Yarn est généralement plus rapide que NPM grâce à son cache et à ses installations parallèles.
- **Fichier de verrouillage** : Yarn utilise `yarn.lock`, tandis que NPM utilise `package-lock.json`. Les deux ont le même objectif mais sous des formats différents.
- **Workspaces** : Yarn a un support natif pour les monorepos via les workspaces, tandis que NPM a ajouté un support similaire depuis la version 7.
- **Mode Hors-Ligne** : Yarn offre des capacités hors-ligne robustes, tandis que NPM nécessite une configuration supplémentaire pour cela.

---

## 14. **Raccourcis utiles**

- `yarn` : Installe toutes les dépendances listées dans `package.json`.
- `yarn add <nom-du-package>` : Ajoute un package au projet.
- `yarn add <nom-du-package> --dev` : Ajoute un package en tant que dépendance de développement.
- `yarn remove <nom-du-package>` : Supprime un package du projet.
- `yarn upgrade` : Met à jour toutes les dépendances vers leur dernière version.
- `yarn upgrade <nom-du-package>` : Met à jour un package spécifique.
- `yarn run <script>` : Exécute un script personnalisé défini dans `package.json`.
- `yarn login` : Se connecte à votre compte de registre.
- `yarn publish` : Publie le package sur le registre.

---

## Conclusion

Yarn est un outil puissant pour gérer les dépendances JavaScript et Node.js. Avec des fonctionnalités telles que des installations plus rapides, le support des workspaces, le mode hors-ligne et une gestion plus déterministe des dépendances, Yarn est un excellent choix pour les développeurs qui ont besoin d'un gestionnaire de paquets fiable. Sa compatibilité avec les registres NPM le rend facile à adopter, tandis que ses fonctionnalités uniques le distinguent pour les projets plus grands et les équipes.
