import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Article } from "../components/StyledComponents";
import CollapsibleTOC from "../components/CollapsibleTOC";
import {
  convertMarkdownToHtmlWithSyntaxHighlighting,
  generateTOCFromHtml,
} from "../utils/convertUtils";
import DocumentToolbar from "../components/DocumentToolbar";

function ArticlePage({ articles, onSlugChange }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [currentArticle, setCurrentArticle] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [toc, setToc] = useState([]);

  useEffect(() => {
    onSlugChange(slug);

    const article = articles
      .flatMap((cat) => cat.articles)
      .find((a) => a.slug === slug);

    if (article) {
      let html = convertMarkdownToHtmlWithSyntaxHighlighting(article.content);
      const { toc, content } = generateTOCFromHtml(html);
      // console.log(toc);

      setHtmlContent(content);
      setToc(toc);
      setCurrentArticle(article);
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
      {currentArticle && <DocumentToolbar article={currentArticle} />}
    </>
  );
}

export default ArticlePage;
