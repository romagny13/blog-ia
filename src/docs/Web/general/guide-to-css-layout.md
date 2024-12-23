---
category: Web > Html/CSS/JS
title: CSS Layout
date: 2024-12-23
author: Romagny13
---

# Guide des anciennes méthodes de mise en page en CSS

## Table des matières
1. [Introduction](#introduction)
2. [Utilisation de `float`](#utilisation-de-float)
   - [Float pour les colonnes](#float-pour-les-colonnes)
   - [Problèmes liés au float](#problèmes-liés-au-float)
   - [Conteneur clearfix](#conteneur-clearfix)
3. [Utilisation de `position` (absolu et relatif)](#utilisation-de-position-absolu-et-relatif)
4. [Mise en page avec les tableaux](#mise-en-page-avec-les-tableaux)
5. [Les astuces avec `inline-block`](#les-astuces-avec-inline-block)
6. [Bonnes pratiques de l'époque](#bonnes-pratiques-de-lépoque)
7. [Comparaison avec Flexbox et Grid](#comparaison-avec-flexbox-et-grid)

---

## Introduction

Avant l'ère de **Flexbox** et de **CSS Grid**, les développeurs utilisaient plusieurs techniques pour créer des mises en page complexes. Ces méthodes étaient souvent sujettes à des contournements et des hacks, et leur maintenance était parfois difficile. Cependant, elles ont permis de réaliser des mises en page variées avant l'introduction des modèles modernes.

---

## Utilisation de `float`

### **Float pour les colonnes**

L'une des premières techniques de mise en page utilisée en CSS était l'utilisation de la propriété **`float`**. Elle permettait de placer des éléments côte à côte, souvent pour créer des colonnes ou des structures de type "grille".

```css
.container {
  width: 100%;
}

.column {
  float: left;
  width: 50%;
  padding: 10px;
}
```

Dans cet exemple, deux éléments `.column` sont placés côte à côte avec **50%** de largeur chacun. Le **float** permettait de retirer ces éléments du flux normal du document et de les aligner à gauche.

### **Problèmes liés au float**

L'utilisation de **float** pour la mise en page comportait plusieurs problèmes :

1. **Conteneur flottant** : Le conteneur parent n'accepte pas la hauteur des éléments flottants, ce qui peut entraîner un problème d'affichage (le conteneur semble "vide" si on ne l'ajuste pas).
   
2. **Superposition ou débordement** : Les éléments flottants pouvaient se superposer ou déborder du conteneur si les dimensions n'étaient pas correctement gérées.

3. **Problèmes de réinitialisation** : Parfois, pour s'assurer que les éléments flottants ne perturbent pas la mise en page, il fallait ajouter des techniques spécifiques pour "réinitialiser" le flottement.

### **Conteneur clearfix**

Le problème de "conteneur flottant" était souvent résolu avec une technique appelée **clearfix**. Cela consistait à ajouter un pseudo-élément **`::after`** à l'élément parent pour forcer celui-ci à englober les éléments flottants.

```css
.container::after {
  content: "";
  display: table;
  clear: both;
}
```

Cette règle garantissait que le conteneur parent s'ajustait à la hauteur des éléments flottants à l'intérieur.

---

## Utilisation de `position` (absolu et relatif)

### **Positionnement absolu et relatif**

Avant l'avènement de Flexbox et Grid, les développeurs utilisaient souvent le **positionnement absolu** et **relatif** pour placer des éléments à des endroits spécifiques de la page. Ces techniques étaient particulièrement utilisées pour des mises en page complexes ou des interfaces qui nécessitaient un contrôle précis.

- **`position: relative`** : Un élément est positionné relativement à sa position d'origine dans le flux de document.
- **`position: absolute`** : Un élément est positionné par rapport à son conteneur le plus proche ayant un **`position: relative`**.

#### Exemple : Positionnement de plusieurs éléments

```css
.container {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: lightgray;
}

.item {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 50px;
  height: 50px;
  background-color: red;
}
```

Ici, l'élément `.item` est positionné par rapport à son parent `.container` grâce au **positionnement absolu**.

### **Problèmes avec le positionnement**

- **Empilement d'éléments** : Le positionnement absolu pouvait entraîner des problèmes de superposition, car les éléments étaient retirés du flux normal du document.
- **Manque de flexibilité** : Comparé à **Flexbox** et **Grid**, ces méthodes n'étaient pas aussi flexibles pour gérer des mises en page dynamiques et réactives.

---

## Mise en page avec les tableaux

### **Tableaux pour la mise en page**

Une autre méthode populaire pour réaliser des mises en page était l'utilisation des **tableaux** HTML. Bien que cette méthode ne soit pas recommandée aujourd'hui, elle était couramment utilisée avant que CSS ne devienne plus puissant. On utilisait les éléments `<table>`, `<tr>`, `<td>`, et parfois `<colspan>` pour créer des structures de page.

```html
<table width="100%">
  <tr>
    <td width="20%">Menu</td>
    <td>Main Content</td>
    <td width="20%">Sidebar</td>
  </tr>
</table>
```

Bien que cette méthode ait été efficace, elle avait de nombreux inconvénients :
- **Rigidité** : Les mises en page étaient difficiles à adapter et à personnaliser.
- **Accessibilité** : Utiliser des tableaux pour la mise en page était néfaste pour l'accessibilité.
- **Complexité** : Les éléments de tableau étaient difficiles à gérer, surtout pour les mises en page plus complexes.

---

## Les astuces avec `inline-block`

Une autre méthode utilisée pour aligner des éléments côte à côte était **`inline-block`**. Cette propriété permettait aux éléments de se comporter comme des éléments en ligne, tout en conservant les caractéristiques des éléments blocs (par exemple, la possibilité de définir une largeur et une hauteur).

```css
.container {
  width: 100%;
}

.item {
  display: inline-block;
  width: 30%;
  margin: 10px;
}
```

Cette technique était utilisée pour créer des colonnes côte à côte. Cependant, il y avait des défis tels que la gestion des espaces entre les éléments et la compatibilité avec les navigateurs.

---

## Bonnes pratiques de l'époque

Avant Flexbox et Grid, voici quelques bonnes pratiques que les développeurs suivaient :

1. **Gérer les flottants avec clearfix** : Toujours utiliser la technique clearfix pour éviter que le conteneur parent ne se vide.
2. **Éviter l'utilisation excessive de `position: absolute`** : Préférer le positionnement relatif pour éviter de perturber le flux normal du document.
3. **Utiliser des commentaires pour structurer le code** : Dans des mises en page complexes (par exemple avec des tableaux ou des floats), les développeurs ajoutaient des commentaires pour rendre le code plus lisible.
4. **Limiter l'utilisation de `table` pour la mise en page** : Bien que courante, l'utilisation des tableaux pour la mise en page était souvent mal vue par les développeurs qui suivaient les bonnes pratiques.

---

## Comparaison avec Flexbox et Grid

| **Technique**              | **Avantages**                                | **Inconvénients**                             |
|----------------------------|----------------------------------------------|----------------------------------------------|
| **`float`**                 | Simple pour des mises en page simples.       | Problèmes de gestion de hauteur des conteneurs et de débordements. |
| **`position: absolute`**    | Positionnement précis.                       | Enlève les éléments du flux normal, rendant la mise en page complexe à gérer. |
| **Tableaux HTML**          | Facile à mettre en place.                    | Non flexible, difficile à maintenir, mauvaise pour l'accessibilité. |
| **`inline-block`**          | Similaire à `float`, mais avec des comportements de bloc. | Espaces indésirables entre les éléments. |

---

### Conclusion

Les anciennes méthodes de mise en page en CSS, comme **float**, **positionnement**, et l'utilisation de **tableaux**, étaient puissantes à leur époque, mais elles comportaient de nombreux défis et limitaient la flexibilité. **Flexbox** et **CSS Grid** ont largement amélioré ces techniques en offrant des solutions plus intuitives et adaptées aux besoins modernes de mise en page, notamment pour les sites web réactifs et dynamiques.

Aujourd'hui, ces anciennes techniques sont rarement utilisées, à moins d'être confronté à des cas de compatibilité avec des navigateurs très anciens. Il est fortement recommandé d'utiliser **Flexbox** ou **Grid** pour des mises en page modernes.