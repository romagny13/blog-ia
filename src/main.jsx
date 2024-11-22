import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./fonts.css";
import "./index.css";
import App from "./App.jsx";

function Router({ children }) {
  // Récupère le basename depuis vite.config.js
  const basename = import.meta.env.BASE_URL;
  // console.log(basename);
  return <BrowserRouter basename="/blog-ia">{children}</BrowserRouter>;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
