import { useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // Style Highlight.js
import { Remarkable } from "remarkable";

const MarkdownRenderer = ({ markdownText }) => {
  const md = new Remarkable({
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (error) {
          console.log(error.message);
        }
      }
      return ""; // Fallback
    }
  });

  const htmlContent = md.render(markdownText);

  useEffect(() => {
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);

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
  }, [markdownText]);

  return (
    <div
      style={{ padding: "10px" }}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownRenderer;
