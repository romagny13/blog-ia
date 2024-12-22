---
category: Firebase
title: Firestore en JavaScript
date: 2024-12-22
author: Romagny13
---

# Guide Complet : CRUD avec Firebase Firestore en JavaScript

Ce guide explique comment effectuer les opérations CRUD (Create, Read, Update, Delete) avec Firebase Firestore en JavaScript. Il inclut des cas spécifiques pour mieux comprendre l'utilisation des fonctionnalités de Firestore.

---

## Prérequis

Avant de commencer, assurez-vous :
- D'avoir un projet Firebase configuré.
- D'avoir installé le SDK Firebase dans votre projet :
  ```bash
  npm install firebase
  ```
- D'avoir initialisé Firestore dans votre application.

### Initialisation de Firestore

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```

---

## 1. **Créer (Create)**

Firestore offre deux méthodes principales pour ajouter des documents : `addDoc()` et `setDoc()`.

### Utiliser `addDoc` (ID généré automatiquement)

```javascript
import { collection, addDoc } from "firebase/firestore";

const docRef = await addDoc(collection(db, "users"), {
  name: "Marie Curie",
  age: 35,
  email: "marie.curie@example.com"
});

console.log("Document added with ID: ", docRef.id);
```

- **Avantages** : ID généré automatiquement.
- **Cas d'usage** : Ajouter rapidement des documents sans se soucier des ID.

### Utiliser `setDoc` (ID personnalisé ou spécifique)

```javascript
import { doc, setDoc } from "firebase/firestore";

await setDoc(doc(db, "users", "user123"), {
  name: "Jean Dupont",
  age: 30,
  email: "jean.dupont@example.com"
});

console.log("Document written successfully!");
```

- **Avantages** : Permet de spécifier un ID.
- **Cas d'usage** : Cas où un ID spécifique est nécessaire (e.g., identifiant utilisateur).

#### Fusionner les champs existants avec `setDoc`

Pour éviter d'écraser les données existantes :

```javascript
await setDoc(doc(db, "users", "user123"), { city: "Paris" }, { merge: true });
```

---

## 2. **Lire (Read)**

Firestore offre plusieurs méthodes pour lire les documents : `getDoc` et `getDocs`.

### Lire un document spécifique

```javascript
import { doc, getDoc } from "firebase/firestore";

const docRef = doc(db, "users", "user123");
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
} else {
  console.log("No such document!");
}
```

### Lire tous les documents d'une collection

```javascript
import { collection, getDocs } from "firebase/firestore";

const querySnapshot = await getDocs(collection(db, "users"));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} =>`, doc.data());
});
```

---

## 3. **Mettre à jour (Update)**

Pour mettre à jour des champs existants sans écraser le document entier, utilisez `updateDoc`.

### Mise à jour de champs spécifiques

```javascript
import { doc, updateDoc } from "firebase/firestore";

const docRef = doc(db, "users", "user123");

await updateDoc(docRef, {
  age: 31,
  city: "Paris",
});

console.log("Document updated successfully!");
```

### Supprimer un champ

Pour supprimer un champ d'un document, utilisez `deleteField` :

```javascript
import { deleteField } from "firebase/firestore";

await updateDoc(docRef, {
  email: deleteField(),
});

console.log("Field deleted successfully!");
```

---

## 4. **Supprimer (Delete)**

Pour supprimer un document entier, utilisez `deleteDoc`.

### Supprimer un document

```javascript
import { doc, deleteDoc } from "firebase/firestore";

await deleteDoc(doc(db, "users", "user123"));

console.log("Document deleted successfully!");
```

---

## 5. Cas spécifiques et bonnes pratiques

### 1. Gestion des erreurs

Toujours inclure des blocs `try-catch` pour gérer les erreurs :

```javascript
try {
  const docRef = await addDoc(collection(db, "users"), { name: "Test" });
  console.log("Document added: ", docRef.id);
} catch (error) {
  console.error("Error adding document: ", error);
}
```

### 2. Utiliser des transactions

Pour des opérations atomiques sur plusieurs documents :

```javascript
import { runTransaction, doc } from "firebase/firestore";

try {
  await runTransaction(db, async (transaction) => {
    const docRef = doc(db, "users", "user123");
    const docSnap = await transaction.get(docRef);

    if (!docSnap.exists()) {
      throw "Document does not exist!";
    }

    const newAge = docSnap.data().age + 1;
    transaction.update(docRef, { age: newAge });
  });

  console.log("Transaction successfully committed!");
} catch (error) {
  console.error("Transaction failed: ", error);
}
```

### 3. Indexation des requêtes complexes

Si vous utilisez des requêtes complexes avec plusieurs conditions (e.g., `where`), pensez à créer des index personnalisés dans la console Firebase.


### 4. Différence entre `doc()` et `getDoc()` dans Firestore

Dans Firestore, `doc()` et `getDoc()` sont deux fonctions essentielles, mais elles ont des rôles distincts. Cette page explique leur différence et comment les utiliser dans des cas spécifiques.

#### 1. Fonction `doc()`

La fonction `doc()` permet de **créer une référence** à un document spécifique dans une collection de Firestore. Elle ne permet pas de récupérer les données du document, mais fournit une référence pour effectuer des actions sur ce document (lecture, mise à jour, suppression).

##### Syntaxe
```javascript
const userRef = doc(db, "users", userId);
```

- **Paramètres** :
  - `db` : L'instance de votre base de données Firestore.
  - `"users"` : Le nom de la collection où le document est stocké.
  - `userId` : L'ID unique du document dans la collection.

##### Cas d'utilisation spécifique
Vous utilisez `doc()` lorsque vous avez besoin de créer une référence à un document pour y effectuer une opération ultérieure (lecture, mise à jour, suppression). Par exemple, vous pouvez l'utiliser pour préparer la mise à jour des informations d'un utilisateur :

```javascript
const userRef = doc(db, "users", userId); // Créer une référence à l'utilisateur avec userId
```

---

#### 2. Fonction `getDoc()`

La fonction `getDoc()` permet de **récupérer le contenu d'un document** dans Firestore. Elle prend en paramètre une référence de document créée avec `doc()` et retourne un **DocumentSnapshot**, qui contient les données du document.

##### Syntaxe
```javascript
const docSnap = await getDoc(userRef);
```

- **Paramètres** :
  - `userRef` : La référence au document, obtenue via `doc()`.

##### Cas d'utilisation spécifique
Vous utilisez `getDoc()` pour récupérer les données réelles d'un document Firestore. Par exemple, vous pouvez l'utiliser pour obtenir les informations d'un utilisateur basé sur son `userId` :

```javascript
const docSnap = await getDoc(userRef); // Récupérer les données du document de l'utilisateur
if (docSnap.exists()) {
  console.log(docSnap.data()); // Affiche les données de l'utilisateur
} else {
  console.log("Aucun utilisateur trouvé avec cet ID");
}
```

---

### Résumé des différences

| Fonction     | Description                                             | Cas d'utilisation                                                                 |
|--------------|---------------------------------------------------------|----------------------------------------------------------------------------------|
| `doc()`      | Crée une référence à un document dans Firestore         | Utilisé pour préparer des actions sur un document, comme une mise à jour.        |
| `getDoc()`   | Récupère les données d'un document en utilisant une référence | Utilisé pour lire les données d'un document (par exemple, récupérer les infos utilisateur). |

---

### Exemple Complet : Récupérer les Informations d'un Utilisateur

Imaginons que vous souhaitiez récupérer les informations d'un utilisateur en utilisant son `userId`. Voici comment procéder avec `doc()` et `getDoc()` :

#### Étape 1 : Créer une référence au document
```javascript
const userRef = doc(db, "users", userId); // Crée une référence au document de l'utilisateur
```

#### Étape 2 : Récupérer les données du document
```javascript
try {
  const docSnap = await getDoc(userRef); // Récupère le document
  if (docSnap.exists()) {
    console.log("Données de l'utilisateur :", docSnap.data()); // Affiche les données
  } else {
    console.log("Aucun utilisateur trouvé avec cet ID");
  }
} catch (error) {
  console.error("Erreur lors de la récupération des données :", error);
}
```

---

### Conclusion

- **`doc()`** est utilisé pour obtenir une référence à un document sans récupérer ses données.
- **`getDoc()`** est utilisé pour récupérer les données du document en utilisant cette référence.

Ces deux fonctions travaillent ensemble pour permettre des opérations de lecture et de mise à jour dans Firestore.
```