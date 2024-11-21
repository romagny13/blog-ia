import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { loadMarkdownFiles } from "./utils/markdownLoader";
import { ThemeProvider } from "styled-components";
import "highlight.js/styles/github.css";
import Header from "./components/Header";
import GlobalStyle from "./GlobalStyle";
import {
  LayoutContainer,
  LeftNav,
  StyledLink
} from "./components/StyledComponents";
import ArticlePage from "./pages/ArticlePage";

export const theme = {
  // Enhanced Readability Light Theme
  background: "#FFFFFF", // Pure white
  secondaryBackground: "#F9FAFB", // Ultra-soft gray
  primaryText: "#1F2937", // Deep charcoal
  secondaryText: "#4B5563", // Dark gray
  link: "#E91E63", // Clear, vibrant blue
  button: "#FF4081",
  buttonHover: "#C2185B",
  border: "#E5E7EB", // Soft light gray
  sidebarBackground: "#F3F4F6", // Light gray
  accentError: "#DC2626", // Clear red
  focus: "#10B981", // Soft green
  code: "#E9ECEF", // Light gray for code blocks
  codeText: "#2C3E50", // Dark text for code
  gradientStart: "#FFFFFF",
  gradientEnd: "#F9FAFB"
};

function Router({ children }) {
  // Récupère le basename depuis vite.config.js
  const basename = import.meta.env.BASE_URL;

  return (
    <BrowserRouter basename={basename}>
      {children}
    </BrowserRouter>
  );
}

function App() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    setLoading(true);

    try {
      const loadedArticles = await loadMarkdownFiles();

      const categories = loadedArticles.reduce((acc, article) => {
        const category = article.frontmatter.category || "Autres"; // Utiliser la catégorie du frontmatter
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(article);
        return acc;
      }, {});

      setCategories(
        Object.entries(categories).map(([name, articles]) => ({
          name,
          articles
        }))
      );
      // console.log(loadedArticles);
    } catch (error) {
      console.error("Erreur de chargement des articles", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading) return <div>Chargement des articles...</div>;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Header />
      <Router>
        <LayoutContainer>
          <LeftNav>
            {categories.map((category) => (
              <div key={category.name}>
                <h3>{category.name}</h3>
                {category.articles.map((article) => (
                  <StyledLink
                    key={article.slug}
                    as={Link}
                    to={`/article/${article.slug}`}
                  >
                    {article.frontmatter.title}
                  </StyledLink>
                ))}
              </div>
            ))}
          </LeftNav>
          <Routes>
            <Route
              path="/"
              element={<p>Sélectionnez un article pour voir son contenu.</p>}
            />
            <Route
              path="/article/:slug"
              element={<ArticlePage articles={categories} />}
            />
          </Routes>
        </LayoutContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
