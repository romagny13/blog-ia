import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Remarkable } from "remarkable";
import hljs from "highlight.js";
import slugify from "slugify";
import { Article } from "../components/StyledComponents";
import CollapsibleTOC from "../components/CollapsibleTOC";

function ArticlePage({ articles, onSlugChange }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [htmlContent, setHtmlContent] = useState("");
  const [toc, setToc] = useState([]);

  useEffect(() => {
    onSlugChange(slug);

    const article = articles
      .flatMap((cat) => cat.articles)
      .find((a) => a.slug === slug);

    if (article) {
      const md = new Remarkable({
        highlight: (str, lang) => {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(str, { language: lang }).value;
            } catch (__) {}
          }
          return "";
        },
      });

      let content = md.render(article.content);

      const newToc = [];
      let parentStack = [];
      const idMap = new Map(); // Suivi des occurrences des IDs

      content = content.replace(
        /<h([1-6])>(.*?)<\/h\1>/g,
        (match, level, title) => {
          let baseId = slugify(title, { lower: true });

          // Vérifier si cet ID a déjà été utilisé
          const count = idMap.get(baseId) || 0;
          const uniqueId = count > 0 ? `${baseId}-${count}` : baseId;
          idMap.set(baseId, count + 1); // Incrémenter le compteur

          const tocItem = {
            id: uniqueId,
            title,
            level: parseInt(level),
            children: [],
          };

          // Gestion de la hiérarchie
          while (
            parentStack.length &&
            parentStack[parentStack.length - 1].level >= tocItem.level
          ) {
            parentStack.pop(); // Retour en arrière si le niveau est inférieur ou égal
          }

          if (parentStack.length > 0) {
            // Ajouter en tant qu'enfant du dernier élément parent
            parentStack[parentStack.length - 1].children.push(tocItem);
          } else {
            // Pas de parent, ajouter au niveau supérieur
            newToc.push(tocItem);
          }

          // Ajouter le nouvel élément au stack
          parentStack.push(tocItem);

          return `<h${level} id="${uniqueId}">${title}</h${level}>`;
        }
      );

      // console.log(newToc);

      setHtmlContent(content);
      setToc(newToc);
    } else {
      navigate("/", { replace: true });
    }
  }, [slug, articles]);

  useEffect(() => {
    // add copy button
    document.querySelectorAll("pre code").forEach((block) => {
      // hljs.highlightElement(block);

      // Ajouter un bouton de copie
      const preElement = block.parentElement;
      if (!preElement.querySelector(".copy-button")) {
        const copyButton = document.createElement("button");
        copyButton.className = "copy-button";
        copyButton.textContent = "Copier";

        // Action de copie
        copyButton.addEventListener("click", () => {
          navigator.clipboard.writeText(block.textContent).then(() => {
            copyButton.textContent = "Copié !";
            setTimeout(() => {
              copyButton.textContent = "Copier";
            }, 2000);
          });
        });

        // Ajouter le bouton au conteneur <pre>
        preElement.style.position = "relative";
        preElement.appendChild(copyButton);
      }
    });

    // navigate to hash
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      // console.log("scroll", id, element);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [htmlContent]);

  return (
    <>
      <Article dangerouslySetInnerHTML={{ __html: htmlContent }} />
      <CollapsibleTOC toc={toc} />
    </>
  );
}

export default ArticlePage;
