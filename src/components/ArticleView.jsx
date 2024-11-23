import React, { useEffect, useState } from "react";
import "highlight.js/styles/github-dark.css";
import DocumentToolbar from "./DocumentToolbar";
import {
  convertMarkdownToHtmlWithSyntaxHighlighting,
  generateTOCFromHtml,
} from "../utils/convertUtils";
import styled from "styled-components";

const ArticleContainer = styled.article`
  max-width: 800px;
  margin: 0 auto;
`;

const ArticleHeader = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Category = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const Content = styled.div`
  line-height: 1.6;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1rem;
  }

  ul,
  ol {
    margin-bottom: 1rem;
    padding-left: 2rem;
  }

  code {
    background-color: #2d2d2d;
    color: #e6e6e6;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: "Fira Code", Consolas, Monaco, "Andale Mono", monospace;
    font-size: 0.9em;
  }

  pre {
    background-color: #2d2d2d !important;
    padding: 1.2rem !important;
    border-radius: 8px !important;
    overflow-x: auto !important;
    margin: 0 !important;
    border: 1px solid #404040 !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;

    code {
      background-color: transparent !important;
      padding: 0 !important;
      border-radius: 0 !important;
      font-size: 0.95em !important;
      line-height: 1.7 !important;
      font-family: "Fira Code", Consolas, Monaco, "Andale Mono", monospace !important;
      color: #e6e6e6 !important;
      text-shadow: none !important;
    }

    .hljs-comment {
      color: #9ca3af !important;
    }

    .hljs-keyword {
      color: #93c5fd !important;
    }

    .hljs-string {
      color: #86efac !important;
    }

    .hljs-number {
      color: #fca5a5 !important;
    }
  }

  pre + p {
    margin-top: 1.5rem;
  }
`;

const ArticleView = ({ article, tocCallback }) => {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    let html = convertMarkdownToHtmlWithSyntaxHighlighting(article.content);
    const { toc, content } = generateTOCFromHtml(html);
    // console.log(toc);
    setHtmlContent(content);
    tocCallback(toc);
  }, [article]);

  useEffect(() => {
    // Fonction pour wrapper les blocs de code avec le bouton de copie
    const wrapCodeBlocks = () => {
      const preElements = document.querySelectorAll("pre");

      preElements.forEach((pre) => {
        // Vérifie si le bloc n'a pas déjà été wrappé
        if (pre.parentNode.className !== "code-block") {
          const wrapper = document.createElement("div");
          wrapper.className = "code-block";
          wrapper.style.position = "relative";

          const button = document.createElement("button");
          button.className = "copy-button";
          button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copier
          `;

          button.addEventListener("click", async () => {
            const code = pre.textContent;
            try {
              await navigator.clipboard.writeText(code);
              button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Copié!
              `;
              setTimeout(() => {
                button.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copier
                `;
              }, 2000);
            } catch (err) {
              console.error("Failed to copy text: ", err);
            }
          });

          // Appliquer les styles au bouton
          Object.assign(button.style, {
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#fff",
            padding: "0.25rem 0.5rem",
            borderRadius: "4px",
            fontSize: "0.8rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          });

          // Wrapper le pre existant
          pre.parentNode.insertBefore(wrapper, pre);
          wrapper.appendChild(pre);
          wrapper.appendChild(button);
        }
      });
    };

    // Appliquer le wrapping après le rendu
    wrapCodeBlocks();

    // navigate to hash
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      // console.log("scroll", id, element);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [htmlContent]); // Relancer quand le contenu change

  return (
    <div style={{ display: "flex" }}>
      <ArticleContainer>
        <ArticleHeader>
          <Title>{article.frontmatter.title}</Title>
          <Category>{article.frontmatter.category}</Category>
        </ArticleHeader>
        <Content dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </ArticleContainer>
      <DocumentToolbar article={article} />
    </div>
  );
};

export default ArticleView;
