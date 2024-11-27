---
category: Web > React
title: styled-components
date: 2024-11-26
author: Romagny13
---

# Guide Complet : Utiliser **styled-components** avec React

**styled-components** est une bibliothèque populaire pour le CSS-in-JS. Elle permet de créer des composants React stylés en définissant des styles directement dans votre code JavaScript. Voici un guide complet pour utiliser cette bibliothèque efficacement.

## 1. Installation de styled-components

Ajoutez la bibliothèque à votre projet avec npm ou yarn :

```bash
npm install styled-components
# ou
yarn add styled-components
```

Pour une meilleure expérience, installez également les types si vous utilisez TypeScript :

```bash
npm install --save-dev @types/styled-components
```

## 2. Créer un composant stylé

Vous pouvez transformer n'importe quel élément HTML ou composant en un composant stylé :

```javascript
import styled from "styled-components";

const Button = styled.button`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

export default function App() {
  return <Button>Cliquer ici</Button>;
}
```

## 3. Utiliser des thèmes (Light et Dark)

### 3.1 Configurer les thèmes

Créez un fichier `theme.js` pour définir vos thèmes :

```javascript
// theme.js
export const lightTheme = {
  colors: {
    background: "#ffffff",
    text: "#000000",
    primary: "#4caf50",
  },
};

export const darkTheme = {
  colors: {
    background: "#000000",
    text: "#ffffff",
    primary: "#90caf9",
  },
};
```

### 3.2 Configurer le `ThemeProvider`

Utilisez le `ThemeProvider` de styled-components pour appliquer un thème à toute votre application :

```javascript
import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme";

const AppContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
`;

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <AppContainer>
        <Button onClick={() => setIsDarkMode(!isDarkMode)}>
          Basculer en {isDarkMode ? "Mode Clair" : "Mode Sombre"}
        </Button>
      </AppContainer>
    </ThemeProvider>
  );
}
```

## 4. Partager des composants stylés entre pages React

Créez un dossier dédié aux composants communs pour partager les styles entre plusieurs pages :

```plaintext
src/
├── components/
│   ├── Button.js
│   ├── Header.js
│   └── Footer.js
```

**Exemple : `Button.js`**

```javascript
import styled from "styled-components";

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export default Button;
```

## 5. Meilleures pratiques avec styled-components

### 5.1 Utiliser des noms explicites

Les noms des composants stylés doivent refléter leur rôle dans l'interface. Par exemple, utilisez `PrimaryButton` au lieu de `StyledButton`.

### 5.2 Thématisation

Centralisez vos variables de style (couleurs, tailles de polices) dans des thèmes. Cela facilite les changements globaux.

### 5.3 Utiliser des helpers

Créez des mixins pour les styles réutilisables, comme les ombrages ou les animations.

```javascript
import { css } from "styled-components";

export const boxShadow = css`
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  ${boxShadow};
`;
```

## 6. Gestion des médias queries

### 6.1 Exemple basique

```javascript
const Container = styled.div`
  width: 100%;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;
```

### 6.2 Centraliser les breakpoints dans un thème

```javascript
export const theme = {
  breakpoints: {
    mobile: "768px",
  },
};

const Container = styled.div`
  padding: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 10px;
  }
`;
```

## 7. Animations avec keyframes

### 7.1 Exemple de base

```javascript
import styled, { keyframes } from "styled-components";

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const AnimatedDiv = styled.div`
  animation: ${slideIn} 1s ease-out;
`;
```

## 8. Corriger les warnings avec `shouldForwardProp`

### 8.1 Exemple

```javascript
const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "isActive",
})`
  background-color: ${({ isActive }) => (isActive ? "blue" : "gray")};
`;
```

## 9. Conclusion

**styled-components** est une solution puissante et flexible pour styliser vos applications React. En suivant les bonnes pratiques et en utilisant les fonctionnalités comme les thèmes, les animations, et `shouldForwardProp`, vous pouvez créer des interfaces élégantes et maintenables.

🎨 **Happy Coding !**
