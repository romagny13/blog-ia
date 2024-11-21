export async function loadMarkdownFiles() {
  console.log("load");
  const modules = import.meta.glob("../docs/*.md", { as: "raw" });
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

      return {
        slug: path.replace("../docs/", "").replace(".md", ""),
        frontmatter,
        content: markdownContent
      };
    })
  );

  return articles;
}
