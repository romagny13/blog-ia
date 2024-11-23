import React, { useEffect, useState } from "react";
import { FileText, Code, FileSpreadsheet } from "lucide-react";
import styled from "styled-components";
import {
  convertHtmlToDocx,
  convertMarkdownToHtml,
  downloadFile,
  convertMardownToPdf,
} from "../utils/convertUtils";

const Toolbar = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.8); /* Légèrement transparent */
  border-radius: 40px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: 0.5; /* Visibilité subtile */

  &:hover,
  &:focus-within {
    opacity: 1; /* Entièrement visible quand survolée */
  }

  &.visible {
    opacity: 1; /* Visible quand activée */
  }
`;

const ToolbarButton = styled.button`
  background: transparent;
  border: none;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 25px;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    background-color: rgba(0, 0, 0, 0.1);
    transform: scale(1.05);
  }

  svg {
    stroke-width: 1.5;
  }
`;

const ButtonText = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const DocumentToolbar = ({ article }) => {
  const [convertedHtml, setConvertedHtml] = useState(null);
  const [convertedWord, setConvertedWord] = useState(null);
  const [loading, setLoading] = useState(false); // Ajout de l'état loading

  useEffect(() => {
    const convertContent = async () => {
      setLoading(true); // Démarrer le chargement
      try {
        // Convertir le Markdown en HTML
        const htmlContent = convertMarkdownToHtml(article.content);
        setConvertedHtml(htmlContent);

        // Convertir le HTML en Word de manière asynchrone
        const wordBuffer = await convertHtmlToDocx(htmlContent); // Attendre la conversion
        setConvertedWord(wordBuffer);
      } catch (error) {
        console.error("Erreur lors de la conversion du HTML en Word:", error);
      } finally {
        setLoading(false); // Arrêter le chargement après la conversion
      }
    };

    convertContent();
  }, [article.slug, article.content]);

  // Télécharger le fichier Markdown
  const handleDownloadMarkdown = () => {
    const blob = new Blob([article.content], { type: "text/markdown" });
    downloadFile(blob, `${article.slug}.md`);
  };

  // Télécharger le fichier HTML
  const handleDownloadHtml = () => {
    if (convertedHtml) {
      const blob = new Blob([convertedHtml], { type: "text/html" });
      downloadFile(blob, `${article.slug}.html`);
    }
  };

  // Télécharger le fichier Word
  const handleDownloadWord = () => {
    if (convertedWord) {
      // création du fichier Word en Blob avec encodage UTF-8
      const wordBlob = new Blob([convertedWord], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=UTF-8",
      });
      downloadFile(wordBlob, `${article.slug}.docx`);
    }
  };

  const handleDownloadPdf = async () => {
    await convertMardownToPdf(article.content, `${article.slug}.pdf`);
  };

  return (
    <Toolbar>
      <ToolbarButton
        onClick={handleDownloadMarkdown}
        disabled={loading}
        title="Exporter en Markdown"
      >
        <FileText size={20} />
        <ButtonText>Markdown</ButtonText>
      </ToolbarButton>

      <ToolbarButton
        onClick={handleDownloadHtml}
        disabled={loading || !convertedHtml}
        title="Exporter en HTML"
      >
        <Code size={20} />
        <ButtonText>HTML</ButtonText>
      </ToolbarButton>

      <ToolbarButton
        onClick={handleDownloadWord}
        disabled={loading || !convertedWord}
        title="Exporter en Word (Docx)"
      >
        <FileSpreadsheet size={20} />
        <ButtonText>Word</ButtonText>
      </ToolbarButton>

      <ToolbarButton
        onClick={async () => await handleDownloadPdf()}
        disabled={loading}
        title="Exporter en PDF"
      >
        <FileText size={20} />
        <ButtonText>PDF</ButtonText>
      </ToolbarButton>
    </Toolbar>
  );
};
export default DocumentToolbar;
