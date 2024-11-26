---
category: Web > React
title: CRA vs Vite
date: 2024-11-26
author: Romagny13
---

# **Comparatif : Create React App (CRA) vs Vite.js**

Voici un comparatif complet entre **Create React App (CRA)** et **Vite.js**, deux outils populaires pour créer et développer des applications React.

---

## **1. Introduction**

### **Create React App (CRA)**

- CRA est l'outil standard fourni par l'équipe React pour initialiser rapidement un projet.
- Il configure automatiquement Webpack et Babel pour gérer les besoins de développement React.

### **Vite.js**

- Vite est un bundler moderne, développé par l'équipe Vue.js, qui utilise **ESBuild** pour une compilation rapide et le **module système ES (ESM)** pour optimiser le développement.

---

## **2. Comparaison des Caractéristiques**

| **Critère**                      | **Create React App (CRA)**                                      | **Vite.js**                                                     |
| -------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| **Performance**                  | Développement plus lent avec Webpack.                           | Chargements très rapides grâce à ESBuild.                       |
| **Temps d'Initialisation**       | Temps relativement long (installation des dépendances Webpack). | Très rapide grâce à une configuration légère.                   |
| **Simplicité**                   | Configuration facile mais monolithique.                         | Très simple avec la flexibilité de configurer Rollup si besoin. |
| **Support TypeScript**           | Prêt à l'emploi.                                                | Prêt à l'emploi, avec des temps de compilation réduits.         |
| **HMR (Hot Module Replacement)** | Relativement lent.                                              | HMR ultra rapide et efficace.                                   |
| **Support ESM**                  | Support limité par Webpack.                                     | Natif grâce au système de modules ES.                           |
| **Plugins**                      | Basé sur Webpack, avec un écosystème riche.                     | Basé sur Rollup, offre un écosystème moderne.                   |
| **Production Build**             | Utilise Webpack pour des builds lourds.                         | Utilise Rollup, offrant un résultat plus léger et rapide.       |

---

## **3. Forces et Faiblesses**

### **Create React App (CRA)**

#### **Forces**

1. **Support Officiel** : Maintenu par l'équipe React, parfaitement intégré.
2. **Documentation Étendue** : Grande communauté, nombreuses ressources en ligne.
3. **Prêt à l'Emploi** : Configuration "zero-config" pour les débutants.

#### **Faiblesses**

1. **Performance Lente** : Le développement souffre de latences, particulièrement sur de grands projets.
2. **Manque de Flexibilité** : Difficile de personnaliser sans éjecter (`eject`).
3. **Technologie Vieillissante** : Webpack est moins performant comparé à ESBuild.

---

### **Vite.js**

#### **Forces**

1. **Performance Élevée** : Développement rapide grâce à ESBuild.
2. **HMR Avancé** : Les modifications sont appliquées presque instantanément.
3. **Build Léger et Rapide** : Utilise Rollup pour optimiser la taille des bundles.
4. **Flexibilité** : Facilement configurable pour des projets avancés.

#### **Faiblesses**

1. **Moins Populaire** : Moins de tutoriels et de ressources comparé à CRA.
2. **Courbe d'Apprentissage** : Peut nécessiter des ajustements pour des intégrations complexes.

---

## **4. Cas d'Utilisation**

### **Quand Utiliser CRA**

1. Débutants en React : Facilité d'installation et de démarrage.
2. Projets éducatifs ou prototypes.
3. Développeurs cherchant une solution standardisée et intégrée.

### **Quand Utiliser Vite.js**

1. Projets nécessitant des builds rapides (prototypes ou production).
2. Applications complexes où la performance est critique.
3. Développeurs familiers avec Rollup ou des configurations avancées.

---

## **5. Exemple Pratique**

### **Initialiser un Projet avec CRA**

```bash
npx create-react-app my-app
cd my-app
npm start
```

### **Initialiser un Projet avec Vite.js**

```bash
npm create vite@latest my-app --template react
cd my-app
npm install
npm run dev
```

---

## **6. Performance : Benchmarks**

### **Tests sur un Projet Type**

| **Aspect**                 | **CRA**                        | **Vite.js**              |
| -------------------------- | ------------------------------ | ------------------------ |
| **Temps d'Initialisation** | ~30 secondes                   | ~5 secondes              |
| **Démarrage en Dev**       | ~5 secondes (Webpack HMR lent) | ~300ms (grâce à ESBuild) |
| **Taille du Build Final**  | Environ 1.2 MB                 | Environ 800 KB           |
| **Rechargement HMR**       | ~2 secondes                    | Instantané (<200ms)      |

---

## **7. Alternatives**

1. **Next.js**
   - Parfait pour les projets React avec rendu côté serveur (SSR).
   - Intégré à Vercel pour des déploiements faciles.
2. **Parcel**

   - Alternative simple et rapide à Webpack.
   - Pas aussi performant que Vite pour les projets modernes.

3. **Snowpack**
   - Supporte aussi le système ESM, mais perd en popularité face à Vite.

---

## **8. Conclusion**

| **Choix Idéal**            | **Pourquoi Choisir ?**                                       |
| -------------------------- | ------------------------------------------------------------ |
| **Create React App (CRA)** | Idéal pour les débutants ou les projets simples.             |
| **Vite.js**                | Meilleur choix pour la performance et les projets complexes. |

En résumé, **CRA** est excellent pour les développeurs novices et les projets standardisés, tandis que **Vite.js** est une solution moderne et performante adaptée aux développeurs cherchant un outil rapide et flexible.

## **9. Les Variables d'Environnement et Avantages de Vite.js**

---

### **1. Variables d'Environnement dans Vite.js**

Vite.js offre un système intégré et simple pour gérer les variables d'environnement, qui sont essentielles pour configurer des comportements spécifiques à des environnements comme le développement, la pré-production, ou la production.

### **Définir des Variables d'Environnement**

1. **Fichier `.env`**

   - Créez des fichiers `.env` dans le dossier racine pour chaque environnement :
     - `.env` : Valeurs par défaut.
     - `.env.development` : Spécifique au développement.
     - `.env.production` : Spécifique à la production.

2. **Format des Variables**

   - Les variables d'environnement doivent être préfixées par `VITE_` pour être accessibles dans l'application.
     ```env
     VITE_API_URL=https://api.example.com
     VITE_FEATURE_FLAG=true
     ```

3. **Utilisation dans le Code**
   - Les variables sont accessibles via `import.meta.env`.
     ```javascript
     console.log(import.meta.env.VITE_API_URL); // https://api.example.com
     console.log(import.meta.env.VITE_FEATURE_FLAG); // true
     ```

### **Avantages**

- **Sécurisation** : Les variables ne sont pas exposées par défaut dans le bundle final (sauf celles préfixées par `VITE_`).
- **Facilité de Configuration** : Différents fichiers `.env` pour chaque environnement.
- **Flexibilité** : Intégration fluide avec les outils modernes comme Docker ou CI/CD.

### **2. Utilisation des Variables d'Environnement avec Create React App (CRA)**

Avec **Create React App** (CRA), la gestion des variables d'environnement est simple mais légèrement différente de celle de Vite.js. Voici un guide pour configurer et utiliser ces variables efficacement.

---

## **1. Définir des Variables d'Environnement**

### **1.1. Créer des Fichiers `.env`**

Comme pour Vite, CRA utilise des fichiers `.env` placés dans la racine du projet pour configurer des variables spécifiques à chaque environnement :

- **`.env`** : Valeurs par défaut pour tous les environnements.
- **`.env.development`** : Spécifique au mode développement.
- **`.env.production`** : Spécifique au mode production.
- **`.env.test`** : Spécifique aux tests.

---

### **1.2. Format des Variables**

- **Préfixe Obligatoire** : Toutes les variables d'environnement doivent commencer par `REACT_APP_`.

  ```env
  REACT_APP_API_URL=https://api.example.com
  REACT_APP_FEATURE_FLAG=true
  ```

- Les variables qui ne respectent pas ce préfixe ne seront pas injectées dans l'application.

---

## **2. Utiliser les Variables dans le Code**

### **Accès aux Variables**

Dans votre code, utilisez `process.env` pour accéder aux variables définies :

```javascript
console.log(process.env.REACT_APP_API_URL); // https://api.example.com
console.log(process.env.REACT_APP_FEATURE_FLAG); // true
```

---

### **Exemple Complet**

1. **Configuration dans `.env`**

   ```env
   REACT_APP_API_URL=https://api.example.com
   REACT_APP_API_KEY=123456
   ```

2. **Utilisation dans un Composant**

   ```javascript
   const apiUrl = process.env.REACT_APP_API_URL;
   const apiKey = process.env.REACT_APP_API_KEY;

   console.log(`L'URL de l'API est : ${apiUrl}`);
   console.log(`La clé de l'API est : ${apiKey}`);
   ```

---

## **3. Bonnes Pratiques**

### **3.1. Sécurisation**

- **Attention :** Les variables d'environnement sont injectées dans le code côté client, ce qui signifie qu'elles sont accessibles dans le bundle final et visibles par tous. Évitez d'y inclure des informations sensibles comme des mots de passe ou des clés secrètes.

### **3.2. Fichiers Git**

- Ajoutez le fichier `.env` à votre `.gitignore` pour éviter de commiter accidentellement vos variables sensibles :
  ```
  # Fichier .gitignore
  .env
  ```

### **3.3. Différenciation des Environnements**

- Utilisez des fichiers `.env` spécifiques (`.env.development`, `.env.production`) pour gérer les configurations selon l'environnement :

  ```env
  # .env.development
  REACT_APP_API_URL=http://localhost:3000

  # .env.production
  REACT_APP_API_URL=https://api.example.com
  ```

---

## **4. Avantages et Limitations de CRA par Rapport à Vite.js**

| **Aspect**                   | **CRA (Create React App)**                              | **Vite.js**                                               |
| ---------------------------- | ------------------------------------------------------- | --------------------------------------------------------- |
| **Préfixe**                  | Obligatoire : `REACT_APP_`                              | Obligatoire : `VITE_`.                                    |
| **Accès aux Variables**      | Via `process.env`                                       | Via `import.meta.env`.                                    |
| **Sécurité des Variables**   | Injectées dans le bundle final                          | Similaire, mais `import.meta.env` est plus spécifique.    |
| **Simplicité**               | Facile, mais manque de flexibilité                      | Plus flexible et moderne.                                 |
| **Fonctionnalités Avancées** | Non pris en charge directement (e.g., import dynamique) | Support d'`import.meta.glob` pour des imports dynamiques. |

---

## **5. Limites des Variables d'Environnement avec CRA**

1. **Chargement Static** : Les variables sont injectées uniquement au moment du build. Vous devez redémarrer le serveur si vous modifiez un fichier `.env`.

2. **Pas de Fonctionnalités Avancées** : Contrairement à Vite.js, CRA ne supporte pas directement des outils comme `import.meta.glob` pour importer dynamiquement des fichiers.

---

## **Conclusion**

La gestion des variables d'environnement avec CRA est simple et efficace pour les projets standards. Cependant, si vous avez besoin de fonctionnalités avancées comme les imports dynamiques ou une meilleure performance globale, **Vite.js** peut être une alternative intéressante.

**CRA reste une solution solide pour les débutants et les projets nécessitant une configuration minimale, tandis que Vite.js excelle pour les projets modernes nécessitant des performances accrues et une flexibilité maximale.**
