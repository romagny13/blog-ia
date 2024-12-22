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

## Cas spécifiques et bonnes pratiques

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

---

## Conclusion

Ce guide couvre les bases des opérations CRUD avec Firestore en JavaScript, ainsi que des cas spécifiques comme la suppression de champs ou l'utilisation de transactions. Firestore est un outil puissant et flexible pour gérer vos données. N'hésitez pas à explorer la [documentation officielle de Firestore](https://firebase.google.com/docs/firestore) pour en savoir plus.

