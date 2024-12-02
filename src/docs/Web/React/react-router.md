---
category: Web > React
title: React Router
date: 2024-12-02
author: Romagny13
---

## **1. Installation de React Router**

Pour installer React Router dans votre projet, utilisez npm ou yarn :

```bash
npm install react-router-dom
# ou
yarn add react-router-dom
```

---

## **2. Concepts de base**

### **Composants principaux**

- **`<BrowserRouter>`** : Enveloppe principale pour activer la gestion des routes dans le navigateur.
- **`<Routes>`** et **`<Route>`** : Définissent les routes et leurs composants associés.
- **`<Link>`** : Crée des liens de navigation.
- **`useNavigate`** : Hook pour naviguer par programmation.
- **`useParams`** : Accède aux paramètres de l'URL.
- **`useLocation`** : Permet d'accéder à l'emplacement actuel.

---

## **3. Exemple de configuration de base**

Voici une configuration typique pour démarrer avec React Router :

### **Structure des fichiers**

```
src/
├── App.js
├── pages/
│   ├── Home.js
│   ├── About.js
│   ├── Contact.js
```

### **Code : App.js**

```jsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link> |{" "}
        <Link to="/contact">Contact</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## **4. Gestion des paramètres d'URL**

### **Route dynamique avec `useParams`**

Parfois, une route peut contenir des segments dynamiques. Exemple : `/product/:id`.

#### **Exemple**

```jsx
import React from "react";
import { useParams } from "react-router-dom";

function Product() {
  const { id } = useParams();
  return <h1>Product ID: {id}</h1>;
}

export default Product;
```

#### **Ajouter une route dynamique**

```jsx
<Routes>
  <Route path="/product/:id" element={<Product />} />
</Routes>
```

---

## **5. Navigation programmatique avec `useNavigate`**

### **Exemple**

```jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const goToContact = () => {
    navigate("/contact");
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={goToContact}>Go to Contact</button>
    </div>
  );
}

export default Home;
```

---

## **6. Gestion des routes imbriquées**

React Router permet de créer des routes imbriquées, où une route parent peut afficher des composants enfants dans son propre contexte.

#### **Exemple**

```jsx
import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="stats">Stats</Link> | <Link to="settings">Settings</Link>
      </nav>
      <Outlet />
    </div>
  );
}

function Stats() {
  return <h2>Stats</h2>;
}

function Settings() {
  return <h2>Settings</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="stats" element={<Stats />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## **7. Redirections avec `Navigate`**

Pour rediriger l'utilisateur d'une route à une autre, utilisez **`<Navigate>`**.

#### **Exemple**

```jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/old-route" element={<Navigate to="/new-route" />} />
      <Route path="/new-route" element={<NewRoute />} />
    </Routes>
  );
}
```

---

## **8. Gestion des erreurs (404)**

Ajoutez une route "catch-all" avec `*` pour gérer les erreurs 404.

#### **Exemple**

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="*" element={<h1>404 - Page Not Found</h1>} />
</Routes>
```

---

## **9. Lazy Loading avec `React.lazy`**

Pour améliorer les performances, vous pouvez charger vos composants à la demande.

#### **Exemple**

```jsx
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
```

---

## **10. Hooks supplémentaires**

- **`useSearchParams`** : Manipule les paramètres de requête (query string).
- **`useRouteError`** : Gère les erreurs liées aux routes.

#### **Exemple : `useSearchParams`**

```jsx
import React from "react";
import { useSearchParams } from "react-router-dom";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = () => {
    setSearchParams({ query: "react" });
  };

  return (
    <div>
      <h1>Search Page</h1>
      <p>Current Query: {searchParams.get("query")}</p>
      <button onClick={handleSearch}>Search React</button>
    </div>
  );
}
```

---

## **11. Routes protégées (Protected Routes)**

Protégez certaines routes en vérifiant les droits d'accès.

#### **Exemple**

```jsx
import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ isAuth, children }) {
  if (!isAuth) {
    return <Navigate to="/login" />;
  }
  return children;
}

// Usage
<Routes>
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute isAuth={userIsLoggedIn}>
        <Dashboard />
      </ProtectedRoute>
    }
  />
</Routes>;
```

---

## **12. Outils utiles**

- **React Router DevTools** : [Extension pour déboguer](https://reactrouter.com/web/guides/debugging).
- **Doc officielle** : [reactrouter.com](https://reactrouter.com).

---

Avec ces fonctionnalités, vous devriez être en mesure de construire des applications robustes et bien structurées avec React Router. 🚀
