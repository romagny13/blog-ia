import React, { useState } from "react";
import styled from "styled-components";
import { ChevronRight, ChevronDown, FileText, Folder } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const SidebarContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: #f8f9fa;
  padding: 1rem;
  overflow-y: auto;
  border-right: 1px solid #e9ecef;
`;

const TreeItem = styled.div`
  margin: 0.2rem 0;
`;

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  margin-left: ${(props) => props.$depth * 1}rem;

  &:hover {
    background: #e9ecef;
  }
`;

const ItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ArticleLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;

  &:hover {
    text-decoration: none;
  }
`;

// const ArticleItem = styled(CategoryItem)`
//   padding-left: ${(props) => props.$depth * 1 + 2}rem;
//   background-color: ${(props) =>
//     props.$isSelected ? "#e2e8f0" : "transparent"};
//   &:hover {
//     background-color: ${(props) => (props.$isSelected ? "#e2e8f0" : "#e9ecef")};
//   }
// `;

const ArticleItem = styled(CategoryItem)`
  padding-left: ${(props) => props.$depth * 1 + 1}rem;

  &.active {
    font-weight: bold;
    border-left: 3px solid ${(props) => props.theme.activeLink};
  }

  &:hover {
    background-color: ${(props) => props.theme.hoverBackground};
  }
`;

const ItemLabel = styled.span`
  margin-left: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

function TreeNode({ node, depth = 0, activeSlug }) {
  const [isOpen, setIsOpen] = useState(() => {
    // Vérifie si l'article actif appartient à ce nœud ou ses sous-catégories
    const containsActiveArticle =
      node.articles?.some((article) => article.slug === activeSlug) ||
      Object.values(node.subCategories || {}).some((subNode) =>
        hasActiveArticle(subNode, activeSlug)
      );
    return containsActiveArticle;
  });

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <TreeItem>
      {/* Catégories */}
      {node.articles || node.subCategories ? (
        <CategoryItem $depth={depth} onClick={toggle}>
          <ItemContent>
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <Folder size={16} />
            <ItemLabel>{node.name}</ItemLabel>
          </ItemContent>
        </CategoryItem>
      ) : null}

      {/* Articles */}
      {isOpen &&
        node.articles?.map((article) => (
          <ArticleItem
            key={article.slug}
            $depth={depth + 1}
            className={article.slug === activeSlug ? "active" : ""}
          >
            <ItemContent>
              <FileText size={16} />
              <ArticleLink to={`/article/${article.slug}`}>
                {article.title}
              </ArticleLink>
            </ItemContent>
          </ArticleItem>
        ))}

      {/* Sous-catégories */}
      {isOpen &&
        Object.entries(node.subCategories || {}).map(([key, subCategory]) => (
          <TreeNode
            key={key}
            node={{ ...subCategory, name: key }}
            depth={depth + 1}
            activeSlug={activeSlug}
          />
        ))}
    </TreeItem>
  );
}

// Fonction utilitaire pour vérifier si une sous-catégorie contient l'article actif
function hasActiveArticle(node, activeSlug) {
  return (
    node.articles?.some((article) => article.slug === activeSlug) ||
    Object.values(node.subCategories || {}).some((subNode) =>
      hasActiveArticle(subNode, activeSlug)
    )
  );
}

export default function Sidebar({ tree }) {
  const location = useLocation();
  const activeSlug = location.pathname.split("/").pop(); // Récupère le slug actif
  return (
    <SidebarContainer>
      {Object.entries(tree).map(([key, node]) => (
        <TreeNode
          key={key}
          node={{ ...node, name: key }}
          activeSlug={activeSlug}
        />
      ))}
    </SidebarContainer>
  );
}
