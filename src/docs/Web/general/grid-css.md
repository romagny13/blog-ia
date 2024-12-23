---
category: Web > Html/CSS/JS
title: CSS Grid
date: 2024-12-23
author: Romagny13
---

# Guide complet sur CSS Grid

## Table des matières

1. [Introduction à CSS Grid](#introduction-à-css-grid)
2. [Propriétés principales de CSS Grid](#propriétés-principales-de-css-grid)
   - [display: grid](#display-grid)
   - [grid-template-columns et grid-template-rows](#grid-template-columns-et-grid-template-rows)
   - [grid-gap](#grid-gap)
   - [grid-column et grid-row](#grid-column-et-grid-row)
   - [justify-items, align-items, justify-content, et align-content](#justify-items-align-items-justify-content-et-align-content)
   - [grid-template-areas](#grid-template-areas)
3. [Comparer Grid et Flexbox](#comparer-grid-et-flexbox)
   - [Quand utiliser Grid](#quand-utiliser-grid)
   - [Quand utiliser Flexbox](#quand-utiliser-flexbox)
   - [Cas pratiques pour chaque modèle](#cas-pratiques-pour-chaque-modèle)
4. [Exemples pratiques](#exemples-pratiques)
5. [Bonnes pratiques et astuces](#bonnes-pratiques-et-astuces)

---

## Introduction à CSS Grid

**CSS Grid Layout** est un système de mise en page à deux dimensions (lignes et colonnes) qui permet de positionner des éléments sur une grille. Contrairement à **Flexbox**, qui est un modèle à une seule dimension (horizontal ou vertical), **Grid** permet de contrôler à la fois les lignes et les colonnes d'une grille, ce qui le rend plus adapté aux mises en page complexes.

---

## Propriétés principales de CSS Grid

### **1. `display: grid`**

Cette propriété transforme un conteneur en un "grid container", et les éléments enfants deviennent des "grid items". Contrairement à Flexbox, où les éléments sont automatiquement disposés en ligne ou en colonne, avec Grid, tu définis explicitement la structure de la grille.

```css
.container {
  display: grid;
}
```

---

### **2. `grid-template-columns` et `grid-template-rows`**

Ces propriétés définissent le nombre de colonnes et de lignes de la grille, ainsi que leur taille.

- **`grid-template-columns`** : Définit la largeur des colonnes.
- **`grid-template-rows`** : Définit la hauteur des lignes.

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 3 colonnes égales */
  grid-template-rows: 100px 200px; /* 2 lignes de tailles différentes */
}
```

- **`fr`** (fractional unit) : Permet de répartir l'espace disponible de manière proportionnelle entre les colonnes ou lignes.

---

### **3. `grid-gap`**

Définit l'espace entre les éléments de la grille, à la fois entre les colonnes et les lignes.

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px; /* Espace de 20px entre les éléments de la grille */
}
```

---

### **4. `grid-column` et `grid-row`**

Ces propriétés permettent de contrôler où un élément spécifique commence et se termine sur la grille.

- **`grid-column`** : Spécifie la colonne de départ et de fin.
- **`grid-row`** : Spécifie la ligne de départ et de fin.

```css
.item {
  grid-column: 1 / 3; /* L'élément s'étend de la colonne 1 à 3 */
  grid-row: 2 / 4; /* L'élément s'étend de la ligne 2 à 4 */
}
```

---

### **5. `justify-items`, `align-items`, `justify-content`, et `align-content`**

Ces propriétés permettent de contrôler l'alignement des éléments sur la grille :

- **`justify-items`** : Aligne les éléments horizontalement dans leurs cellules.
- **`align-items`** : Aligne les éléments verticalement dans leurs cellules.
- **`justify-content`** : Aligne tous les éléments de la grille horizontalement.
- **`align-content`** : Aligne tous les éléments de la grille verticalement.

```css
.container {
  display: grid;
  justify-items: center; /* Centre les éléments horizontalement */
  align-items: center; /* Centre les éléments verticalement */
}
```

---

### **6. `grid-template-areas`**

Cette propriété permet de nommer des zones dans la grille, ce qui facilite le placement des éléments sans avoir à spécifier explicitement les lignes et les colonnes.

```css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "main sidebar sidebar"
    "footer footer footer";
}

.header {
  grid-area: header;
}

.main {
  grid-area: main;
}

.sidebar {
  grid-area: sidebar;
}

.footer {
  grid-area: footer;
}
```

---

## Comparer Grid et Flexbox

### **Quand utiliser Grid**

- **Mises en page à deux dimensions** : Grid est idéal pour les mises en page complexes où tu as besoin de contrôler à la fois les lignes et les colonnes.
- **Disposition de contenu avec des zones définies** : Si tu as une structure de contenu claire avec des zones spécifiques (comme un en-tête, un contenu principal, et un pied de page), Grid avec `grid-template-areas` est une excellente solution.
- **Grilles asymétriques** : Si tu as des tailles de colonnes ou de lignes qui varient de manière significative, Grid te permet de définir des tailles précises pour chaque ligne et colonne.

### **Quand utiliser Flexbox**

- **Mises en page à une dimension** : Flexbox est plus adapté pour les dispositions linéaires, où les éléments doivent s'aligner soit horizontalement, soit verticalement.
- **Alignement simple** : Si tu veux simplement centrer des éléments ou les espacer dans une direction, Flexbox est généralement plus simple et plus rapide à mettre en place.
- **Dispositions flexibles et réactives** : Flexbox est parfait pour les mises en page où les éléments doivent occuper une largeur ou une hauteur flexible, en fonction de l'espace disponible.

---

### **Cas pratiques pour chaque modèle**

| **Cas**                                                          | **Flexbox**                          | **Grid**                                                                     |
| ---------------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------- |
| **Barre de navigation**                                          | Alignement horizontal des liens      | Peut être utilisé, mais plus complexe pour ce cas simple                     |
| **Galerie d'images**                                             | Alignement en ligne ou en colonne    | Très adapté pour les grilles d'images avec différentes tailles               |
| **Disposition de formulaire**                                    | Flexbox est souvent plus simple      | Grid peut être plus efficace pour aligner des champs de formulaire complexes |
| **Mise en page avec en-tête, contenu principal et pied de page** | Peut être compliqué sans `flex-wrap` | Idéal, avec `grid-template-areas` pour définir des zones spécifiques         |

---

## Exemples pratiques

### **Exemple 1 : Mise en page de base avec Grid**

```css
.container {
  display: grid;
  grid-template-columns: 1fr 3fr; /* 2 colonnes, la deuxième est trois fois plus large */
  grid-template-rows: auto 100px; /* La première ligne est automatique, la deuxième fait 100px */
  grid-gap: 10px;
}

.header {
  grid-column: 1 / -1; /* L'élément s'étend sur toute la largeur */
}

.main {
  grid-column: 2 / 3;
}

.sidebar {
  grid-column: 1 / 2;
}

.footer {
  grid-column: 1 / -1;
}
```

### **Exemple 2 : Mises en page complexes avec Grid et `grid-template-areas`**

```css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: auto 1fr auto;
  grid-gap: 20px;
}

.header {
  grid-area: header;
}

.sidebar {
  grid-area: sidebar;
}

.main {
  grid-area: main;
}

.footer {
  grid-area: footer;
}
```

---

## Bonnes pratiques et astuces

1. **Utiliser `fr` pour des mises en page flexibles** : Les unités `fr` (fractionnelles) permettent de répartir l'espace de manière fluide entre les colonnes et les lignes.
2. **Combiner Grid et Flexbox** : Tu peux utiliser Flexbox à l'intérieur des cellules de Grid pour gérer les éléments dans une cellule, ce qui permet de tirer parti des deux modèles.

3. **Utiliser `grid-template-areas` pour des mises en page faciles à comprendre** : Nomme les zones dans la grille pour une gestion plus facile de la disposition des éléments.

4. **Contrôler les espacements avec `grid-gap`** : Utilise cette propriété pour définir les espaces entre les lignes et les colonnes sans avoir à gérer les marges individuellement.

5. **Limiter la complexité avec Grid** : Pour des mises en page simples, Flexbox est généralement plus simple. Utilise Grid pour des structures complexes avec des lignes et des colonnes bien définies.

---

### Conclusion

**CSS Grid** et **Flexbox** sont deux outils puissants pour la mise en page en CSS, mais ils sont conçus pour des cas d'usage différents. Grid est parfait pour les mises en page à deux dimensions, tandis que Flexbox est idéal pour des mises en page plus simples et linéaires. En fonction de tes besoins, tu peux utiliser l'un ou l'autre, ou même les combiner pour tirer le meilleur parti de chaque modèle.
