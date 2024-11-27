export async function loadMarkdownFiles() {
  const modules = import.meta.glob("../docs/**/*.md", { as: "raw" });

  console.log(modules);

  const articles = await Promise.all(
    Object.entries(modules).map(async ([path, loader]) => {
      const content = await loader();

      const frontMatterMatch = content.match(/^---\s*\n([\s\S]*?)\n\s*---/);
      const frontmatter = frontMatterMatch
        ? Object.fromEntries(
            frontMatterMatch[1]
              .split("\n")
              .filter((line) => line.includes(": ")) // Filtrer les lignes mal formées
              .map((line) => line.split(": ").map((part) => part.trim())) // Nettoyer les espaces
          )
        : {};

      const markdownContent = content
        .replace(/^---\s*\n[\s\S]*?\n\s*---/, "")
        .trim();

      // Création du slug à partir du chemin
      const slug = path
        .split("/") // Diviser le chemin en segments
        .pop() // Prendre le dernier segment (nom du fichier)
        .replace(".md", "") // Retirer l'extension .md
        .toLowerCase(); // Convertir en minuscules

      return {
        slug, // Slug formé à partir du chemin
        frontmatter, // Frontmatter extrait
        content: markdownContent, // Contenu markdown
      };
    })
  );

  return articles;
}
