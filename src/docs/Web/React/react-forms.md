---
category: Web > React
title: React Forms
date: 2024-11-26
author: Romagny13
---

# React Forms

Voici un guide complet pour utiliser des bibliothèques de validation de formulaire avec React. Ce guide inclut des exemples d’utilisation de `react-hook-form` (avec et sans Yup) et de `Formik`, ainsi que des conseils, bonnes pratiques, forces et inconvénients de chaque bibliothèque.

## Introduction

Dans React, gérer la validation des formulaires peut devenir rapidement complexe, surtout lorsqu'il s'agit de garantir une validation côté client robuste et fluide. Heureusement, plusieurs bibliothèques existent pour simplifier ce processus. Parmi les plus populaires, on trouve `react-hook-form` et `Formik`. Ces bibliothèques permettent de créer des formulaires performants et valides avec peu de code.

---

### **1. React Hook Form (RHF)**

#### **Pourquoi choisir React Hook Form ?**

- **Légèreté et Performance** : `react-hook-form` est léger et n’a pas besoin de re-rendering complet du composant à chaque changement, ce qui améliore les performances des grands formulaires.
- **Facilité d’intégration** : Très facile à intégrer dans une application React, et l’API est simple à utiliser.
- **Moins de code, plus d’efficacité** : Moins de boilerplate que d’autres bibliothèques comme Formik.

#### **Installation**

```bash
npm install react-hook-form
```

#### **Exemple de formulaire classique sans Yup**

Voici un exemple d'un formulaire de login sans validation externe comme Yup.

```jsx
import React from "react";
import { useForm } from "react-hook-form";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input {...register("email", { required: "Email is required" })} />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
```

#### **Validation avec Yup**

Si vous avez besoin de validations plus complexes, vous pouvez utiliser `Yup` pour définir un schéma de validation.

##### **Installation**

```bash
npm install yup @hookform/resolvers
```

##### **Exemple avec Yup**

```jsx
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...register("password")} />
        {errors.password && <span>{errors.password.message}</span>}
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
```

---

### **2. Formik**

#### **Pourquoi choisir Formik ?**

- **Flexibilité** : Formik est plus flexible et offre plus d'options et de contrôle pour la gestion des erreurs et de l’état du formulaire.
- **API plus riche** : Si vous avez besoin de fonctionnalités avancées comme des validations conditionnelles ou des valeurs calculées, Formik est un excellent choix.
- **Communauté et documentation** : Formik a une large communauté et une excellente documentation, ce qui facilite son adoption et son intégration dans les projets React.

#### **Installation**

```bash
npm install formik
```

#### **Exemple de formulaire classique avec Formik**

```jsx
import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginForm = () => {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => console.log(values)}
    >
      <Form>
        <div>
          <label>Email</label>
          <Field name="email" type="email" />
          <ErrorMessage name="email" component="div" />
        </div>
        <div>
          <label>Password</label>
          <Field name="password" type="password" />
          <ErrorMessage name="password" component="div" />
        </div>
        <button type="submit">Login</button>
      </Form>
    </Formik>
  );
};

export default LoginForm;
```

---

### **Comparaison : React Hook Form vs Formik**

| **Caractéristiques**       | **React Hook Form**                                      | **Formik**                                                |
| -------------------------- | -------------------------------------------------------- | --------------------------------------------------------- |
| **Performance**            | Très léger, pas de re-rendu à chaque changement de champ | Plus lourd, plus de re-rendu                              |
| **Facilité d’intégration** | Facile à intégrer et à utiliser                          | Plus d’options, mais plus complexe                        |
| **Validation**             | Supporte Yup pour une validation simple                  | Validation native et Yup intégré                          |
| **Contrôle de l’état**     | Moins d’intrusion dans l’état du formulaire              | Plus de contrôle de l’état, gestion détaillée de l’erreur |
| **Popularité**             | Plus populaire en 2025                                   | Très populaire mais plus lourd                            |
| **Documentation**          | Très bonne                                               | Excellente                                                |

---

### **Conseils et Bonnes Pratiques**

1. **Réduction des re-rendus** : Utilisez `react-hook-form` si la performance est cruciale, car il minimise les re-rendus du composant.
2. **Validation externe** : Utilisez `Yup` avec `react-hook-form` ou Formik pour des validations plus complexes.
3. **Formulaires complexes** : Si vous avez des formulaires avec de multiples étapes ou des champs dynamiques, Formik peut être plus adapté.
4. **Gestion des erreurs** : `react-hook-form` rend plus simple la gestion des erreurs sur les champs individuels. Formik, cependant, est plus flexible pour des messages d’erreur personnalisés.

---

### **Pourquoi React Hook Form est plus populaire ?**

- **Simplicité et Performance** : Son approche légère et la facilité d’intégration font de React Hook Form le choix préféré des développeurs.
- **Moins de Boilerplate** : Moins de code à écrire et une approche déclarative qui facilite la gestion des formulaires dans des applications React.
- **Écosystème** : Sa popularité se reflète dans son large écosystème, ce qui permet de trouver rapidement des solutions à des problèmes courants.

---

### **3. Validation de Formulaire Manuelle : Controlled vs Uncontrolled**

Dans certains cas, vous pourriez préférer gérer la validation de formulaire vous-même, sans recourir à une bibliothèque comme `react-hook-form` ou `Formik`. Cela peut être utile lorsque vous avez des besoins très spécifiques ou lorsque vous voulez garder un contrôle total sur la logique de validation.

#### **1. Formulaire Controlled**

Un formulaire **controlled** est celui où chaque champ du formulaire est contrôlé par l'état de React. Cela signifie que vous devez explicitement définir et mettre à jour l'état pour chaque champ via les `useState` et `onChange` de React.

##### **Exemple de formulaire controlled avec validation manuelle**

```jsx
import React, { useState } from "react";

const ControlledForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // return true if no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted", formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span>{errors.email}</span>}
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <span>{errors.password}</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ControlledForm;
```

##### **Avantages du formulaire controlled** :

- **Contrôle total** sur l’état et la logique de validation. Vous pouvez facilement manipuler l’état du formulaire et le processus de validation à votre guise.
- **Prévisible** : Le formulaire est entièrement géré par React, ce qui rend son comportement facile à comprendre.

##### **Inconvénients du formulaire controlled** :

- **Plus de code à écrire** : Vous devez gérer chaque champ individuellement, ce qui peut devenir fastidieux pour les formulaires complexes.
- **Re-rendu fréquent** : Comme chaque champ est lié à un état, le formulaire peut être ré-rendu à chaque modification, ce qui peut impacter la performance dans des formulaires très grands.

#### **2. Formulaire Uncontrolled**

Un formulaire **uncontrolled** repose sur le DOM natif pour gérer la valeur des champs. Au lieu d'utiliser l'état React pour chaque champ, vous laissez les éléments DOM gérer leur propre état. Vous utilisez des références (via `ref`) pour accéder aux valeurs au moment de la soumission.

##### **Exemple de formulaire uncontrolled avec validation manuelle**

```jsx
import React, { useRef } from "react";

const UncontrolledForm = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!emailRef.current.value) newErrors.email = "Email is required";
    if (!passwordRef.current.value) newErrors.password = "Password is required";
    else if (passwordRef.current.value.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // return true if no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input type="email" ref={emailRef} />
        {errors.email && <span>{errors.email}</span>}
      </div>
      <div>
        <label>Password</label>
        <input type="password" ref={passwordRef} />
        {errors.password && <span>{errors.password}</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default UncontrolledForm;
```

##### **Avantages du formulaire uncontrolled** :

- **Simplicité** : Moins de gestion de l’état dans votre code, car vous laissez le DOM faire la gestion des valeurs.
- **Meilleure performance** : Moins de re-rendus, car React ne suit pas l'état de chaque champ individuellement.

##### **Inconvénients du formulaire uncontrolled** :

- **Moins de contrôle** : Il est plus difficile de suivre l’état du formulaire dans l’application React, ce qui peut compliquer la gestion d’interactions complexes.
- **Accès aux valeurs moins direct** : Vous devez utiliser `refs` pour accéder aux valeurs, ce qui peut rendre le code moins intuitif.

---

### **Quel est le meilleur ?**

Le choix entre **controlled** et **uncontrolled** dépend des besoins de votre projet.

- **Formulaire controlled** :

  - Utilisez-le lorsque vous avez besoin d'un contrôle total sur les valeurs et la logique de validation. C'est idéal pour des formulaires complexes ou si vous souhaitez intégrer un état global ou interagir avec des éléments extérieurs (comme Redux).
  - Pratique pour les formulaires où vous voulez mettre en place une logique conditionnelle, un pré-remplissage ou des effets sur l’état de validation.

- **Formulaire uncontrolled** :
  - Utilisez-le lorsque vous cherchez à simplifier votre code et éviter des re-rendus fréquents. C'est une bonne option pour des formulaires simples où la performance est une priorité.
  - Les formulaires avec une petite quantité de champs, où la gestion de l'état peut être inutilement complexe, bénéficient de cette approche.

---

Voici un ajout concis à ton guide concernant le pré-remplissage des champs dans un formulaire **controlled** avec React :

---

### Pré-remplissage des champs dans un formulaire **Controlled**

Dans un formulaire **controlled**, les champs de saisie dépendent de l'état React, ce qui empêche le navigateur de pré-remplir automatiquement les champs comme il le ferait dans un formulaire **uncontrolled**. Toutefois, pour permettre au navigateur de pré-remplir des champs comme l'email ou le mot de passe, voici quelques bonnes pratiques :

1. **Utiliser `autoComplete`** : Ajoute l'attribut `autoComplete` pour indiquer au navigateur que ces champs peuvent être pré-remplis. Par exemple, `autoComplete="email"` pour l'email et `autoComplete="current-password"` pour le mot de passe.
2. **Initialiser l'état avec des valeurs enregistrées** : Si tu veux que les champs soient pré-remplis avec des valeurs existantes, initialise les champs avec des valeurs sauvegardées dans un stockage local comme `localStorage` ou `sessionStorage`.

3. **Exemple avec `useEffect`** :
   Utilise `useEffect` pour récupérer les valeurs pré-enregistrées et les injecter dans l'état du formulaire lors du montage du composant :

   ```jsx
   useEffect(() => {
     const savedEmail = localStorage.getItem("email");
     if (savedEmail) {
       setFormData((prevData) => ({ ...prevData, email: savedEmail }));
     }
   }, []);
   ```

Cela permet au navigateur de pré-remplir les champs tout en maintenant l'approche **controlled**.

---

Cela résume le pré-remplissage dans un formulaire **controlled** tout en restant concis et pratique pour ton guide.

### **Conclusion sur le choix de la bibliothèque et du type de formulaire**

- **React Hook Form** et **Formik** sont souvent préférés dans les cas où vous avez besoin de validations robustes et d’une gestion étroite de l’état des champs. Si vous avez des formulaires complexes, ces bibliothèques sont les meilleures options.
- Si vous souhaitez un contrôle total ou préférez éviter les dépendances externes, implémenter votre propre validation avec des formulaires controlled ou uncontrolled peut être une bonne solution. Pour les formulaires simples, un formulaire uncontrolled peut suffire.

Dans l'ensemble, il est important de choisir la méthode qui s’adapte le mieux aux besoins de votre projet, en prenant en compte la complexité, les performances et la maintenabilité.
