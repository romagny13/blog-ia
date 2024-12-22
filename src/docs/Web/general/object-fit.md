---
category: Web > Html/CSS/JS > Images
title: object-fit
date: 2024-12-05
author: Romagny13
---

# Guide des Propriétés `object-fit` en CSS

### Introduction

La propriété CSS `object-fit` permet de contrôler la façon dont une image (ou un autre élément de type média) est redimensionnée et ajustée dans un conteneur. Cela permet de gérer la mise en forme des images dans des éléments de tailles variables, sans déformation ou avec un ajustement automatique.

Les principales valeurs de `object-fit` sont :

- `contain`
- `cover`
- `fill`
- `none`
- `scale-down`

### 1. **`object-fit: contain;`**

- **Objectif :** L'image est redimensionnée pour être entièrement visible et occuper tout l'espace disponible du conteneur tout en maintenant ses proportions.
- **Comportement :**
  - **Image plus petite que le conteneur :** L'image est affichée à sa taille originale (ou agrandie si nécessaire) et peut laisser des espaces vides autour.
  - **Image plus grande que le conteneur :** L'image est redimensionnée pour tenir dans le conteneur sans être coupée, mais elle peut ne pas remplir complètement le conteneur si les proportions sont différentes.

**Exemple visuel :**
Si l'image est plus petite que le conteneur, vous verrez des espaces vides autour de l'image. Si elle est plus grande, elle sera réduite pour être entièrement visible sans distorsion.

### 2. **`object-fit: cover;`**

- **Objectif :** L'image est redimensionnée pour couvrir entièrement le conteneur, mais certaines parties de l'image peuvent être coupées si ses proportions ne correspondent pas exactement à celles du conteneur.
- **Comportement :**
  - **Image plus petite que le conteneur :** L'image est agrandie pour remplir tout l'espace, mais elle sera probablement coupée pour éviter les espaces vides.
  - **Image plus grande que le conteneur :** L'image est redimensionnée pour couvrir l'ensemble du conteneur, et certaines parties peuvent être coupées si les proportions de l'image et du conteneur diffèrent.

**Exemple visuel :**
L'image couvrira tout l'espace du conteneur, mais des parties de l'image seront peut-être coupées pour s'adapter à l'espace disponible.

### 3. **`object-fit: fill;`**

- **Objectif :** L'image est redimensionnée pour remplir complètement le conteneur, mais cela peut entraîner une déformation de l'image, car elle peut être étirée ou compressée pour s'adapter à l'espace.
- **Comportement :**
  - **Image plus petite que le conteneur :** L'image sera agrandie pour remplir tout l'espace, mais cela peut la déformer.
  - **Image plus grande que le conteneur :** L'image sera réduite ou étirée pour remplir exactement le conteneur, ce qui peut également déformer l'image.

**Exemple visuel :**
L'image sera étirée ou compressée pour remplir le conteneur, ce qui peut entraîner une distorsion visible.

### 4. **`object-fit: none;`**

- **Objectif :** L'image est affichée à sa taille réelle, sans aucune tentative de redimensionnement. Elle peut dépasser du conteneur si elle est plus grande.
- **Comportement :**
  - **Image plus petite que le conteneur :** L'image reste à sa taille d'origine et peut laisser des espaces vides autour d'elle.
  - **Image plus grande que le conteneur :** L'image dépasse du conteneur et peut être coupée si elle ne tient pas dans l'espace.

**Exemple visuel :**
L'image restera à sa taille d'origine, et si elle est trop grande pour le conteneur, elle débordera et sera partiellement coupée.

### 5. **`object-fit: scale-down;`**

- **Objectif :** L'image est redimensionnée de manière à être aussi petite que nécessaire pour tenir dans le conteneur sans être déformée, mais si l'image est déjà plus petite que le conteneur, elle ne sera pas redimensionnée.
- **Comportement :**
  - **Image plus petite que le conteneur :** L'image reste à sa taille originale sans redimensionnement.
  - **Image plus grande que le conteneur :** L'image est réduite pour tenir dans le conteneur sans déformation.

**Exemple visuel :**
Si l'image est plus petite que le conteneur, elle reste à sa taille d'origine. Si elle est plus grande, elle est réduite pour s'adapter à l'espace disponible sans distorsion.

---

### 6. Exemples HTML et CSS

#### Exemple 1 : Image Plus Petite que le Conteneur

Ce code montre comment chaque valeur de `object-fit` se comporte lorsque l'image est plus petite que le conteneur.

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Image Plus Petite que le Conteneur</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
    }

    .container {
      width: 400px;
      height: 300px;
      border: 2px solid #333;
      margin-bottom: 20px;
      overflow: hidden;
    }

    h2 {
      text-align: center;
      margin-bottom: 10px;
    }

    img {
      width: 100%;
      height: 100%;
    }

    .contain {
      object-fit: contain;
      background-color: #f0f0f0;
    }

    .cover {
      object-fit: cover;
      background-color: #f0f0f0;
    }

    .fill {
      object-fit: fill;
      background-color: #f0f0f0;
    }
  </style>
</head>
<body>

  <div class="container">
    <h2>Image avec `object-fit: contain`</h2>
    <img class="contain" src="https://via.placeholder.com/150x100" alt="Image Petite">
  </div>

  <div class="container">
    <h2>Image avec `object-fit: cover`</h2>
    <img class="cover" src="https://via.placeholder.com/150x100" alt="Image Petite">
  </div>

  <div class="container">
    <h2>Image avec `object-fit: fill`</h2>
    <img class="fill" src="https://via.placeholder.com/150x100" alt="Image Petite">
  </div>

</body>
</html>
```

#### Exemple 2 : Image Plus Grande que le Conteneur

Ce code montre comment chaque valeur de `object-fit` se comporte lorsque l'image est plus grande que le conteneur.

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Image Plus Grande que le Conteneur</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
    }

    .container {
      width: 400px;
      height: 300px;
      border: 2px solid #333;
      margin-bottom: 20px;
      overflow: hidden;
    }

    h2 {
      text-align: center;
      margin-bottom: 10px;
    }

    img {
      width: 100%;
      height: 100%;
    }

    .contain {
      object-fit: contain;
      background-color: #f0f0f0;
    }

    .cover {
      object-fit: cover;
      background-color: #f0f0f0;
    }

    .fill {
      object-fit: fill;
      background-color: #f0f0f0;
    }
  </style>
</head>
<body>

  <div class="container">
    <h2>Image avec `object-fit: contain`</h2>
    <img class="contain" src="https://via.placeholder.com/800x600" alt="Image Grande">
  </div>

  <div class="container">
    <h2>Image avec `object-fit: cover`</h2>
    <img class="cover" src="https://via.placeholder.com/800x600" alt="Image Grande">
  </div>

  <div class="container">
    <h2>Image avec `object-fit: fill`</h2>
    <img class="fill" src="https://via.placeholder.com/800x600" alt="Image Grande">
  </div>

</body>
</html>
```

Pour choisir la meilleure valeur de `object-fit` en fonction des dimensions de l'image et de la mise en page, voici quelques conseils pratiques :

### 1. **Si vous souhaitez que l'image soit entièrement visible sans déformation :**
   - **Utilisez `object-fit: contain;`**
     - **Quand l'utiliser :** Si vous avez une image avec des proportions différentes de celles du conteneur et que vous voulez qu'elle soit complètement visible sans être coupée. Cela garantit que l'image sera entièrement contenue dans le conteneur.
     - **Conseil :** Si le conteneur est plus grand que l'image, des espaces vides seront laissés autour de l'image, mais cela évite toute déformation.
     - **Exemple :** Idéal pour des vignettes d'images ou des logos qui doivent rester intacts.

### 2. **Si vous voulez que l'image couvre tout l'espace du conteneur, même si cela signifie couper une partie de l'image :**
   - **Utilisez `object-fit: cover;`**
     - **Quand l'utiliser :** Si le conteneur doit être entièrement couvert par l'image, même si cela signifie que certaines parties de l'image seront coupées. C'est parfait lorsque l'aspect esthétique du conteneur est plus important que la visibilité complète de l'image.
     - **Conseil :** Cela fonctionne bien pour les bannières ou les fonds d'écran où vous voulez que l'image remplisse tout l'espace sans laisser de vide, même si des parties de l'image sont masquées.
     - **Exemple :** Parfait pour des images de couverture, comme une photo de fond sur un site Web.

### 3. **Si l'image doit remplir tout l'espace du conteneur, mais que vous êtes prêt à accepter une déformation :**
   - **Utilisez `object-fit: fill;`**
     - **Quand l'utiliser :** Si vous voulez que l'image remplisse complètement le conteneur, mais que la déformation (étirement ou compression) de l'image est acceptable pour votre design.
     - **Conseil :** Cela peut être utile pour des designs où l'image doit correspondre exactement aux dimensions du conteneur, mais où la qualité visuelle n'est pas la priorité.
     - **Exemple :** Utilisé pour des éléments graphiques ou des illustrations où la proportion exacte de l'image n'a pas d'importance.

### 4. **Si vous voulez afficher l'image à sa taille originale, sans redimensionner ou couper :**
   - **Utilisez `object-fit: none;`**
     - **Quand l'utiliser :** Si vous ne voulez pas que l'image soit redimensionnée de quelque manière que ce soit et que vous préférez la laisser à sa taille réelle.
     - **Conseil :** L'image peut déborder du conteneur si elle est plus grande que celui-ci, ou être trop petite si elle est plus petite que le conteneur.
     - **Exemple :** Utilisé pour afficher des images dans des contextes où la taille originale est importante, comme des galeries d'art ou des images de produits.

### 5. **Si vous souhaitez redimensionner l'image seulement si nécessaire pour l'adapter au conteneur, mais sans l'agrandir si elle est plus petite :**
   - **Utilisez `object-fit: scale-down;`**
     - **Quand l'utiliser :** Si vous voulez que l'image soit redimensionnée uniquement si elle est trop grande pour le conteneur, mais que vous ne souhaitez pas l'agrandir si elle est plus petite.
     - **Conseil :** Cela permet de garder l'image dans des limites raisonnables, sans la redimensionner inutilement, tout en s'assurant qu'elle ne dépasse pas du conteneur.
     - **Exemple :** Parfait pour des galeries d'images ou des vignettes où vous ne voulez pas déformer ou agrandir les images petites, mais souhaitez éviter qu'elles soient trop grandes dans des conteneurs plus grands.

---

### Résumé des Conseils :

- **`contain`** : Garder l'image entière, sans coupe, même si cela laisse des espaces vides.
- **`cover`** : Remplir le conteneur, avec possible coupe de l'image pour éviter les espaces vides.
- **`fill`** : Remplir le conteneur, avec possible déformation.
- **`none`** : Afficher l'image à sa taille réelle, sans redimensionnement.
- **`scale-down`** : Réduire l'image si elle est plus grande que le conteneur, sans l'agrandir si elle est plus petite.

### Recommandation générale :
- **Préférez `contain`** si l'intégrité visuelle de l'image est primordiale et que vous voulez qu'elle reste entièrement visible, même si cela laisse des espaces.
- **Préférez `cover`** si vous avez besoin que le conteneur soit totalement rempli par l'image, même si une partie de celle-ci est coupée.
- **Préférez `fill`** si vous avez besoin que l'image remplisse l'espace sans vous soucier de la déformation.



### Utiliser `overflow` pour gérer le débordement
Si l'image dépasse du conteneur et que vous souhaitez cacher la partie excédentaire, vous pouvez utiliser `overflow: hidden;`.

```css
.container {
  width: 300px;
  height: 200px;
  overflow: hidden; /* Cache la partie qui déborde */
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

- **Comportement :** L'image est redimensionnée pour couvrir tout l'espace du conteneur, et la partie qui dépasse est cachée.

### Limiter la taille de l'image
Si vous voulez éviter que l'image soit trop grande, vous pouvez utiliser les propriétés `max-width` et `max-height` pour limiter sa taille.

```css
img {
  max-width: 100%;
  max-height: 100%;
}
```

- **Comportement :** L'image sera redimensionnée pour ne pas dépasser la taille du conteneur, tout en conservant ses proportions.

- **Bonne pratique :** Idéal pour garantir que l'image ne déborde jamais du conteneur tout en maintenant ses dimensions originales.

---

## Autres méthodes et bonnes pratiques

### 3.1 Utiliser `background-image` avec `background-size`
Si l'image est utilisée comme fond d'un élément (par exemple, pour une image de bannière), vous pouvez utiliser `background-size` pour ajuster l'image sans déformation.

```css
.container {
  width: 300px;
  height: 200px;
  background-image: url('image.jpg');
  background-size: cover; /* Remplit le conteneur */
  background-position: center;
  background-repeat: no-repeat;
}
```

- **`background-size: contain;`** : L'image sera redimensionnée pour tenir dans le conteneur sans déformation.
- **`background-size: cover;`** : L'image couvrira tout le conteneur, et si nécessaire, elle sera coupée.

### 3.2 Utiliser `object-position`
Lorsque vous utilisez `object-fit`, vous pouvez également ajuster la position de l'image dans le conteneur avec `object-position`.

```css
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center; /* Positionne l'image en haut et au centre */
}
```

- **Bonne pratique :** Utilisez `object-position` pour choisir quelle partie de l'image est visible lorsque celle-ci est redimensionnée et que certaines zones sont coupées.

---

## 4. Conclusion

La gestion des images dans un conteneur dépend de l'effet recherché. Voici un résumé des meilleures pratiques :

- **Utilisez `object-fit: contain`** pour maintenir les proportions de l'image sans déformation, avec ou sans espaces vides.
- **Utilisez `object-fit: cover`** pour que l'image remplisse le conteneur sans distorsion, mais avec une possibilité de découpe.
- **Utilisez `object-fit: fill`** si vous êtes prêt à accepter une déformation pour faire en sorte que l'image remplisse exactement le conteneur.
- **Utilisez `overflow: hidden`** pour cacher les parties de l'image qui débordent.
- **Utilisez `background-size` et `background-image`** pour les images de fond, selon que vous souhaitez les redimensionner ou les découper.
