---
category: GIT
title: Monorepos avec GIT
date: 2024-11-26
author: Romagny13
---

# Guide sur les **Monorepos** et leur gestion avec **Git**

## Qu'est-ce qu'un **Monorepo** ?

Un **monorepo** (abréviation de "Monolithic Repository") est un modèle de gestion de code source où plusieurs projets, modules ou services sont stockés dans un seul dépôt Git centralisé. Contrairement à un modèle traditionnel où chaque projet a son propre dépôt, un monorepo regroupe plusieurs projets dans un même espace de stockage.

Les **monorepos** sont utilisés par des entreprises de grande envergure comme **Google**, **Facebook**, et **Twitter**, qui gèrent des milliers de projets dans un seul dépôt pour améliorer la cohésion et simplifier la gestion des versions et des dépendances.

# Pourquoi utiliser un **Monorepo** ?

## Avantages

1. **Gestion centralisée** :

   - Tous les projets sont dans un même dépôt, ce qui facilite la gestion des versions et le partage de code. Par exemple, une bibliothèque partagée peut être utilisée par plusieurs projets sans avoir à gérer plusieurs dépendances ou versions dans des dépôts différents.

2. **Meilleure collaboration** :

   - Étant donné que tous les projets résident dans le même dépôt, les équipes de développement peuvent plus facilement collaborer et voir les changements de chaque autre équipe.

3. **Déploiement unifié** :

   - Un monorepo permet de gérer les builds et les déploiements de tous les projets en même temps, ce qui est pratique pour les grandes organisations avec des architectures microservices.

4. **Simplification des dépendances** :

   - Les dépendances entre les projets sont plus faciles à gérer puisqu'elles sont locales, et non pas basées sur des versions externes. Cela simplifie la gestion des versions et les mises à jour de dépendances.

5. **Refactorisation facilitée** :
   - Les refactorisations qui affectent plusieurs projets peuvent être effectuées en une seule fois dans le monorepo, ce qui réduit les risques de casser les autres projets.

## Inconvénients

1. **Scalabilité** :

   - Plus le monorepo devient grand, plus il peut être difficile à gérer. Git, bien qu’efficace pour de petits dépôts, peut avoir des problèmes de performance lorsqu'un dépôt devient extrêmement volumineux (en particulier dans des projets avec de nombreux commits et de nombreux fichiers).

2. **Gestion des conflits** :

   - Étant donné que plusieurs équipes peuvent travailler sur différentes parties du même code, les conflits entre les projets sont plus fréquents et peuvent nécessiter des outils et des processus spécifiques pour être gérés efficacement.

3. **Complexité des outils** :
   - Des outils supplémentaires (comme Lerna, Nx, ou Bazel) sont souvent nécessaires pour gérer le monorepo, notamment pour effectuer des builds et des tests dans des sous-ensembles spécifiques du code sans avoir à reconstruire tout le monorepo.

# Comment gérer un **Monorepo** avec **Git** ?

La gestion d'un monorepo avec Git peut être un défi, surtout lorsque plusieurs projets ou services sont stockés dans un seul dépôt. Cependant, il existe des pratiques et des outils qui peuvent aider à gérer ces défis efficacement.

## 1. **Organisation du dépôt**

La structure d’un monorepo peut varier, mais elle suit souvent un modèle similaire à celui-ci :

```
monorepo/
├── packages/              # Contient les projets ou services
│   ├── app1/              # Projet 1
│   ├── app2/              # Projet 2
│   ├── shared-lib/        # Bibliothèque partagée
├── scripts/               # Scripts d'automatisation pour build, tests, etc.
├── README.md              # Documentation du monorepo
└── package.json           # Fichier de gestion des dépendances globales
```

- **`packages/`** : Contient les projets et bibliothèques, chacun ayant son propre dossier.
- **`scripts/`** : Contient les scripts communs utilisés pour automatiser les tâches (tests, déploiement, etc.).
- **`package.json`** : Contient les dépendances communes pour tout le monorepo.

## 2. **Utilisation de Lerna ou Nx**

Pour gérer les dépendances et les builds dans un monorepo, des outils comme **Lerna** ou **Nx** sont couramment utilisés. Ces outils aident à automatiser les tâches de gestion de versions, de test et de déploiement dans un monorepo.

### Exemple avec **Lerna**

**Lerna** est un outil populaire pour la gestion des monorepos. Il permet de gérer des dépendances entre les projets et d'automatiser les versions.

#### Installation de Lerna

```bash
npm install -g lerna
```

#### Initialisation du monorepo avec Lerna

```bash
lerna init
```

Cela va initialiser un nouveau projet avec une structure de dépôt, y compris un fichier `lerna.json` pour la configuration, et un dossier `packages/` pour les projets.

#### Ajouter des packages

Tu peux ajouter des packages (projets ou bibliothèques) à ton monorepo :

```bash
lerna create app1
lerna create app2
lerna create shared-lib
```

Cela crée les dossiers correspondants dans `packages/` avec un fichier `package.json` pour chaque projet.

#### Gestion des dépendances entre projets

Si un projet dépend d’un autre projet dans le monorepo, tu peux l’ajouter comme dépendance locale. Par exemple, si `app1` dépend de `shared-lib`, tu peux faire :

```bash
lerna add shared-lib --scope=app1
```

Cela lie `shared-lib` en tant que dépendance locale dans `app1`.

#### Versioning et publication

Lerna permet également de gérer les versions des packages dans un monorepo.

```bash
lerna version
```

Cette commande met à jour les versions des packages, génère des tags Git, et crée un commit avec la nouvelle version.

## 3. **Automatisation avec des scripts**

Tu peux automatiser des tâches comme les builds et les tests en ajoutant des scripts dans ton fichier `package.json` global. Par exemple :

```json
{
  "scripts": {
    "bootstrap": "lerna bootstrap", // Installe les dépendances pour chaque package
    "test": "lerna run test", // Lance les tests dans chaque package
    "build": "lerna run build" // Lance le build pour chaque package
  }
}
```

Cela permet de lancer des actions dans tous les packages du monorepo.

## 4. **Exécution des tests et du build**

Tu peux exécuter des tests et des builds dans tous les projets en même temps :

```bash
lerna run test    # Exécute les tests dans tous les packages
lerna run build   # Exécute le build dans tous les packages
```

# Exemple de workflow avec **Git** et **Monorepo**

1. **Cloner le monorepo** :

```bash
git clone https://github.com/tonorganisation/monorepo.git
cd monorepo
```

2. **Ajouter ou modifier un projet** (par exemple, modifier `app1` ou ajouter une nouvelle fonctionnalité).

3. **Commit et push** :

```bash
git add .
git commit -m "feat: ajout d'une nouvelle fonctionnalité dans app1"
git push origin master
```

4. **Créer une nouvelle branche pour une fonctionnalité** :

```bash
git checkout -b feature/nouvelle-fonctionnalité
```

5. **Faire des modifications, puis commit et push** :

```bash
git add .
git commit -m "feat: ajout d'une nouvelle fonctionnalité"
git push origin feature/nouvelle-fonctionnalité
```

6. **Pull request et revue de code** : Ouvre une PR dans GitHub/GitLab pour revoir les modifications.

# Conclusion

Un **monorepo** est un moyen puissant de gérer plusieurs projets ou services au sein d’un même dépôt Git. Bien que la gestion d’un monorepo puisse être complexe, l'utilisation d'outils comme **Lerna** ou **Nx** permet d’automatiser la gestion des versions, des dépendances et des builds, facilitant ainsi le développement et la collaboration au sein de grandes équipes.

Les **monorepos** conviennent particulièrement aux grandes entreprises et aux équipes qui développent de nombreux services interdépendants, mais nécessitent des outils et des processus adaptés pour gérer la croissance du dépôt et éviter les problèmes de performance.
