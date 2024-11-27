---
category: Package Manager
title: NPM
date: 2024-11-26
author: Romagny13
---

# NPM (Node Package Manager)

## 1. **Installation de NPM**

### Installation de Node.js et NPM

NPM est livré avec **Node.js**, donc pour l'installer, vous devez d'abord installer Node.js. Pour cela, rendez-vous sur [le site officiel de Node.js](https://nodejs.org/) et téléchargez l'installateur adapté à votre système d'exploitation. Une fois Node.js installé, vous pouvez vérifier si NPM est également installé en exécutant la commande suivante dans le terminal :

```bash
node -v
npm -v
```

Cela vous montrera les versions respectives de Node.js et NPM.

---

## 2. **Création du fichier `package.json`**

Le fichier `package.json` est un fichier crucial dans un projet Node.js. Il contient des informations sur votre projet et ses dépendances.

### Initialisation d'un projet

Pour créer un fichier `package.json` dans votre projet, utilisez la commande suivante :

```bash
npm init
```

Cette commande vous pose une série de questions (nom du projet, version, description, entrée principale, etc.) et génère un fichier `package.json` basé sur vos réponses.

Si vous souhaitez ignorer les questions et utiliser les valeurs par défaut, utilisez la commande suivante :

```bash
npm init -y
```

Cela génère immédiatement un fichier `package.json` avec des valeurs par défaut.

---

## 3. **Ajouter des dépendances**

Les dépendances sont les bibliothèques ou modules que votre projet utilise.

### Ajouter une dépendance normale

Pour ajouter une dépendance à votre projet, utilisez la commande :

```bash
npm install <nom_du_package>
```

Cela télécharge le package et l'ajoute dans le fichier `package.json` sous la section `"dependencies"`. Exemple :

```bash
npm install express
```

Cela va installer **express** et mettre à jour votre `package.json` comme ceci :

```json
"dependencies": {
  "express": "^4.17.1"
}
```

### Ajouter une dépendance en tant que développement (dev dependency)

Les **devDependencies** sont des dépendances utilisées uniquement pendant le développement (par exemple, des outils de test, des outils de construction, etc.). Pour ajouter une devDependency, utilisez l'option `--save-dev` :

```bash
npm install <nom_du_package> --save-dev
```

Exemple :

```bash
npm install jest --save-dev
```

Cela va ajouter **jest** dans la section `"devDependencies"` du fichier `package.json` :

```json
"devDependencies": {
  "jest": "^26.6.0"
}
```

### Ajouter une dépendance sans mettre à jour `package.json`

Si vous voulez installer une dépendance mais ne pas l'ajouter dans `package.json`, vous pouvez utiliser l'option `--no-save` :

```bash
npm install <nom_du_package> --no-save
```

### Ajouter une dépendance à une version spécifique

Pour installer une version spécifique d'un package, vous pouvez préciser la version directement après le nom du package :

```bash
npm install <nom_du_package>@<version>
```

Exemple :

```bash
npm install express@4.16.0
```

### Gérer les versions avec des opérateurs

Les versions des packages sont gérées par des **semver (versionnement sémantique)**, et NPM utilise des opérateurs pour définir les versions compatibles :

- **Caret (`^`)** : Installe la version la plus récente compatible avec la version mineure spécifiée.
  - Exemple : `^1.2.3` installera la version la plus récente de la branche `1.x.x` (mais pas la version `2.x.x`).
- **Tilde (`~`)** : Installe la version la plus récente compatible avec la version patch spécifiée.
  - Exemple : `~1.2.3` installera la version la plus récente de la branche `1.2.x` (mais pas la version `1.3.0`).
- **Exact (`=`)** : Installe exactement la version spécifiée.
  - Exemple : `=1.2.3` installera la version `1.2.3`.

---

## 4. **Scripts NPM**

NPM vous permet de définir des **scripts** dans le fichier `package.json` pour automatiser des tâches courantes, comme les tests ou la construction du projet.

### Définir des scripts

Dans votre fichier `package.json`, vous pouvez ajouter une section `"scripts"` où vous définissez vos commandes :

```json
"scripts": {
  "start": "node app.js",
  "test": "jest",
  "build": "webpack --config webpack.config.js"
}
```

### Exécuter des scripts

Une fois que vous avez défini des scripts, vous pouvez les exécuter avec `npm run` :

```bash
npm run start
npm run test
npm run build
```

### Scripts prédéfinis

Il existe des scripts prédéfinis que NPM reconnaît :

- **`npm start`** : Utilisé pour démarrer l'application.
- **`npm test`** : Utilisé pour exécuter les tests.
- **`npm install`** : Exécuté lors de l'installation des dépendances.

---

## 5. **Publication d'un package sur NPM**

Si vous souhaitez partager votre projet ou module avec la communauté, vous pouvez le publier sur **npmjs.com**.

### Créer un compte NPM

Si vous n'avez pas encore de compte NPM, vous devez en créer un en vous rendant sur [npmjs.com](https://www.npmjs.com/). Une fois votre compte créé, connectez-vous en utilisant la commande suivante :

```bash
npm login
```

### Publier un package

Avant de publier, assurez-vous que le fichier `package.json` est correctement configuré, notamment les champs suivants :

- **name** : Nom de votre package (doit être unique sur NPM).
- **version** : Version du package (respecte le versionnement sémantique).

Pour publier le package, exécutez simplement :

```bash
npm publish
```

---

## 6. **Autres commandes utiles**

- **Mettre à jour un package** : Pour mettre à jour un package vers la dernière version compatible, utilisez :

  ```bash
  npm update <nom_du_package>
  ```

- **Supprimer un package** : Pour supprimer une dépendance de votre projet, utilisez :

  ```bash
  npm uninstall <nom_du_package>
  ```

- **Voir les informations sur un package** : Pour obtenir des informations détaillées sur un package installé, utilisez :

  ```bash
  npm info <nom_du_package>
  ```

- **Vérifier les vulnérabilités de sécurité** : Pour vérifier les vulnérabilités dans vos dépendances, exécutez :
  ```bash
  npm audit
  ```

---

## 7. **Exemples de fichiers `package.json`**

Voici un exemple complet de fichier `package.json` :

```json
{
  "name": "mon-projet",
  "version": "1.0.0",
  "description": "Un projet exemple",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "jest",
    "build": "webpack --config webpack.config.js"
  },
  "author": "Moi",
  "license": "MIT",
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "jest": "^26.6.0"
  }
}
```

---

## 8. **Résumé des commandes principales**

| Commande                           | Description                                   |
| ---------------------------------- | --------------------------------------------- |
| `npm init`                         | Crée un fichier `package.json`.               |
| `npm install <package>`            | Installe une dépendance et la sauvegarde.     |
| `npm install <package> --save-dev` | Installe une devDependency.                   |
| `npm run <script>`                 | Exécute un script défini dans `package.json`. |
| `npm publish`                      | Publie un package sur NPM.                    |
| `npm update`                       | Met à jour les dépendances.                   |
| `npm uninstall <package>`          | Désinstalle une dépendance.                   |

## 9. **Shortcuts**

Voici quelques **shortcuts** NPM utiles pour rendre votre travail plus rapide et plus efficace. Ces raccourcis sont des commandes courantes que vous pouvez utiliser à la place de commandes plus longues :

### 1. **`npm install` (alias `npm i`)**

Cette commande installe toutes les dépendances spécifiées dans votre fichier `package.json`.

**Raccourci :**

```bash
npm install      # Long format
npm i            # Raccourci
```

**Exemple :**

```bash
npm i express    # Installe express
```

### 2. **`npm install <package>` (alias `npm i <package>`)**

Pour installer une seule dépendance.

**Raccourci :**

```bash
npm install <package>  # Long format
npm i <package>        # Raccourci
```

**Exemple :**

```bash
npm i lodash           # Installe lodash
```

### 3. **`npm install --save-dev` (alias `npm i --save-dev`)**

Pour installer une dépendance comme **devDependency**.

**Raccourci :**

```bash
npm install --save-dev <package>  # Long format
npm i --save-dev <package>        # Raccourci
```

**Exemple :**

```bash
npm i --save-dev jest            # Installe jest comme devDependency
```

### 4. **`npm uninstall` (alias `npm un`)**

Pour désinstaller un package.

**Raccourci :**

```bash
npm uninstall <package>  # Long format
npm un <package>         # Raccourci
```

**Exemple :**

```bash
npm un express            # Désinstalle express
```

### 5. **`npm update` (alias `npm up`)**

Met à jour les packages installés à leur dernière version compatible.

**Raccourci :**

```bash
npm update <package>  # Long format
npm up <package>      # Raccourci
```

**Exemple :**

```bash
npm up lodash         # Met à jour lodash
```

### 6. **`npm run` (alias `npm r`)**

Pour exécuter un script défini dans votre `package.json`.

**Raccourci :**

```bash
npm run <script>  # Long format
npm r <script>    # Raccourci
```

**Exemple :**

```bash
npm r start       # Exécute le script "start"
```

### 7. **`npm test` (alias `npm t`)**

Pour exécuter les tests de votre projet.

**Raccourci :**

```bash
npm test  # Long format
npm t     # Raccourci
```

**Exemple :**

```bash
npm t     # Exécute les tests
```

### 8. **`npm cache clean` (alias `npm c`)**

Pour nettoyer le cache de NPM.

**Raccourci :**

```bash
npm cache clean   # Long format
npm c clean       # Raccourci
```

**Exemple :**

```bash
npm c clean       # Nettoie le cache
```

### 9. **`npm outdated` (alias `npm o`)**

Pour vérifier si des packages sont obsolètes.

**Raccourci :**

```bash
npm outdated  # Long format
npm o         # Raccourci
```

**Exemple :**

```bash
npm o         # Vérifie si des packages sont obsolètes
```

### 10. **`npm install -g` (alias `npm i -g`)**

Pour installer un package globalement (accessible dans tous les projets).

**Raccourci :**

```bash
npm install -g <package>  # Long format
npm i -g <package>        # Raccourci
```

**Exemple :**

```bash
npm i -g typescript       # Installe TypeScript globalement
```

### 11. **`npm init -y` (alias `npm i -y`)**

Pour initialiser un `package.json` avec des valeurs par défaut, sans poser de questions.

**Raccourci :**

```bash
npm init -y    # Long format
npm i -y       # Raccourci
```

**Exemple :**

```bash
npm i -y       # Crée un package.json avec des valeurs par défaut
```

---

### Résumé des principaux raccourcis

| Commande                   | Raccourci            | Description                                               |
| -------------------------- | -------------------- | --------------------------------------------------------- |
| `npm install`              | `npm i`              | Installer des dépendances                                 |
| `npm install <package>`    | `npm i <package>`    | Installer un package spécifique                           |
| `npm install --save-dev`   | `npm i --save-dev`   | Installer un package en tant que devDependency            |
| `npm uninstall`            | `npm un`             | Désinstaller un package                                   |
| `npm update`               | `npm up`             | Mettre à jour les packages                                |
| `npm run <script>`         | `npm r <script>`     | Exécuter un script dans `package.json`                    |
| `npm test`                 | `npm t`              | Exécuter les tests                                        |
| `npm cache clean`          | `npm c`              | Nettoyer le cache                                         |
| `npm outdated`             | `npm o`              | Vérifier les packages obsolètes                           |
| `npm install -g <package>` | `npm i -g <package>` | Installer un package globalement                          |
| `npm init -y`              | `npm i -y`           | Initialiser un `package.json` avec des valeurs par défaut |

---

Ces raccourcis NPM vous permettent de gagner du temps en réduisant la longueur des commandes tout en maintenant une syntaxe claire et cohérente.

## 10. Comparaison des gestionnaires de paquets : **NPM**, **Yarn**, et autres

### 1. **NPM (Node Package Manager)**

NPM est le gestionnaire de paquets officiel pour Node.js. Il est installé avec Node.js, et sa gestion de paquets repose sur un fichier `package.json` pour gérer les dépendances, les versions et les scripts.

#### Avantages de NPM :

- **Présence par défaut** : NPM est inclus avec Node.js, donc pas besoin de l'installer séparément.
- **Large écosystème** : NPM dispose d'une énorme bibliothèque de packages, car il est le gestionnaire de paquets le plus utilisé pour JavaScript.
- **Support officiel** : NPM a le support officiel de Node.js et est bien documenté.
- **Versions lockées** : Le fichier `package-lock.json` garantit que les mêmes versions de dépendances sont installées pour tous les utilisateurs et environnements.

#### Inconvénients de NPM :

- **Temps d'installation** : L'installation des dépendances peut parfois être plus lente que d'autres solutions comme Yarn.
- **Résolution des versions** : Bien que les versions lockées existent avec `package-lock.json`, la résolution des versions dans NPM peut être moins performante dans des projets complexes.

---

### 2. **Yarn**

Yarn est une alternative à NPM, développée par Facebook, qui se concentre sur la performance, la fiabilité et la sécurité. Son fonctionnement est similaire à NPM mais avec plusieurs améliorations, surtout en termes de rapidité d'installation et de gestion des versions.

#### Avantages de Yarn :

- **Installation plus rapide** : Yarn utilise un cache plus performant et parallélise les téléchargements, ce qui accélère l'installation des dépendances.
- **Fichier de verrouillage** : Yarn utilise un fichier `yarn.lock`, similaire à `package-lock.json` de NPM, mais il est parfois considéré comme plus fiable.
- **Workspaces** : Yarn prend en charge les workspaces, permettant de gérer plusieurs packages dans un même monorepo, ce qui est utile pour les projets complexes.
- **Sécurité** : Yarn vérifie l'intégrité des packages installés à l'aide de checksum.
- **Commandes simples** : Certaines commandes comme `yarn add` et `yarn remove` sont plus directes que celles de NPM.

#### Inconvénients de Yarn :

- **Nécessité d'une installation séparée** : Yarn n'est pas inclus par défaut avec Node.js, il doit être installé séparément.
- **Moins d'adoption universelle** : Bien que très populaire, Yarn est parfois moins utilisé que NPM, ce qui peut poser des problèmes dans certains environnements.

---

### 3. **PNPM**

PNPM est un autre gestionnaire de paquets qui a gagné en popularité pour sa gestion efficace du cache et sa gestion des dépendances de manière plus intelligente, ce qui réduit la consommation d'espace disque.

#### Avantages de PNPM :

- **Espace disque réduit** : PNPM stocke chaque version de dépendance dans un seul endroit sur votre machine, ce qui économise énormément d'espace disque pour les projets avec de nombreuses dépendances partagées.
- **Installation rapide** : Comme Yarn, PNPM installe les dépendances plus rapidement que NPM, grâce à son mécanisme de partage du cache.
- **Performances optimisées** : PNPM est conçu pour être très performant, en particulier pour les projets ayant de nombreuses dépendances.
- **Détection des erreurs** : PNPM génère des erreurs plus explicites lorsqu'un package est mal installé, facilitant ainsi le débogage.

#### Inconvénients de PNPM :

- **Moins d'adoption** : Bien que de plus en plus populaire, PNPM reste moins largement adopté que NPM et Yarn, donc certaines communautés et outils peuvent ne pas le supporter nativement.
- **Incompatibilité avec certains outils** : Certains outils ou bibliothèques peuvent ne pas être totalement compatibles avec PNPM, bien que cela devienne de moins en moins un problème avec le temps.

---

### Comparaison de l'utilisation : **Quand choisir NPM, Yarn ou PNPM ?**

| Caractéristique                 | **NPM**                                               | **Yarn**                                     | **PNPM**                                       |
| ------------------------------- | ----------------------------------------------------- | -------------------------------------------- | ---------------------------------------------- |
| **Vitesse d'installation**      | Moyenne                                               | Rapide                                       | Très rapide                                    |
| **Fichier de verrouillage**     | `package-lock.json`                                   | `yarn.lock`                                  | `pnpm-lock.yaml`                               |
| **Utilisation d'espace disque** | Peut être élevé avec des dépendances multiples        | Modéré                                       | Optimisé, très faible                          |
| **Sécurité**                    | Vérification de l'intégrité des paquets               | Vérification avec checksum                   | Vérification avec checksum                     |
| **Support des monorepos**       | Pas natif (mais possible avec des outils comme Lerna) | Workspaces natifs                            | Workspaces natifs                              |
| **Commodité des commandes**     | Commandes simples                                     | Commandes simples, mais quelques différences | Commandes simples, mais légèrement différentes |
| **Adoption**                    | Très répandu                                          | Très populaire dans les projets React        | De plus en plus populaire                      |
| **Compatibilité**               | Très bonne                                            | Très bonne                                   | En constante amélioration                      |

---

### 4. **Peut-on utiliser plusieurs gestionnaires de paquets ensemble ?**

En théorie, vous pouvez utiliser **NPM**, **Yarn**, et **PNPM** dans le même projet, mais cela n'est pas recommandé, car cela pourrait entraîner des conflits dans les fichiers de verrouillage (`package-lock.json`, `yarn.lock`, ou `pnpm-lock.yaml`). Il est préférable de choisir un seul gestionnaire de paquets par projet pour éviter ces conflits.

Cependant, vous pouvez, par exemple, utiliser **Yarn** ou **PNPM** pour l'installation et la gestion des dépendances tout en ayant **NPM** installé globalement pour certaines commandes spécifiques à NPM (par exemple pour certains outils ou scripts).

### 5. **Choisir le meilleur gestionnaire de paquets pour votre projet :**

- **Utilisez NPM** si vous cherchez à rester avec l'outil par défaut de Node.js sans installations supplémentaires et si vous ne travaillez pas avec des projets de grande taille ou de monorepos.
- **Utilisez Yarn** si vous voulez une installation plus rapide, des fonctionnalités comme les workspaces pour gérer des monorepos, et un outil mature soutenu par la communauté (par exemple pour les projets React).
- **Utilisez PNPM** si l'optimisation de l'espace disque est importante pour vous ou si vous travaillez sur de grands projets avec de nombreuses dépendances partagées.

---

### Conclusion

Tous ces gestionnaires de paquets (NPM, Yarn, PNPM) sont excellents et peuvent être utilisés en fonction de vos besoins spécifiques. **NPM** est généralement suffisant pour la majorité des projets. **Yarn** excelle pour les projets avec de nombreuses dépendances ou pour ceux qui ont besoin de fonctionnalités avancées comme les workspaces. **PNPM** est une excellente option pour les utilisateurs soucieux de l'optimisation des performances et de l'espace disque.
