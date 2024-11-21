import { useState } from "react";
import styled from "styled-components";
import { ChevronRight, ChevronDown } from "lucide-react";

// const Sidebar = styled.aside`
//   position: sticky;
//   top: 0;
//   right: 0;
//   height: 100vh;
//   width: 100%;
//   min-width: 200px;
//   max-width: 500px;
//   background-color: ${(props) => props.theme.sidebarBackground};
//   overflow-y: auto;
//   border-left: 1px solid ${(props) => props.theme.border};
//   transition: width 0.2s ease;
// `;

const Sidebar = styled.aside`
  width: 250px;
  background-color: ${(props) => props.theme.sidebarBackground};
  padding: 20px;
  position: sticky;
  top: 0;
  right: 0;
  height: 100vh;
  overflow-y: auto;
  border-left: 1px solid ${(props) => props.theme.border};
`;

const TocTitle = styled.h3`
  margin-bottom: 15px;
  color: ${(props) => props.theme.link};
  border-bottom: 2px solid ${(props) => props.theme.link};
  padding-bottom: 10px;
`;

const TocList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TocItem = styled.li`
  margin-left: ${(props) => props.level * 10}px;
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const StyledLink = styled.a`
  flex-grow: 1;
  text-decoration: none;
  color: ${(props) => props.theme.primaryText};
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
    const renderedItems = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const isCollapsed = collapsedLevels.has(item.level);

      renderedItems.push(
        <TocItem
          key={i}
          level={item.level}
          onClick={() => toggleCollapse(item.level)}
        >
          {item.level > 0 &&
            (isCollapsed ? (
              <ChevronRight size={16} style={{ marginRight: "10px" }} />
            ) : (
              <ChevronDown size={16} style={{ marginRight: "10px" }} />
            ))}
          <StyledLink href={`#${item.id}`}>{item.title}</StyledLink>
        </TocItem>
      );

      // Skip rendering children if the level is collapsed
      if (isCollapsed && i + 1 < items.length) {
        while (i + 1 < items.length && items[i + 1].level > item.level) {
          i++;
        }
      }
    }

    return renderedItems;
  };

  return (
    <Sidebar>
      <TocTitle>Table of Contents</TocTitle>
      <TocList>{renderTOCItems(toc)}</TocList>
    </Sidebar>
  );
};

export default CollapsibleTOC;
