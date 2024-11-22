import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { loadMarkdownFiles } from "./utils/markdownLoader";
import { ThemeProvider } from "styled-components";
import "highlight.js/styles/github.css";
import Header from "./components/Header";
import GlobalStyle from "./GlobalStyle";
import {
  LayoutContainer,
  LeftNav,
  StyledLink,
} from "./components/StyledComponents";
import ArticlePage from "./pages/ArticlePage";
import BackToTopButton from "./components/BackToTopButton";
import { theme } from "./themes";

// function CategoryTree({ tree }) {
//   return (
//     <div>
//       {Object.entries(tree).map(([category, data]) => (
//         <div key={category}>
//           <h3>{category}</h3>
//           {data.articles && (
//             <div>
//               {data.articles.map((article) => (
//                 <StyledLink
//                   key={article.slug}
//                   as={Link}
//                   to={`/article/${article.slug}`}
//                 >
//                   {article.title}
//                 </StyledLink>
//               ))}
//             </div>
//           )}
//           {data.subcategories && <CategoryTree tree={data.subcategories} />}
//         </div>
//       ))}
//     </div>
//   );
// }

// const getCategoriesByLevel = async () => {
//   const loadedArticles = await loadMarkdownFiles();

//   const categoriesByLevel = {};

//   // Parcourir chaque article
//   loadedArticles.forEach((article) => {
//     const categories = article.frontmatter.category.split(" > "); // Séparer les catégories par '>'

//     // Pour chaque niveau de catégorie
//     categories.forEach((category, index) => {
//       // Initialiser le niveau s'il n'existe pas
//       if (!categoriesByLevel[index]) {
//         categoriesByLevel[index] = {};
//       }

//       // Si la catégorie n'existe pas au niveau, on l'ajoute avec un tableau d'articles vide
//       if (!categoriesByLevel[index][category]) {
//         categoriesByLevel[index][category] = { articles: [] };
//       }

//       // Ajouter l'article uniquement à la dernière catégorie
//       if (index === categories.length - 1) {
//         categoriesByLevel[index][category].articles.push({
//           slug: article.slug,
//           frontmatter: article.frontmatter,
//           content: article.content,
//         });
//       }
//     });
//   });

//   // Résultat
//   console.log(categoriesByLevel);
//   return categoriesByLevel;
// };

// function buildCategoryTree(categoriesByLevel) {
//   const categoryTree = {};

//   Object.keys(categoriesByLevel).forEach((level) => {
//     Object.entries(categoriesByLevel[level]).forEach(([category, data]) => {
//       const parentLevel = level - 1;

//       if (parentLevel >= 0) {
//         // Trouver le parent au niveau précédent
//         Object.entries(categoriesByLevel[parentLevel]).forEach(
//           ([parentCategory]) => {
//             if (!categoryTree[parentCategory]) {
//               categoryTree[parentCategory] = {};
//             }
//             categoryTree[parentCategory][category] = {
//               articles: data.articles,
//             };
//           }
//         );
//       } else {
//         // Niveau racine
//         categoryTree[category] = { articles: data.articles };
//       }
//     });
//   });

//   return categoryTree;
// }

function App() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlug, setActiveSlug] = useState(null);

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
          articles,
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

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSlugChange = (slug) => setActiveSlug(slug);

  if (loading) return <div>Chargement des articles...</div>;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Header />
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
                  className={activeSlug == article.slug ? "active" : ""}
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
            element={
              <p style={{ margin: "10px" }}>
                Sélectionnez un article pour voir son contenu.
              </p>
            }
          />
          <Route
            path="/article/:slug"
            element={
              <ArticlePage
                articles={categories}
                onSlugChange={handleSlugChange}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <BackToTopButton />
      </LayoutContainer>
    </ThemeProvider>
  );
}

export default App;
