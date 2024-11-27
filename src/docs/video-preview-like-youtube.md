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

Voici un document en **Markdown** expliquant les modifications et optimisations apportées au composant React avec le code complet inclus :

---

### 8. Optimisation d'une Prévisualisation Vidéo comme YouTube

## Introduction

Ce document présente une solution complète et optimisée pour afficher une grille de vidéos avec une fonction de prévisualisation similaire à YouTube. L’objectif principal était d’améliorer les performances, l’accessibilité et l’expérience utilisateur sur desktop et mobile.

---

## Modifications et Optimisations Apportées

### 1. **Gestion de la Barre de Progression**

- Ajout d’une barre de progression dynamique en bas de chaque carte vidéo.
- La barre reflète la progression en pourcentage de la prévisualisation vidéo en temps réel.

### 2. **Amélioration des Performances**

- Empêche la lecture simultanée de plusieurs vidéos.
- Pause toutes les autres vidéos lorsqu’une nouvelle est survolée.
- Optimisation avec des références (`useRef`) pour un contrôle direct des éléments vidéo.

### 3. **Accessibilité**

- Ajout d’attributs `alt` pour les images des miniatures.
- Assure que toutes les vidéos sont silencieuses (`muted`) et prêtes à être jouées (`playsInline`).

### 4. **Responsiveness**

- Conception responsive adaptée aux appareils mobiles et desktops.
- Grille flexible avec `grid-template-columns` pour un meilleur affichage sur toutes les tailles d'écran.

### 5. **Transition et Expérience Visuelle**

- Ajout de transitions douces pour l'apparition et la disparition des prévisualisations vidéo.
- Effets de zoom sur les cartes vidéo au survol pour une meilleure interaction visuelle.

---

## Code Complet

```jsx
import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";

// Données des vidéos
const videoData = [
  {
    id: 1,
    title: "Nature Relaxante",
    thumbnail: "https://picsum.photos/320/180?random=1",
    channel: "Nature Explorer",
    views: "1.2M",
    duration: "10:45",
    previewUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: 2,
    title: "Paysage Urbain",
    thumbnail: "https://picsum.photos/320/180?random=2",
    channel: "City Vibes",
    views: "456K",
    duration: "15:30",
    previewUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: 3,
    title: "Animation Créative",
    thumbnail: "https://picsum.photos/320/180?random=3",
    channel: "Creative World",
    views: "789K",
    duration: "8:15",
    previewUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  },
];

// Styled-components
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
  background-color: #f9f9f9;
`;

const VideoCard = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  background: white;
  height: 250px;

  &:hover {
    transform: scale(1.05);
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const VideoInfo = styled.div`
  padding: 8px;
`;

const VideoTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const VideoDetails = styled.div`
  color: #606060;
  font-size: 12px;
  margin-top: 4px;
`;

const VideoPreview = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 180px;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
  z-index: 10;

  ${VideoCard}:hover & {
    opacity: 1;
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background-color: #ff0000;
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
`;

// Composant principal
const VideoGrid = () => {
  const videoRefs = useRef({});
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [progress, setProgress] = useState({});

  // Gérer la progression de la vidéo
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedProgress = {};
      Object.keys(videoRefs.current).forEach((id) => {
        const video = videoRefs.current[id];
        if (video && !video.paused && !video.ended) {
          updatedProgress[id] = (video.currentTime / video.duration) * 100;
        }
      });
      setProgress(updatedProgress);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = async (videoId) => {
    const video = videoRefs.current[videoId];
    if (video) {
      // Pause toutes les autres vidéos
      Object.keys(videoRefs.current).forEach((key) => {
        const otherVideo = videoRefs.current[key];
        if (otherVideo && key !== videoId.toString()) {
          otherVideo.pause();
          otherVideo.currentTime = 0;
        }
      });

      // Joue la vidéo sélectionnée
      video.currentTime = 0;
      try {
        await video.play();
        setPlayingVideoId(videoId);
      } catch (error) {
        console.error("Erreur de lecture:", error);
      }
    }
  };

  const handleMouseLeave = (videoId) => {
    const video = videoRefs.current[videoId];
    if (video) {
      video.pause();
      video.currentTime = 0;
      setPlayingVideoId(null);
    }
  };

  return (
    <GridContainer>
      {videoData.map((video) => (
        <VideoCard
          key={video.id}
          onMouseEnter={() => handleMouseEnter(video.id)}
          onMouseLeave={() => handleMouseLeave(video.id)}
        >
          <Thumbnail src={video.thumbnail} alt={video.title} />

          <VideoPreview
            ref={(el) => (videoRefs.current[video.id] = el)}
            src={video.previewUrl}
            muted
            playsInline
            preload="metadata"
            data-id={video.id}
          />

          <ProgressBar progress={progress[video.id] || 0} />

          <VideoInfo>
            <VideoTitle>{video.title}</VideoTitle>
            <VideoDetails>
              {video.channel} • {video.views} vues
            </VideoDetails>
          </VideoInfo>
        </VideoCard>
      ))}
    </GridContainer>
  );
};

export default VideoGrid;
```

---

## Points Améliorés

- **Expérience utilisateur enrichie** : transitions visuelles, barre de progression en temps réel.
- **Performance optimale** : gestion précise des vidéos jouées.
- **Accessibilité et responsivité** : design adapté pour tous les utilisateurs.

Ce composant est désormais prêt à être intégré dans n'importe quelle application. 🚀

<iframe src="https://codesandbox.io/embed/jq4tzw?view=editor+%2B+preview&module=%2Fsrc%2Findex.js"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="video-preview-like-youtube"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
