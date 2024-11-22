import { Remarkable } from "remarkable";
import hljs from "highlight.js";
import { asBlob } from "html-docx-js-typescript";
import slugify from "slugify";

// Markdown to HTML avec ou sans syntax highlighting
export function convertMarkdownToHtml(markdownText) {
  const md = new Remarkable();
  return md.render(markdownText);
}

export function convertMarkdownToHtmlWithSyntaxHighlighting(markdownText) {
  const md = new Remarkable({
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (err) {
          console.error("Error highlighting code:", err);
        }
      }
      return "";
    },
  });
  return md.render(markdownText);
}

// Générer la Table des matières depuis le HTML
export function generateTOCFromHtml(htmlContent) {
  const toc = [];
  let parentStack = [];
  const idMap = new Map(); // Suivi des occurrences des IDs

  htmlContent = htmlContent.replace(
    /<h([1-6])>(.*?)<\/h\1>/g,
    (match, level, title) => {
      let baseId = slugify(title, { lower: true });
      const count = idMap.get(baseId) || 0;
      const uniqueId = count > 0 ? `${baseId}-${count}` : baseId;
      idMap.set(baseId, count + 1);

      const tocItem = {
        id: uniqueId,
        title,
        level: parseInt(level),
        children: [],
      };

      while (
        parentStack.length &&
        parentStack[parentStack.length - 1].level >= tocItem.level
      ) {
        parentStack.pop();
      }

      if (parentStack.length > 0) {
        parentStack[parentStack.length - 1].children.push(tocItem);
      } else {
        toc.push(tocItem);
      }

      parentStack.push(tocItem);

      return `<h${level} id="${uniqueId}">${title}</h${level}>`;
    }
  );

  return {
    toc,
    content: htmlContent,
  };
}

function convertCodeToTable(htmlContent) {
  // Utiliser une expression régulière pour trouver les balises <pre><code></code></pre>
  const regex =
    /<pre(?: style="([^"]*)")?\s*><code(?: class="([^"]*)")?\s*>([\s\S]*?)<\/code>/g;

  // Remplacer le contenu des balises <pre><code></code></pre> par une table HTML
  return htmlContent.replace(
    regex,
    (match, preStyle, codeClass, codeContent) => {
      const lines = codeContent.split("\n");

      // Créer un tableau Word avec une colonne
      const tableRows = lines
        .map(
          (line) =>
            `<tr>
          <td>
            ${line}
          </td>
        </tr>`
        )
        .join("");

      return `
        <table style="width:100%; border-collapse:collapse;">
         <tr><td> ${tableRows}</td></tr>
        </table>
      `;
    }
  );
}

export function convertHtmlToDocx(htmlContent) {
  // Convertir les blocs <pre><code> en tableaux
  // const processedHtml = convertCodeToTable(htmlContent);

  const fullHtml = `
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Document</title>
      </head>
      <body>${htmlContent}</body>
    </html>
  `;

  return asBlob(fullHtml, {
    orientation: "portrait",
    margins: { top: "20mm", bottom: "20mm", left: "20mm", right: "20mm" },
  });
}

// Télécharger le fichier
export function downloadFile(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
