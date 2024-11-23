import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useParams,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { loadMarkdownFiles } from "./utils/markdownLoader";
import styled, { ThemeProvider } from "styled-components";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ResizableSidebar from "./components/ResizableSidebar";
import ArticleView from "./components/ArticleView";
import BackToTopButton from "./components/BackToTopButton";
import GlobalStyle from "./GlobalStyle";
import { theme } from "./themes";
import CollapsibleTOC from "./components/CollapsibleTOC";

const AppContainer = styled.div`
  display: flex;
  height: 100vh; /* Assurez-vous que le conteneur principal prend toute la hauteur */
  width: 100%; /* Ajoutez cette ligne pour vous assurer que la largeur totale est contrôlée */
  overflow: hidden; /* Empêcher le débordement */
`;

const MainContent = styled.div`
  flex: 1; /* Prend toute la largeur restante */
  overflow-y: auto; /* Permet le défilement du contenu principal */
`;

function buildCategoryTree(articles) {
  const root = {};

  articles.forEach((article) => {
    const categories = article.frontmatter.category.split(" > ");
    let current = root;

    categories.forEach((category, index) => {
      // Ajout de la catégorie si elle n'existe pas
      if (!current[category]) {
        current[category] = { articles: [], subCategories: {} };
      }

      // Ajout de l'article si c'est le dernier niveau
      if (index === categories.length - 1) {
        current[category].articles.push({
          title: article.frontmatter.title,
          slug: article.slug,
        });
      }

      // Move vers la sous-catégorie
      current = current[category].subCategories;
    });
  });
  // console.log("root", root);
  return root;
}

const ArticleRoute = ({ articles, onTocCallback }) => {
  const { slug } = useParams();
  const article = articles.find((article) => article.slug === slug);

  if (!article) return <Navigate to="/" replace />;

  return <ArticleView article={article} tocCallback={onTocCallback} />;
};

const App = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState({});

  const [toc, setToc] = useState([]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const loadedArticles = await loadMarkdownFiles();
        const categoryTree = buildCategoryTree(loadedArticles);
        setCategories(categoryTree);
        setArticles(loadedArticles);
      } catch (error) {
        console.error("Error loading articles:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    // Récupère le paramètre `redirect` depuis l'URL
    const params = new URLSearchParams(window.location.search);
    const redirectPath = params.get("redirect");
    if (redirectPath) {
      // Décoder le chemin avant de naviguer
      const decodedPath = decodeURIComponent(
        redirectPath + window.location.hash
      );
      // Navigue vers le chemin demandé
      navigate(decodedPath, { replace: true });
    }
  }, [navigate]);

  const handleTocCallback = (newToc) => setToc(newToc);

  if (loading) return <div>Chargement...</div>;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Header />
      <AppContainer>
        <ResizableSidebar defaultWidth={300}>
          <Sidebar tree={categories} />
        </ResizableSidebar>

        <MainContent id="main">
          <Routes>
            <Route
              path="/"
              element={
                <div style={{ padding: "2rem" }}>
                  Sélectionnez un article pour commencer
                </div>
              }
            />
            <Route
              path="/article/:slug"
              element={
                <ArticleRoute
                  articles={articles}
                  onTocCallback={handleTocCallback}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </MainContent>

        {toc.length > 0 && <CollapsibleTOC toc={toc} />}

        <BackToTopButton targetId="main" />
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
