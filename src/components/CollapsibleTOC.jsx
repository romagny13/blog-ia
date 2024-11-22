import { useState } from "react";
import styled from "styled-components";
import { ChevronRight, ChevronDown } from "lucide-react";

const Sidebar = styled.aside`
  width: 280px;
  padding: 15px;
  position: sticky;
  top: 0;
  right: 0;
  height: 100vh; /* La sidebar occupe toute la hauteur de la fenêtre */
  overflow-y: auto; /* Activer le scrolling vertical */
  overflow-x: hidden; /* Empêcher le scrolling horizontal */

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 2px; /* largeur de la bordure */
    background: linear-gradient(
      to bottom,
      rgba(229, 231, 235, 1),
      rgba(229, 231, 235, 0)
    );
  }
`;

const TocTitle = styled.h3`
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(props) => props.theme.primaryText};
  border-bottom: 2px solid ${(props) => props.theme.link};
  padding-bottom: 10px;
`;

const TocList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TocItem = styled.li`
  margin-left: ${(props) => props.level * 15}px;
  padding: 5px 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.hoverBackground};
  }

  &.active {
    font-weight: bold;
    border-left: 3px solid ${(props) => props.theme.activeLink};
    padding-left: 12px;
  }
`;

const StyledLink = styled.a`
  flex-grow: 1;
  text-decoration: none;
  color: ${(props) => props.theme.primaryText};
  font-size: 0.95rem;

  &:hover {
    color: ${(props) => props.theme.link};
  }
`;

const Collapsible = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isCollapsed",
})`
  max-height: ${(props) => (props.isCollapsed ? "0" : "100vh")};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const CollapsibleTOC = ({ toc }) => {
  const [collapsedLevels, setCollapsedLevels] = useState(new Set());

  const toggleCollapse = (level) => {
    setCollapsedLevels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(level)) {
        newSet.delete(level);
      } else {
        newSet.add(level);
      }
      return newSet;
    });
  };

  const renderTOCItems = (items) => {
    return items.map((item, index) => {
      const isCollapsed = collapsedLevels.has(item.level);

      return (
        <div key={index}>
          <TocItem
            level={item.level}
            className={window.location.hash === `#${item.id}` ? "active" : ""}
            onClick={
              item.children ? () => toggleCollapse(item.level) : undefined
            }
          >
            {item.children &&
              item.children.length > 0 &&
              (isCollapsed ? (
                <ChevronRight size={14} style={{ marginRight: "8px" }} />
              ) : (
                <ChevronDown size={14} style={{ marginRight: "8px" }} />
              ))}
            <StyledLink href={`#${item.id}`}>{item.title}</StyledLink>
          </TocItem>
          {item.children && (
            <Collapsible isCollapsed={isCollapsed}>
              <TocList>{renderTOCItems(item.children)}</TocList>
            </Collapsible>
          )}
        </div>
      );
    });
  };

  return (
    <Sidebar>
      <TocTitle>Table des Matières</TocTitle>
      <TocList>{renderTOCItems(toc)}</TocList>
    </Sidebar>
  );
};

export default CollapsibleTOC;
