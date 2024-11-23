import { Remarkable } from "remarkable";
import { linkify } from "remarkable/linkify";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
// to docx
import { asBlob } from "html-docx-js-typescript";
// to pdf
import html2pdf from "html2pdf.js";
// to generate anchor id
import slugify from "slugify";

const createMarkdownConverter = () => {
  return new Remarkable({
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (err) {
          console.error("Error highlighting code:", err);
        }
      }
      return hljs.highlightAuto(str).value;
    },
    html: true,
    xhtmlOut: true,
    breaks: true,
    typographer: true,
  }).use(linkify);
};

// export function convertMarkdownToHtml(markdownText) {
//   const md = new Remarkable();
//   return md.render(markdownText);
// }

export function convertMarkdownToHtmlWithSyntaxHighlighting(markdownText) {
  const md = createMarkdownConverter();
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

const defaultOptions = {
  title: "Document Markdown Converti",
  language: "fr",
  standalone: true,
  includeDefaultStyles: true,
  darkMode: true,
};

const defaultStyles = `
     body {
         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
         line-height: 1.6;
         max-width: 800px;
         margin: 0 auto;
         padding: 2rem;
         color: #24292e;
         background-color: #ffffff;
     }
     h1, h2, h3, h4, h5, h6 {
         color: #1b1f23;
         margin-top: 1.5em;
         margin-bottom: 0.5em;
         font-weight: 600;
     }
     h1 { font-size: 2.5em; border-bottom: 2px solid #eaecef; padding-bottom: 0.3em; }
     h2 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
     h3 { font-size: 1.5em; }
     h4 { font-size: 1.25em; }
     a {
         color: #0366d6;
         text-decoration: none;
         transition: color 0.2s ease-in-out;
     }
     a:hover {
         color: #0056b3;
         text-decoration: underline;
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
    }

    pre code {
      background-color: transparent !important;
      padding: 0 !important;
      border-radius: 0 !important;
      font-size: 0.95em !important;
      line-height: 1.7 !important;
      font-family: "Fira Code", Consolas, Monaco, "Andale Mono", monospace !important;
      color: #e6e6e6 !important;
      text-shadow: none !important;
    }

    pre + p {
      margin-top: 1.5rem;
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

    @media (max-width: 768px) {
      body {
        padding: 1rem;
      }

      pre {
        padding: 1rem !important;
        font-size: 0.9em !important;
      }
    }
`;

export const convertMarkdownToHtml = (markdown, options = {}) => {
  const finalOptions = { ...defaultOptions, ...options };
  const md = createMarkdownConverter();
  const htmlContent = md.render(markdown);

  if (!finalOptions.standalone) {
    return htmlContent;
  }

  return `
<!DOCTYPE html>
<html lang="${finalOptions.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${finalOptions.title}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css">
    ${
      finalOptions.includeDefaultStyles ? `<style>${defaultStyles}</style>` : ""
    }
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fira-code@6.2.0/distr/fira_code.css">
</head>
<body>
    ${htmlContent}
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
    <script>
        hljs.highlightAll();
    </script>
</body>
</html>`;
};

export function convertHtmlToDocx(fullHtml) {
  return asBlob(fullHtml, {
    orientation: "portrait",
    margins: { top: "20mm", bottom: "20mm", left: "20mm", right: "20mm" },
  });
}

const convertMarkdownToHtmlForPdf = (markdown, options = {}) => {
  const md = createMarkdownConverter();
  const htmlContent = md.render(markdown);

  return `
<body>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css">
    <style> 
      h1, h2, h3, h4, h5, h6 {
          color: #1b1f23;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
      }
      h1 { font-size: 2.5em; border-bottom: 2px solid #eaecef; padding-bottom: 0.3em; }
      h2 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
      h3 { font-size: 1.5em; }
      h4 { font-size: 1.25em; }
      a {
          color: #0366d6;
          text-decoration: none;
          transition: color 0.2s ease-in-out;
      }
      a:hover {
          color: #0056b3;
          text-decoration: underline;
      }

      /* Empêche les coupures dans les blocs de code */
      code, pre {
          page-break-inside: avoid; /* Empêche la coupure à l'intérieur des éléments de code */
          white-space: pre-wrap; /* Permet à l'élément de se casser proprement si nécessaire */
          word-wrap: break-word; /* Permet de gérer les longs mots sans les couper */
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
        margin-top: 5mm;
        margin-bottom: 5mm;
        border: 1px solid #404040 !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
      }

      pre code {
        background-color: transparent !important;
        padding: 0 !important;
        border-radius: 0 !important;
        font-size: 0.95em !important;
        line-height: 1.7 !important;
        font-family: "Fira Code", Consolas, Monaco, "Andale Mono", monospace !important;
        color: #e6e6e6 !important;
        text-shadow: none !important;
      }

      .code-block {
        page-break-inside: avoid;
      }

      pre + p {
        margin-top: 1.5rem;
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

      @media (max-width: 768px) {
        pre {
          padding: 1rem !important;
          font-size: 0.9em !important;
        }
      }
    </style>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fira-code@6.2.0/distr/fira_code.css">
    ${htmlContent}
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
    <script>
        hljs.highlightAll();
    </script>
</body>`;
};

export async function convertMardownToPdf(markdownText, fileName) {
  const htmlContent = convertMarkdownToHtmlForPdf(markdownText);
  try {
    const options = {
      margin: 20, // Marges (en mm)
      filename: fileName,
      image: {
        type: "jpeg",
        quality: 0.98,
      },
      html2canvas: {
        scale: 1, // Ajuster la qualité de l'image pour alléger le fichier PDF
        useCORS: true,
        letterRendering: true,
        scrollY: 0, // Utiliser un décalage vertical si nécessaire
      },
      jsPDF: {
        unit: "mm",
        format: "a4", // Format A4
        orientation: "portrait", // Orientation portrait
      },
      pagebreak: {
        mode: ["avoid-all", "css"], // Utiliser avoid-all pour éviter les coupures
        before: ".page-break-before", // Saut de page avant certains éléments
        after: ".page-break-after", // Saut de page après certains éléments
        avoid: ".page-break-avoid", // Empêcher les coupures au niveau des éléments marqués
      },
    };

    const worker = html2pdf().set(options).from(htmlContent);
    return await worker.save();
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    throw error;
  }
}

export function downloadFile(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
