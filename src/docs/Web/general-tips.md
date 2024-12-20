---
category: Web > Html/CSS/JS
title: Tips
date: 2024-12-05
author: Romagny13
---

# Astuces Html / CSS / JS

## 1. Bouton "Retour en Haut"

Voici un guide pour ajouter un bouton permettant de revenir en haut de la page.
Ce bouton utilise un SVG pour l'icône de la flèche, mais d'autres alternatives sont possibles (comme une icône via une librairie ou une pseudo-classe CSS). Exemple avec une pseudo-classe :

```css
#backToTop::before {
  content: "\2191"; /* Code Unicode pour une flèche vers le haut */
}
```

### Code HTML

```html
<button id="backToTop" title="Retour en haut">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 4l-6 6 1.4 1.4L11 7.8V20h2V7.8l3.6 3.6L18 10l-6-6z" />
  </svg>
</button>
```

### Code JavaScript

Ce script gère l'affichage du bouton à partir d'une certaine position de défilement (300px ici) et permet un retour en haut de page avec un effet défilé fluide.

```javascript
const backToTopButton = document.getElementById("backToTop");

// Afficher / masquer le bouton selon la position de défilement
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopButton.classList.add("show");
  } else {
    backToTopButton.classList.remove("show");
  }
});

// Remonter en haut de la page lors du clic
backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
```

### Styles CSS

Voici un exemple de styles pour le bouton, incluant un design attrayant et des transitions douces :

```css
#backToTop {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #d25c5c, #b84848);
  color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
  z-index: 1000;
}

#backToTop svg {
  width: 24px;
  height: 24px;
  fill: white;
}

#backToTop.show {
  opacity: 1;
  visibility: visible;
}

#backToTop:hover {
  transform: scale(1.1);
}
```

## 2. Carte de Profil au Survol

Ajoutons une carte de profil qui s'affiche lors du survol d'un texte.

### Code HTML

Texte contenant le déclencheur :

```html
<p>Lorem Ipsum <span class="hover-trigger">Le nom</span> Lorem Ipsum</p>
```

Exemple de carte de profil :

```html
<div class="profile-card">
  <img alt="Alt image" src="image1.jpg" />
  <h2>Le nom</h2>
  <p>Description 1</p>
  <p>Description 2</p>
  <p>Description 3</p>
</div>
```

### Code JavaScript

Ce script gère l'affichage et le positionnement de la carte lors du survol. La carte reste visible lorsque le curseur est dessus.

```javascript
const trigger = document.querySelector(".hover-trigger");
const card = document.querySelector(".profile-card");
let hideTimeout;

trigger.addEventListener("mouseenter", function () {
  const rect = trigger.getBoundingClientRect();

  // Positionner la carte sous le texte
  card.style.top = `${rect.top + 5}px`;
  card.style.left = `${rect.left + rect.width / 2 - 200}px`;
  card.classList.add("visible");
});

trigger.addEventListener("mouseleave", function () {
  hideTimeout = setTimeout(() => card.classList.remove("visible"), 300);
});

card.addEventListener("mouseenter", function () {
  clearTimeout(hideTimeout);
  card.classList.add("visible");
});

card.addEventListener("mouseleave", function () {
  card.classList.remove("visible");
});
```

### Styles CSS

Créez un design moderne et fluide pour la carte :

```css
.hover-trigger {
  color: #007bff;
  cursor: pointer;
  position: relative;
}

.profile-card {
  display: none;
  position: fixed;
  width: 350px;
  background: linear-gradient(145deg, #f6f8f9, #e5ebee);
  border: 2px solid #e0e6ea;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.05);
  padding: 25px;
  text-align: center;
  z-index: 10;
  margin-top: 15px;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s
      cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -50%;
  width: 200%;
  height: 4px;
  background: linear-gradient(90deg, transparent, #3a5ce3, transparent);
  animation: shine 3s infinite linear;
}

@keyframes shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.profile-card img {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 50%;
  background: linear-gradient(135deg, #f6f8f9, #e0e6ea);
  margin: 0 auto 20px;
  border: 4px solid #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.profile-card img:hover {
  transform: scale(1.05);
}

.profile-card h2 {
  margin: 0 0 10px;
  font-size: 1.8rem;
  color: #2c3e50;
  font-weight: 700;
}

.profile-card p {
  margin: 8px 0 15px;
  font-size: 1rem;
  color: #34495e;
  line-height: 1.6;
}

.profile-card.visible {
  display: block;
  opacity: 1;
  transform: scale(1);
}
```

Voici une version enrichie avec des explications détaillées sur le fonctionnement du code :

---

## 3. Bouton avec effet brillant

### Structure HTML

Le code HTML pour créer le bouton est le suivant :

```xml
<a
  href="https://www.tiktok.com/@yourhealingproject"
  target="_blank"
  class="profile-link"
>
  Voir le Profil
</a>
```

#### Explications :

1. **`<a>`** : Élément de lien hypertexte, utilisé ici pour rediriger l'utilisateur vers un profil TikTok.
2. **`href="..."`** : Définit l'URL vers laquelle l'utilisateur sera redirigé en cliquant sur le bouton.
3. **`target="_blank"`** : Ouvre le lien dans un nouvel onglet ou une nouvelle fenêtre.
4. **`class="profile-link"`** : Attribue une classe pour appliquer des styles personnalisés avec CSS.
5. Le texte **"Voir le Profil"** est le contenu affiché dans le bouton.

---

### Styles CSS

Voici le code CSS qui applique les styles et l'effet brillant au bouton :

```css
.profile-link {
  display: inline-block;
  background-color: #ff4081;
  font-family: Arial, sans-serif;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 25px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
```

#### Explications :

1. **`display: inline-block;`** : Permet à l'élément d'avoir les propriétés d'un bloc (comme les marges et le padding), tout en restant dans la même ligne que les autres éléments.
2. **`background-color: #ff4081;`** : Définit une couleur de fond rose vif.
3. **`font-family: Arial, sans-serif;`** : Applique une police lisible.
4. **`color: white;`** : Définit la couleur du texte en blanc.
5. **`text-decoration: none;`** : Supprime le soulignement par défaut des liens.
6. **`padding: 10px 20px;`** : Ajoute de l'espace interne autour du texte.
7. **`border-radius: 25px;`** : Arrondit les bords du bouton pour un aspect doux.
8. **`transition: all 0.3s ease;`** : Applique une transition fluide sur toutes les propriétés modifiées.
9. **`position: relative;`** : Nécessaire pour positionner des pseudo-éléments comme `:before` à l'intérieur de l'élément.
10. **`overflow: hidden;`** : Cache tout contenu qui dépasse les limites de l'élément, comme l'effet brillant.

---

#### Pseudo-élément `:before`

```css
.profile-link:before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: all 0.5s ease;
}
```

##### Explications :

1. **`content: "";`** : Génère un pseudo-élément vide.
2. **`position: absolute;`** : Permet de positionner le pseudo-élément par rapport à son parent (`position: relative` est défini dans `.profile-link`).
3. **`top: 0; left: -100%;`** : Positionne le pseudo-élément hors de l'écran à gauche.
4. **`width: 100%; height: 100%;`** : Fait correspondre la taille du pseudo-élément à celle du bouton.
5. **`background: linear-gradient(...)`** : Crée un dégradé brillant qui se déplace sur le bouton.
   - **`120deg`** : Définit l'angle du dégradé.
   - **`transparent` et `rgba(255, 255, 255, 0.3)`** : Ajoute une lueur subtile.
6. **`transition: all 0.5s ease;`** : Ajoute une transition fluide lorsque le pseudo-élément change de position.

---

#### État au survol `:hover`

```css
.profile-link:hover:before {
  left: 100%;
}

.profile-link:hover {
  background-color: #9c27b0;
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
```

##### Effet brillant :

1. **`:hover:before { left: 100%; }`** : Déplace le pseudo-élément de la gauche vers la droite lorsque l'utilisateur survole le bouton.

##### Effets supplémentaires sur le bouton :

1. **`background-color: #9c27b0;`** : Change la couleur de fond en violet.
2. **`transform: scale(1.1);`** : Agrandit légèrement le bouton.
3. **`box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);`** : Ajoute une ombre portée pour un effet d'élévation.

---

### Résultat attendu

Lorsqu'un utilisateur survole le bouton :

1. Une lueur brillante traverse le bouton de gauche à droite.
2. Le bouton change de couleur et s'agrandit légèrement.
3. Une ombre subtile apparaît autour du bouton, lui donnant un effet de flottement.

Ce design donne un aspect interactif et moderne, parfait pour attirer l'attention sur le lien.

## 4. Embed 16/9 arrondi avec effet survol

Voici une explication détaillée du code fourni pour intégrer une vidéo YouTube avec un effet de survol dans un conteneur au format 16:9 avec des bords arrondis.

---

### **HTML**

Le bloc HTML contient une structure simple qui permet d'intégrer une vidéo YouTube à l'aide d'une balise `<iframe>` :

```xml
<div class="video-container">
  <iframe src="https://www.youtube.com/embed/R50mmtiuNHg?si=5u4DB4gZBOmvj450"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen>
  </iframe>
</div>
```

- **`<div class="video-container">`** :  
  Ce conteneur est utilisé pour appliquer un style spécifique au lecteur vidéo, en particulier pour assurer le ratio d'aspect 16:9 et ajouter des effets CSS.

- **`<iframe>`** :  
  Cette balise permet d'afficher la vidéo YouTube directement sur la page. Les attributs importants ici sont :
  - `src` : URL de la vidéo intégrée avec les options personnalisées.
  - `title` : Fournit une description pour l'accessibilité.
  - `frameborder="0"` : Supprime la bordure du cadre de la vidéo.
  - `allowfullscreen` : Permet à l'utilisateur d'afficher la vidéo en plein écran.
  - `referrerpolicy` : Définit une politique de référent plus stricte pour renforcer la sécurité.

---

### **CSS**

Les styles définissent le comportement et l'apparence du conteneur vidéo.

#### **1. Conteneur vidéo `.video-container`**

```css
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* Ratio 16:9 */
  height: 0;
  overflow: hidden;
  max-width: 100%;
  background: #000;
  text-align: center;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}
```

- **`position: relative;`** :  
  Rend le conteneur parent positionné pour permettre le positionnement absolu de l'iframe enfant.

- **`padding-bottom: 56.25%; height: 0;`** :  
  Maintient un ratio d'aspect 16:9, même lorsque la largeur du conteneur change (56.25% correspond à 9/16).

- **`overflow: hidden;`** :  
  Cache les parties de la vidéo qui pourraient dépasser du conteneur arrondi.

- **`max-width: 100%;`** :  
  Assure que la vidéo ne dépasse jamais la largeur de son conteneur parent, rendant le design réactif.

- **`background: #000;`** :  
  Ajoute un fond noir pour les cas où la vidéo est lente à charger.

- **`border-radius: 15px;`** :  
  Arrondit les coins du conteneur.

- **`box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);`** :  
  Ajoute une ombre portée douce autour du conteneur pour un effet de profondeur.

- **`transition: all 0.3s ease;`** :  
  Ajoute une animation fluide lorsque des styles (comme le survol) changent.

#### **2. Iframe `.video-container iframe`**

```css
.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 15px;
}
```

- **`position: absolute; top: 0; left: 0;`** :  
  Permet à l'iframe d'occuper tout l'espace du conteneur parent.

- **`width: 100%; height: 100%;`** :  
  Adapte l'iframe à la largeur et à la hauteur du conteneur parent.

- **`border-radius: 15px;`** :  
  Assure que l'iframe suit les coins arrondis du conteneur.

#### **3. Effet de survol `.video-container:hover`**

```css
.video-container:hover {
  transform: scale(1.02);
}
```

- **`transform: scale(1.02);`** :  
  Agrandit légèrement le conteneur lorsqu'on passe la souris dessus, créant un effet interactif subtil.

---

### **Résultat attendu**

1. **Vidéo intégrée au format 16:9** : Le ratio d'aspect reste constant, quelle que soit la taille de l'écran.
2. **Coins arrondis et ombre portée** : Donne un design moderne et attrayant.
3. **Effet de survol fluide** : Rend l'expérience utilisateur interactive, tout en restant léger et élégant.
4. **Compatibilité responsive** : Le design s'adapte automatiquement à différentes tailles d'écran.

---

### **Personnalisation possible**

- **Modifier le rayon des coins** : Changez `border-radius: 15px;` pour des coins plus ou moins arrondis.
- **Modifier l'ombre portée** : Ajustez `box-shadow` pour un effet plus subtil ou plus marqué.
- **Ajouter un effet de couleur** : Vous pouvez combiner l'effet de survol avec un changement de couleur du fond, par exemple :
  ```css
  .video-container:hover {
    transform: scale(1.02);
    background-color: #333;
  }
  ```

Ce code est parfait pour des sites modernes avec des vidéos YouTube intégrées. 🎥

## 4. Intégration d'un lecteur YouTube responsive en 16:9 avec l'API JavaScript

Ce document explique comment intégrer un lecteur YouTube responsive au format 16:9 à l'aide de HTML, CSS et JavaScript. Ce guide est écrit pour les développeurs souhaitant créer une expérience utilisateur fluide et adaptée aux différents appareils.

---

### Code Complet

Voici le code complet pour intégrer un lecteur YouTube.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lecteur YouTube Responsive</title>
    <style>
      .youtube-player-wrapper {
        position: relative;
        width: 100%;
        padding-top: 56.25%; /* Ratio 16:9 (9 / 16 * 100) */
      }

      #player {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div class="youtube-player-wrapper">
      <div id="player"></div>
    </div>

    <script src="https://www.youtube.com/iframe_api"></script>
    <script>
      let player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player("player", {
          videoId: "M7lc1UVf-VE", // Remplacez par l'ID de votre vidéo
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
      }

      function onPlayerReady(event) {
        console.log("Le lecteur est prêt.");
      }

      function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
          console.log("La vidéo est terminée.");
        }
      }
    </script>
  </body>
</html>
```

---

### Explication du Code

#### 1. **Structure HTML**

- **`<div class="youtube-player-wrapper">`** : Ce conteneur maintient le rapport d'aspect 16:9 pour le lecteur.
- **`<div id="player">`** : Cet élément est remplacé par l'iframe du lecteur YouTube grâce à l'API.

#### 2. **Styles CSS**

- **`.youtube-player-wrapper`** :
  - `position: relative` : Permet de positionner l'iframe dans un conteneur parent.
  - `padding-top: 56.25%` : Crée un rapport d'aspect 16:9 (calculé comme 9 / 16 \* 100).
- **`#player`** :
  - `position: absolute` : Positionne l'iframe pour qu'elle occupe tout l'espace du conteneur.
  - `width` et `height` : Adaptent la taille à celle du conteneur parent.

#### 3. **Chargement de l'API YouTube**

- **`<script src="https://www.youtube.com/iframe_api"></script>`** : Charge l'API JavaScript de YouTube.

#### 4. **Initialisation du lecteur avec JavaScript**

- **`onYouTubeIframeAPIReady`** : Fonction appelée automatiquement une fois l'API chargée.
- **`YT.Player`** : Crée une instance du lecteur dans l'élément `#player`.
  - `videoId` : ID de la vidéo à lire.
  - `events` : Permet d'écouter des événements comme `onReady` ou `onStateChange`.

#### 5. **Gestion des événements du lecteur**

- **`onPlayerReady`** : Appelé lorsque le lecteur est prêt.
- **`onPlayerStateChange`** : Détecte les changements d'état, par exemple, lorsque la vidéo se termine (`YT.PlayerState.ENDED`).

---

### Comment Modifier le Code

- **Changer la vidéo** :

  - Remplacez l'ID de la vidéo `M7lc1UVf-VE` par celui de la vidéo que vous souhaitez afficher.

- **Ajouter des actions à la fin de la vidéo** :

  - Modifiez la fonction `onPlayerStateChange` pour exécuter une action personnalisée.

- **Ajuster la taille** :
  - Le conteneur est adapté automatiquement, mais vous pouvez modifier la largeur en ajustant les styles CSS.

---

### Notes Importantes

1. **Responsive Design** : Le lecteur est adapté à tous les appareils grâce au CSS.
2. **Respect des règles de YouTube** : L'utilisation de l'API doit respecter les conditions d'utilisation de YouTube.
3. **Compatibilité Navigateur** : Assurez-vous que votre site est compatible avec les navigateurs modernes.
