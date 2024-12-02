---
category: Web > React
title: Redux
date: 2024-11-26
author: Romagny13
---

# Introduction à Redux Toolkit avec React

## **1. Installation**

Redux Toolkit simplifie grandement l'utilisation de Redux. Installez les packages nécessaires :

```bash
npm install @reduxjs/toolkit react-redux
# ou
yarn add @reduxjs/toolkit react-redux
```

## **2. Concepts de base**

### **Redux en bref**

1. **Store** : Contient l'état global de l'application.
2. **Reducer** : Fonction pure qui détermine comment l'état change en réponse à des actions.
3. **Actions** : Objets décrivant une intention de modifier l'état.
4. **Dispatch** : Envoie une action au reducer pour mettre à jour le store.
5. **Selector** : Fonction pour lire une partie du state.

### **Pourquoi Redux Toolkit ?**

Redux Toolkit automatise beaucoup de tâches répétitives (création d'actions, de reducers, etc.) et simplifie la configuration.

---

## **3. Mise en place d'un projet Redux avec React**

### **Structure des fichiers**

#### **1. Structure Simple**

Convient aux petits projets ou lorsque l'application ne comporte qu'une ou deux fonctionnalités.

```
src/
├── store.js               # Configuration du store Redux
├── slices/
│   └── counterSlice.js    # Chaque fonctionnalité dispose de son slice
├── App.js                 # Composant principal
├── Counter.js             # Composant connecté au Redux
```

#### **2. Structure Évolutive**

Adaptée aux projets de grande taille ou complexes, où de nombreuses fonctionnalités nécessitent leur propre logique.

```
src/
├── app/
│   └── store.js           # Store central
├── features/
│   ├── counter/           # Fonctionnalité Counter
│   │   ├── counterSlice.js
│   │   ├── Counter.js     # Composant spécifique à Counter
│   │   └── Counter.test.js
│   ├── auth/              # Exemple d'autre fonctionnalité (Auth)
│   │   ├── authSlice.js
│   │   ├── Auth.js
│   │   └── Auth.test.js
├── App.js                 # Composant principal
```

## **3. Exemple avec la Structure Simple**

Nous allons construire une application React avec Redux Toolkit en utilisant la **structure simple** comme exemple.

---

### **Étape 1 : Configurer le Store**

Créez un fichier `store.js` pour centraliser la configuration du store :

#### `store.js`

```javascript
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer, // Associe le slice "counter" au store
  },
});
```

---

### **Étape 2 : Créer un Slice**

Un _slice_ regroupe l’état initial, les reducers et les actions d’une fonctionnalité dans un seul fichier.

#### `slices/counterSlice.js`

```javascript
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
```

---

### **Étape 3 : Intégrer Redux dans l'Application**

Utilisez le composant `Provider` de `react-redux` pour rendre le store accessible à l’ensemble de l’application.

#### `App.js`

```javascript
import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import Counter from "./Counter";

function App() {
  return (
    <Provider store={store}>
      <div>
        <h1>Redux Toolkit avec React</h1>
        <Counter />
      </div>
    </Provider>
  );
}

export default App;
```

---

### **Étape 4 : Créer un Composant Connecté**

Connectez un composant à Redux en utilisant les hooks `useSelector` pour accéder à l’état et `useDispatch` pour envoyer des actions.

#### `Counter.js`

```javascript
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, incrementByAmount } from "./slices/counterSlice";

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>
        Increment by 5
      </button>
    </div>
  );
}

export default Counter;
```

## **4. Fonctionnalités avancées**

### **Ajouter plusieurs slices**

Si vous avez plusieurs fonctionnalités (comme `auth`, `todos`, etc.), vous pouvez les ajouter au store dans le fichier `store.js` :

#### **store.js**

```javascript
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
  },
});
```

---

### **Créer des Selectors**

Les selectors permettent de lire des parties spécifiques de l'état global.

#### **Exemple**

```javascript
// counterSlice.js
export const selectCounterValue = (state) => state.counter.value;

// Counter.js
import { useSelector } from "react-redux";
import { selectCounterValue } from "../features/counter/counterSlice";

const count = useSelector(selectCounterValue);
```

---

### **Async Thunks pour les appels API**

Pour les opérations asynchrones, utilisez `createAsyncThunk` :

#### **counterSlice.js**

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRandomNumber = createAsyncThunk(
  "counter/fetchRandomNumber",
  async () => {
    const response = await fetch("https://randomuser.me/api/");
    const data = await response.json();
    return data.info.seed.length; // Exemple de valeur aléatoire
  }
);

const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
    status: "idle",
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRandomNumber.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRandomNumber.fulfilled, (state, action) => {
        state.value = action.payload;
        state.status = "idle";
      });
  },
});

export const { increment } = counterSlice.actions;
export default counterSlice.reducer;
```

#### **Utilisation dans le composant**

```javascript
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRandomNumber } from "../features/counter/counterSlice";

function Counter() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.counter.status);

  return (
    <div>
      <h2>Counter</h2>
      <button onClick={() => dispatch(fetchRandomNumber())}>
        Fetch Random Number
      </button>
      <p>Status: {status}</p>
    </div>
  );
}
```

---

## **5. Debugging avec Redux DevTools**

Redux Toolkit active automatiquement les DevTools. Installez l'extension [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) pour déboguer.

---

## **6. Redux vs Context API**

Utilisez Redux lorsque :

- Vous avez une gestion complexe de l'état global.
- Vous manipulez des états qui nécessitent des optimisations (ex. : grandes listes, API complexes).

---

Avec Redux Toolkit et React, vous pouvez facilement gérer les états globaux dans des applications modernes. 🚀
