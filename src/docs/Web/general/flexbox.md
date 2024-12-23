---
category: Web > Html/CSS/JS
title: Flexbox
date: 2024-12-23
author: Romagny13
---

# Guide complet sur Flexbox

## Table des matières

1. [Introduction à Flexbox](#introduction-à-flexbox)
2. [Propriétés principales de Flexbox](#propriétés-principales-de-flexbox)
   - [display: flex](#display-flex)
   - [flex-direction](#flex-direction)
   - [flex-wrap](#flex-wrap)
   - [justify-content](#justify-content)
   - [align-items](#align-items)
   - [align-self](#align-self)
   - [flex-grow, flex-shrink, flex-basis](#flex-grow-flex-shrink-flex-basis)
   - [flex](#flex)
3. [Utilisation de Flexbox avec des Media Queries](#utilisation-de-flexbox-avec-des-media-queries)
4. [Bonnes pratiques et astuces](#bonnes-pratiques-et-astuces)
5. [Exemples pratiques](#exemples-pratiques)

---

## Introduction à Flexbox

**Flexbox** (Flexible Box Layout) est un modèle de mise en page qui permet de distribuer de l'espace entre les éléments d'un conteneur et de contrôler leur alignement de manière plus efficace que les techniques traditionnelles de mise en page CSS (comme les float ou les positionnements absolus). Flexbox est particulièrement utile pour créer des interfaces réactives et fluides.

---

## Propriétés principales de Flexbox

### **1. `display: flex`**

Cette propriété transforme un conteneur en un "flex container". Tous les éléments enfants de ce conteneur deviennent des "flex items", ce qui permet de les manipuler facilement en utilisant les autres propriétés Flexbox.

```css
.container {
  display: flex;
}
```

---

### **2. `flex-direction`**

Définit l'orientation des éléments enfants dans le conteneur.

- **`row`** (par défaut) : Les éléments sont disposés horizontalement.
- **`column`** : Les éléments sont disposés verticalement.
- **`row-reverse`** : Les éléments sont disposés horizontalement, mais dans l'ordre inverse.
- **`column-reverse`** : Les éléments sont disposés verticalement, mais dans l'ordre inverse.

```css
.container {
  display: flex;
  flex-direction: row; /* Par défaut */
}

@media (max-width: 600px) {
  .container {
    flex-direction: column; /* Sur petits écrans, les éléments deviennent verticaux */
  }
}
```

---

### **3. `flex-wrap`**

Contrôle le passage à la ligne des éléments dans le conteneur.

- **`nowrap`** (par défaut) : Les éléments restent sur une seule ligne.
- **`wrap`** : Les éléments passent à la ligne suivante si nécessaire.
- **`wrap-reverse`** : Comme `wrap`, mais l'ordre des lignes est inversé (les nouvelles lignes s'empilent du bas vers le haut).

```css
.container {
  display: flex;
  flex-wrap: wrap;
}
```

---

### **4. `justify-content`**

Alignement des éléments sur l'axe principal (horizontal, si `flex-direction: row`).

- **`flex-start`** : Aligne les éléments au début de l'axe.
- **`flex-end`** : Aligne les éléments à la fin de l'axe.
- **`center`** : Centre les éléments sur l'axe.
- **`space-between`** : Répartit les éléments avec l'espace égal entre eux, sans espace avant le premier ni après le dernier.
- **`space-around`** : Répartit les éléments avec de l'espace égal autour d'eux.
- **`space-evenly`** : Répartit les éléments avec un espace égal entre tous les éléments (y compris avant le premier et après le dernier).

```css
.container {
  display: flex;
  justify-content: center;
}
```

---

### **5. `align-items`**

Alignement des éléments sur l'axe transversal (vertical, si `flex-direction: row`).

- **`flex-start`** : Aligne les éléments au début de l'axe transversal.
- **`flex-end`** : Aligne les éléments à la fin de l'axe transversal.
- **`center`** : Centre les éléments sur l'axe transversal.
- **`baseline`** : Aligne les éléments sur la ligne de base du texte.
- **`stretch`** (par défaut) : Étire les éléments pour remplir l'axe transversal.

```css
.container {
  display: flex;
  align-items: center;
}
```

---

### **6. `align-self`**

Permet à un élément spécifique de s'aligner différemment des autres éléments sur l'axe transversal.

- Valeurs possibles : `auto`, `flex-start`, `flex-end`, `center`, `baseline`, `stretch`.

```css
.item {
  align-self: flex-end; /* Cet élément s'aligne à la fin de l'axe transversal */
}
```

---

### **7. `flex-grow`, `flex-shrink`, `flex-basis`**

- **`flex-grow`** : Détermine la capacité d'un élément à croître pour occuper l'espace disponible.
- **`flex-shrink`** : Détermine la capacité d'un élément à rétrécir si l'espace est insuffisant.
- **`flex-basis`** : Définit la taille de base de l'élément avant qu'il ne soit étendu ou réduit.

```css
.item {
  flex-grow: 1; /* L'élément peut grandir pour occuper l'espace */
  flex-shrink: 1; /* L'élément peut rétrécir si nécessaire */
  flex-basis: 200px; /* Taille initiale de 200px */
}
```

---

### **8. `flex`**

Un raccourci pour définir `flex-grow`, `flex-shrink`, et `flex-basis` en une seule ligne.

```css
.item {
  flex: 1 1 100px; /* grandir, rétrécir et taille de base de 100px */
}
```

---

## Utilisation de Flexbox avec des Media Queries

Flexbox peut être utilisé efficacement avec des **media queries** pour créer des mises en page réactives. Par exemple, tu peux utiliser `flex-direction: column` sur les petits écrans et `flex-direction: row` sur les grands écrans.

### Exemple de mise en page responsive :

```css
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.item {
  flex: 1 1 30%;
}

@media (max-width: 600px) {
  .container {
    flex-direction: column; /* Passer à une disposition verticale sur petits écrans */
  }

  .item {
    flex: 1 1 100%; /* Les éléments occupent toute la largeur sur petit écran */
  }
}
```

---

## Bonnes pratiques et astuces

1. **Utiliser `gap` pour espacer les éléments** : Utilise `gap` au lieu de `margin` pour espacer les éléments dans un conteneur `flex`. Cela rend le code plus propre et évite de devoir gérer les marges manuellement.

   ```css
   .container {
     display: flex;
     gap: 20px; /* Espacement entre les éléments */
   }
   ```

2. **Contrôler la croissance des éléments avec `flex-grow`** : Si tu veux que tes éléments prennent toute la largeur ou hauteur disponible de manière proportionnelle, utilise `flex-grow`.

3. **Alignement avec `justify-content` et `align-items`** : Pour aligner les éléments, utilise `justify-content` pour l'axe principal et `align-items` pour l'axe transversal. Cela permet de centrer ou d'espacer les éléments de manière cohérente.

4. **Eviter les débordements avec `flex-wrap`** : Utilise `flex-wrap: wrap` pour éviter que les éléments ne débordent du conteneur lorsque l'espace est insuffisant.

5. **Éviter d'utiliser trop de `flex-basis`** : Utilise `flex-basis` avec parcimonie, sauf si tu veux absolument définir une taille fixe initiale avant d'appliquer `flex-grow` et `flex-shrink`.

---

## Exemples pratiques

### **Exemple 1 : Disposition de navigation**

Barre de navigation avec des éléments en ligne sur grand écran, et en colonne sur petit écran.

```css
.nav {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

@media (max-width: 600px) {
  .nav {
    flex-direction: column; /* Les éléments deviennent verticaux sur petits écrans */
  }
}
```

---

### **Exemple 2 : Galerie d'images responsive**

Une galerie d'images où les images sont alignées horizontalement sur grand écran, puis passent à une disposition verticale sur les petits écrans.

```css
.container {
  display: flex;
  flex-wrap: wrap;
}

.item {
  flex: 1 1 30%;
  margin: 10px;
}

@media (max-width: 600px) {
  .item {
    flex: 1 1 100%;
  }
}
```

---

### Conclusion

Flexbox est une méthode très puissante pour construire des mises en page flexibles et réactives. En combinant les propriétés de Flexbox avec des **media queries**, tu peux créer des designs fluides qui s’adaptent à toutes les tailles d'écran.

N'hésite pas à expérimenter avec les différentes propriétés pour découvrir comment elles peuvent être utilisées pour créer des interfaces élégantes et bien structurées !
