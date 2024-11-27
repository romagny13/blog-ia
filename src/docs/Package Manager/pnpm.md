---
category: Package Manager
title: PNPM
date: 2024-11-26
author: Romagny13
---

# Guide de PNPM

PNPM (Performant Node Package Manager) est un gestionnaire de paquets rapide et efficace pour les projets Node.js. Contrairement à NPM et Yarn, PNPM utilise une approche de stockage centralisé des dépendances, ce qui permet d'économiser de l'espace disque et d'accélérer les installations. Ce guide vous expliquera comment installer et utiliser PNPM, gérer les dépendances, et explorer ses fonctionnalités utiles.

---

## 1. **Installation**

PNPM peut être installé de différentes manières, selon votre environnement.

### **Via NPM (si NPM est déjà installé) :**

```bash
npm install -g pnpm
```

### **Via Homebrew (macOS et Linux) :**

```bash
brew install pnpm
```

### **Via un script d'installation (Linux) :**

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### **Via l'installateur Windows :**

Téléchargez l'installateur depuis [https://pnpm.io/](https://pnpm.io/).

---

## 2. **Créer un fichier `package.json`**

Pour commencer à utiliser PNPM, vous devez d'abord avoir un projet Node.js avec un fichier `package.json`. Vous pouvez générer ce fichier en exécutant la commande suivante :

```bash
pnpm init
```

Cela vous guidera à travers la configuration de votre fichier `package.json`. Si vous voulez sauter toutes les étapes et accepter les valeurs par défaut, vous pouvez exécuter :

```bash
pnpm init -y
```

---

## 3. **Ajouter des dépendances**

Avec PNPM, l'ajout de dépendances est similaire à NPM et Yarn, mais avec une gestion de cache et un stockage plus efficace.

### **Installer un package spécifique :**

```bash
pnpm add <nom-du-package>
```

Exemple :

```bash
pnpm add react
```

### **Installer une version spécifique d'un package :**

```bash
pnpm add <nom-du-package>@<version>
```

Exemple :

```bash
pnpm add react@17.0.0
```

### **Installer un package en tant que dépendance de développement :**

```bash
pnpm add <nom-du-package> --save-dev
```

Exemple :

```bash
pnpm add eslint --save-dev
```

---

## 4. **Installer toutes les dépendances**

Lorsque vous clonez un projet ou que vous avez un fichier `package.json` mis à jour, vous pouvez installer toutes les dépendances en exécutant :

```bash
pnpm install
```

Cette commande installera toutes les dépendances nécessaires en utilisant un mécanisme de **liens symboliques** pour économiser de l'espace disque.

---

## 5. **Supprimer des dépendances**

Pour supprimer une dépendance de votre projet, utilisez la commande suivante :

```bash
pnpm remove <nom-du-package>
```

Exemple :

```bash
pnpm remove react
```

Cela supprimera le package et l'enlèvera de votre `package.json`.

---

## 6. **Contrôle des versions des dépendances**

PNPM utilise également un fichier de verrouillage appelé `pnpm-lock.yaml`, qui permet de garantir que les installations futures se fassent avec les mêmes versions exactes des dépendances. Ce fichier est automatiquement créé lors de l'exécution de la commande `pnpm install`.

### **Avantages du fichier de verrouillage :**

- Assure que toutes les installations sont cohérentes, même entre différentes machines.
- Permet une gestion précise des versions.

Commettez toujours le fichier `pnpm-lock.yaml` dans votre gestionnaire de version pour garantir la cohérence des dépendances.

---

## 7. **Exécuter des scripts**

PNPM vous permet de définir des scripts dans votre `package.json`, comme NPM et Yarn. Pour les exécuter, vous utilisez la commande `pnpm run`.

Exemple de section `scripts` dans `package.json` :

```json
"scripts": {
  "start": "node app.js",
  "test": "jest",
  "build": "webpack"
}
```

Pour exécuter ces scripts, utilisez les commandes suivantes :

```bash
pnpm start
pnpm test
pnpm build
```

---

## 8. **Mettre à jour des packages**

PNPM permet de mettre à jour les dépendances de manière simple. Pour mettre à jour un package spécifique à sa dernière version :

```bash
pnpm update <nom-du-package>
```

### **Mettre à jour toutes les dépendances :**

```bash
pnpm update
```

Cela mettra à jour toutes les dépendances dans votre projet à leur dernière version compatible.

---

## 9. **Travail avec des Workspaces (Monorepo)**

PNPM supporte les **workspaces**, qui permettent de gérer plusieurs packages au sein d'un même projet (monorepo). Cela est particulièrement utile pour les projets qui contiennent plusieurs sous-modules ou packages.

Pour utiliser les workspaces avec PNPM, vous devez configurer votre `package.json` à la racine du projet avec la configuration suivante :

```json
{
  "private": true,
  "workspaces": ["packages/*"]
}
```

Ensuite, vous pouvez ajouter des dépendances, installer des packages et exécuter des scripts à travers tous les sous-projets dans le monorepo de manière centralisée.

---

## 10. **Mise en cache et stockage efficace**

L'une des principales caractéristiques de PNPM est son **stockage global centralisé** des dépendances. Lorsqu'un package est installé, PNPM le télécharge et le place dans un cache centralisé (généralement dans le dossier `~/.pnpm-store`). Puis, au lieu de dupliquer les dépendances dans chaque projet, PNPM utilise des **liens symboliques** pour partager les packages entre les projets.

Cela permet de réduire considérablement l'espace disque utilisé et d'accélérer les installations futures.

### **Vider le cache de PNPM :**

Si vous avez besoin de vider le cache, utilisez la commande suivante :

```bash
pnpm store prune
```

---

## 11. **Mode hors-ligne**

PNPM permet d'installer des dépendances sans connexion Internet, tant que les packages ont déjà été téléchargés une fois et sont présents dans le cache global.

Pour installer en mode hors-ligne :

```bash
pnpm install --offline
```

Cela vous permet de continuer à travailler sur votre projet sans dépendre d'une connexion Internet active, ce qui est particulièrement utile dans des environnements de travail avec une connexion limitée.

---

## 12. **Publier un package**

PNPM vous permet de publier vos propres packages sur le registre NPM, tout comme NPM ou Yarn. Pour publier un package, vous devez vous connecter à votre compte NPM :

```bash
pnpm login
```

Ensuite, vous pouvez publier votre package :

```bash
pnpm publish
```

Cela publiera votre package sur le registre NPM et le rendra disponible pour d'autres utilisateurs.

---

## 13. **Comparer PNPM à NPM et Yarn**

- **Performance** : PNPM est plus rapide que NPM grâce à son système de cache et à l'utilisation des liens symboliques. Il est également plus efficace en termes d'espace disque.
- **Gestion des dépendances** : Contrairement à NPM et Yarn, PNPM ne duplique pas les dépendances dans chaque projet. Il utilise un cache global et des liens symboliques, ce qui permet de gagner de l'espace disque.
- **Compatibilité** : PNPM est compatible avec les registres NPM, ce qui signifie que vous pouvez l'utiliser avec les mêmes packages et le même registre.
- **Workspaces** : Comme Yarn, PNPM prend en charge les workspaces, ce qui permet de gérer facilement un monorepo.
- **Mode Hors-ligne** : PNPM offre une prise en charge native du mode hors-ligne, tout comme Yarn.

---

## 14. **Raccourcis utiles**

- `pnpm add <package>` : Ajoute une dépendance au projet.
- `pnpm add <package> --save-dev` : Ajoute une dépendance de développement.
- `pnpm install` : Installe toutes les dépendances listées dans `package.json`.
- `pnpm remove <package>` : Supprime une dépendance du projet.
- `pnpm update` : Met à jour toutes les dépendances.
- `pnpm run <script>` : Exécute un script défini dans `package.json`.
- `pnpm login` : Connecte-vous à votre compte NPM.
- `pnpm publish` : Publie votre package sur le registre NPM.
- `pnpm store prune` : Vide le cache PNPM.

---

## Conclusion

PNPM est un gestionnaire de paquets performant et efficace qui se distingue par sa gestion centralisée des dépendances et sa rapidité. Il offre de nombreux avantages en termes de stockage et de performance par rapport à NPM et Yarn, et est particulièrement adapté aux projets avec plusieurs sous-modules (monorepos). Sa compatibilité avec NPM en fait une excellente alternative pour les développeurs souhaitant un gestionnaire de paquets moderne et optimisé.
