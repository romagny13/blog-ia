---
category: Firebase
title: Firebase Auth
date: 2024-12-22
author: Romagny13
---

# Guide : Authentication avec Firebase, JavaScript et React

Ce guide vous explique comment mettre en place une solution d'authentification complète avec Firebase, en gérant plusieurs fournisseurs (Google, Facebook, Email/Password, etc.) et en intégrant l'utilisateur actuel à votre application avec soit la Context API, soit Redux.

---

## Prérequis

1. **Compte Firebase** : Créez un projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com/).
2. **Initialisation de Firebase dans votre projet** : Ajoutez le SDK Firebase à votre projet React.

**Exemple :**

```javascript
// firebase.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export default app;
```

---

## Configuration des providers dans Firebase

Configurer plusieurs providers d'authentification dans Firebase permet d'offrir une plus grande flexibilité aux utilisateurs en leur permettant de choisir leur méthode préférée pour se connecter. Cela améliore également l'expérience utilisateur, car certains utilisateurs préfèrent utiliser des réseaux sociaux comme Google ou Facebook, tandis que d'autres optent pour des méthodes traditionnelles comme l'email et le mot de passe. En diversifiant les options, vous augmentez également les chances de conversion pour les utilisateurs hésitants ou rencontrant des problèmes avec un provider spécifique.

1. Accédez à **Authentication > Sign-in method** dans la console Firebase.
2. Activez les fournisseurs souhaités (Google, Facebook, Email/Password, etc.).

---

## Créer un AuthService

L'`AuthService` encapsule toutes les interactions avec Firebase Auth. Cela permet de centraliser la logique d'authentification dans un seul endroit, ce qui rend votre code plus propre, maintenable et facile à modifier ou étendre. En utilisant un service dédié, vous évitez la duplication de code et réduisez les erreurs potentielles en ayant une source unique pour gérer l'authentification. Ce service agit comme une couche intermédiaire entre votre application et Firebase, facilitant les changements futurs si vous souhaitez remplacer Firebase par une autre solution.

L'`AuthService` encapsule toutes les interactions avec Firebase Auth.

```javascript
// AuthService.js
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import app from "./firebase";

const auth = getAuth(app);

class AuthService {
  static signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  static signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    return signInWithPopup(auth, provider);
  }

  static signInWithEmail(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  static registerWithEmail(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  static signOutUser() {
    return signOut(auth);
  }

  static onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }

  static getCurrentUser() {
    return auth.currentUser;
  }
}

export default AuthService;
```

---

## Gérer l'utilisateur avec Context API

### **Créer un `UserProvider`**

La Context API de React est une fonctionnalité intégrée qui permet de partager des données, comme l'état utilisateur, entre plusieurs composants sans avoir à passer des props manuellement à chaque niveau. Cela est particulièrement utile dans les applications où plusieurs composants ont besoin d'accéder à l'utilisateur connecté, car cela simplifie le code et améliore la lisibilité. En utilisant un `UserProvider`, vous centralisez la gestion de l'utilisateur et facilitez l'accès à cette information dans toute l'application.

```javascript
// UserProvider.js
import React, { createContext, useState, useEffect, useContext } from "react";
import AuthService from "./AuthService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
```

### **Utiliser le UserProvider dans l'application**

```javascript
// App.jsx
import React from "react";
import { UserProvider } from "./UserProvider";
import Header from "./Header";
import TaskList from "./TaskList";

const App = () => (
  <UserProvider>
    <Header />
    <TaskList />
  </UserProvider>
);

export default App;
```

### **Exemple dans le Header**

```javascript
// Header.jsx
import React from "react";
import { useUser } from "./UserProvider";
import AuthService from "./AuthService";

const Header = () => {
  const user = useUser();

  const handleAuthAction = async () => {
    if (user) {
      await AuthService.signOutUser();
    } else {
      await AuthService.signInWithGoogle();
    }
  };

  return (
    <header>
      <h1>My App</h1>
      <button onClick={handleAuthAction}>{user ? "Logout" : "Login"}</button>
    </header>
  );
};

export default Header;
```

---

## Gérer l'utilisateur avec Redux

Redux permet de centraliser et de gérer l'état utilisateur dans une application React de manière prévisible. Dans le cadre de l'authentification avec Firebase, Redux facilite le suivi de l'état de l'utilisateur (connecté ou non) à travers l'application. Lorsque l'utilisateur se connecte ou se déconnecte, Redux met à jour l'état global, permettant à tous les composants d'y accéder facilement sans devoir passer des props manuellement. Cette approche est particulièrement utile pour les applications où l'état utilisateur doit être partagé entre plusieurs composants de manière claire et maintenable.

### **Configurer Redux**

1. Installez Redux et Redux Toolkit :

   ```bash
   npm install @reduxjs/toolkit react-redux
   ```

2. Créez un slice pour l'utilisateur :

```javascript
// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser: (state, action) => action.payload,
    clearUser: () => null,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
```

3. Configurez le store Redux :

```javascript
// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
```

4. Ajoutez un `listener` pour Firebase Auth dans `App.jsx` :

```javascript
// App.jsx
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "./userSlice";
import AuthService from "./AuthService";
import { Provider } from "react-redux";
import store from "./store";

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div>
      <Header />
      <TaskList />
    </div>
  );
};

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
```

---

## Bonnes pratiques

1. **Encapsulez Firebase** : Utilisez un service comme `AuthService` pour éviter les dépendances directes.
2. **Centralisez l'état utilisateur** : Utilisez un gestionnaire global (Context API ou Redux) pour éviter de passer des props.
3. **Gérez les erreurs** : Ajoutez des messages d'erreur clairs pour guider les utilisateurs.
4. **Liez plusieurs comptes** : Utilisez `linkWithCredential` pour permettre aux utilisateurs de connecter plusieurs providers à un seul compte.
5. **Sécurisez votre application** : Limitez l'accès à certaines ressources en utilisant les règles Firebase.

---

Ce guide couvre les bases et les bonnes pratiques pour gérer l'authentification avec Firebase dans une application React. Si vous avez besoin d'exemples spécifiques ou de détails supplémentaires, n'hésitez pas à demander !
