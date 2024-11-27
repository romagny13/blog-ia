---
category: Web > React
title: Video Preview
date: 2024-11-26
author: Romagny13
---

# Création d'un Composant de Prévisualisation Vidéo Style YouTube

## Objectif

Créer un composant React qui affiche une grille de vidéos avec un aperçu dynamique au survol de la souris.

## Étapes de Conception

### 1. Structure des Données

```javascript
const videoData = [
  {
    id: 1,
    title: "Titre de la Vidéo",
    thumbnail: "URL de la miniature",
    channel: "Nom de la chaîne",
    views: "Nombre de vues",
    previewUrl: "URL de la vidéo de prévisualisation",
  },
  // Autres vidéos...
];
```

### 2. Composants Principaux

- **GridContainer** : Conteneur responsive pour les vidéos
- **VideoCard** : Conteneur individuel pour chaque vidéo
- **Thumbnail** : Image statique de la vidéo
- **VideoPreview** : Élément vidéo qui s'affiche au survol

### 3. Logique de Gestion des Événements

#### Fonctions Clés

```javascript
const handleMouseEnter = (videoId) => {
  const video = videoRefs.current[videoId];
  if (video) {
    // Pause toutes les autres vidéos
    Object.keys(videoRefs.current).forEach((key) => {
      if (key !== videoId.toString()) {
        const otherVideo = videoRefs.current[key];
        otherVideo.pause();
        otherVideo.currentTime = 0;
      }
    });

    // Lecture de la vidéo survolée
    video.currentTime = 0;
    video.play().catch((error) => {
      if (error.name !== "AbortError") {
        console.error("Erreur de lecture:", error);
      }
    });
  }
};

const handleMouseLeave = (videoId) => {
  const video = videoRefs.current[videoId];
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
};
```

### 4. Gestion des Références

Utilisation de `useRef` pour controler les éléments vidéo :

```javascript
const videoRefs = useRef({});
```

### 5. Problèmes Courants et Solutions

#### Gestion des Erreurs de Lecture

- Utilisez `.catch()` pour gérer les erreurs de `play()`
- Filtrez les `AbortError` qui sont des interruptions normales
- Réinitialisez systématiquement le temps de lecture

#### Optimisation des Performances

- Utilisez `preload="metadata"`
- Pausez et réinitialisez les autres vidéos avant la lecture
- Gérez les interactions rapides de la souris

### 6. Considérations de Style

#### CSS avec Styled-Components

- Utilisez `opacity` pour afficher/masquer la prévisualisation
- Appliquez des transitions douces
- Gérez le comportement au survol avec `:hover`

### 7. Bonnes Pratiques

- Utiliser des URLs de vidéos hébergées sur des CDN stables
- Gérer les erreurs de lecture
- Offrir une expérience utilisateur fluide
- Assurer la réactivité sur différents écrans

## Défis Techniques

- Gestion des conflits de lecture vidéo
- Synchronisation des événements de souris
- Performances et chargement des vidéos

## Améliorations Possibles

- Ajouter des contrôles de lecture
- Implémenter un système de préchargement
- Gérer différents types de contenu
- Ajouter des animations plus sophistiquées

## Conclusion

La clé est de créer une expérience utilisateur intuitive qui imite le comportement des plateformes de streaming vidéo.

<iframe src="https://codesandbox.io/embed/jq4tzw?view=editor+%2B+preview&module=%2Fsrc%2Findex.js"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="video-preview-like-youtube"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
