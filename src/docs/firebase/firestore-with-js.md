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
  email: "marie.curie@example.com",
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
  email: "jean.dupont@example.com",
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

### 4. `doc()`, `getDoc()`, `getDocs()`, et `collection()`

#### 1. Fonction `doc()`

La fonction **`doc()`** permet de **créer une référence à un document spécifique** dans une collection Firestore. Elle ne récupère pas les données du document, mais elle fournit une référence pour effectuer des actions comme la lecture, la mise à jour ou la suppression.

##### Syntaxe

```javascript
const userRef = doc(db, "users", userId);
```

###### Paramètres :

- **`db`** : L'instance de la base de données Firestore.
- **`"users"`** : Le nom de la collection où le document est stocké.
- **`userId`** : L'ID unique du document dans la collection.

##### Cas d'utilisation

Utilisez **`doc()`** pour créer une référence à un document et effectuer une opération (lecture, mise à jour, suppression) plus tard.

##### Exemple :

```javascript
const userRef = doc(db, "users", userId); // Crée une référence au document de l'utilisateur
```

---

#### 2. Fonction `collection()`

La fonction **`collection()`** permet de **créer une référence à une collection entière** dans Firestore. Contrairement à **`doc()`**, qui cible un document spécifique, **`collection()`** vous permet d'interagir avec tous les documents d'une collection donnée.

##### Syntaxe

```javascript
const usersCollectionRef = collection(db, "users");
```

##### Paramètres :

- **`db`** : L'instance de la base de données Firestore.
- **`"users"`** : Le nom de la collection à laquelle vous voulez faire référence.

##### Cas d'utilisation

Utilisez **`collection()`** lorsque vous souhaitez interagir avec une **collection entière**, par exemple pour ajouter un nouveau document ou récupérer tous les documents de la collection.

##### Exemple :

```javascript
const usersCollectionRef = collection(db, "users"); // Crée une référence à la collection "users"
```

---

#### 3. Fonction `getDoc()`

La fonction **`getDoc()`** permet de **récupérer le contenu d'un document** spécifique en utilisant sa référence (créée avec `doc()`).

##### Syntaxe

```javascript
const docSnap = await getDoc(userRef);
```

##### Paramètres :

- **`userRef`** : La référence au document, obtenue via **`doc()`**.

##### Cas d'utilisation

Utilisez **`getDoc()`** lorsque vous devez **récupérer les données réelles** d'un document Firestore.

###### Exemple :

```javascript
const docSnap = await getDoc(userRef); // Récupère les données du document de l'utilisateur
if (docSnap.exists()) {
  console.log(docSnap.data()); // Affiche les données de l'utilisateur
} else {
  console.log("Aucun utilisateur trouvé avec cet ID");
}
```

---

#### 4. Fonction `getDocs()`

La fonction **`getDocs()`** permet de **récupérer tous les documents d'une collection**. Contrairement à **`getDoc()`** qui ne récupère qu'un document, **`getDocs()`** est utilisé pour obtenir plusieurs documents.

##### Syntaxe

```javascript
import { collection, getDocs } from "firebase/firestore";

const querySnapshot = await getDocs(collection(db, "users"));
querySnapshot.forEach((doc) => {
  console.log(doc.id, doc.data()); // Affiche l'ID et les données de chaque document
});
```

##### Cas d'utilisation

Utilisez **`getDocs()`** lorsque vous souhaitez récupérer **tous les documents d'une collection**, par exemple pour afficher une liste d'utilisateurs.

---

#### 5. Comparaison entre `doc()`, `collection()`, `getDoc()` et `getDocs()`

| Fonction           | Description                                          | Cas d'utilisation                                                                      |
| ------------------ | ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **`doc()`**        | Crée une référence à un document spécifique          | Utilisé pour préparer des actions sur un document (lecture, mise à jour).              |
| **`collection()`** | Crée une référence à une collection entière          | Utilisé pour interagir avec tous les documents d'une collection (ajout, récupération). |
| **`getDoc()`**     | Récupère les données d'un document avec sa référence | Utilisé pour lire les données d'un document spécifique.                                |
| **`getDocs()`**    | Récupère tous les documents d'une collection         | Utilisé pour lire les données de tous les documents d'une collection.                  |

---

#### 6. Exemple Complet : Récupérer les Informations d'un Utilisateur

Imaginons que vous souhaitiez récupérer les informations d'un utilisateur à partir de son `userId`. Voici comment procéder :

##### Étape 1 : Créer une référence au document

```javascript
const userRef = doc(db, "users", userId); // Crée une référence au document de l'utilisateur
```

##### Étape 2 : Récupérer les données du document

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

##### Exemple pour récupérer tous les utilisateurs de la collection

Si vous voulez récupérer tous les utilisateurs d'une collection `users`, utilisez **`getDocs()`** :

```javascript
const usersCollectionRef = collection(db, "users"); // Crée une référence à la collection "users"
const querySnapshot = await getDocs(usersCollectionRef); // Récupère tous les documents
querySnapshot.forEach((doc) => {
  console.log(doc.id, doc.data()); // Affiche l'ID et les données de chaque document
});
```

---

#### 7. Conclusion

- **`doc()`** : Crée une référence à un **document spécifique** sans récupérer ses données.
- **`collection()`** : Crée une référence à une **collection entière**.
- **`getDoc()`** : Permet de **récupérer les données d'un document** à partir de sa référence.
- **`getDocs()`** : Permet de **récupérer tous les documents d'une collection**.

Ces fonctions permettent de manipuler les documents et les collections dans Firestore de manière flexible et efficace.
