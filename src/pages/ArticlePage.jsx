import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Remarkable } from "remarkable";
import hljs from "highlight.js";
import slugify from "slugify";
import { Article } from "../components/StyledComponents";
import CollapsibleTOC from "../components/CollapsibleTOC";

function ArticlePage({ articles }) {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [htmlContent, setHtmlContent] = useState("");
  const [toc, setToc] = useState([]);

  useEffect(() => {
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
        }
      });

      let content = md.render(article.content);

      const newToc = [];
      content = content.replace(
        /<h([2-6])>(.*?)<\/h\1>/g,
        (match, level, title) => {
          const id = slugify(title, { lower: true });
          newToc.push({ id, title, level });
          return `<h${level} id="${id}">${title}</h${level}>`;
        }
      );

      setHtmlContent(content);
      setToc(newToc);
    } else {
      navigate("/", { replace: true });
    }
  }, [slug, articles]);

  useEffect(() => {
    document.querySelectorAll("pre code").forEach((block) => {
      // hljs.highlightElement(block);

      // Ajouter un bouton de copie
      const preElement = block.parentElement;
      if (!preElement.querySelector(".copy-button")) {
        const copyButton = document.createElement("button");
        copyButton.className = "copy-button";
        copyButton.textContent = "Copier";
        copyButton.style.position = "absolute";
        copyButton.style.top = "5px";
        copyButton.style.right = "5px";
        copyButton.style.backgroundColor = "#007bff";
        copyButton.style.color = "white";
        copyButton.style.border = "none";
        copyButton.style.padding = "5px 10px";
        copyButton.style.borderRadius = "3px";
        copyButton.style.cursor = "pointer";

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
  }, [htmlContent]);

  return (
    <>
      <Article dangerouslySetInnerHTML={{ __html: htmlContent }} />
      <CollapsibleTOC toc={toc} />
    </>
  );
}

export default ArticlePage;
