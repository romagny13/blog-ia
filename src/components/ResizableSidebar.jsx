import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const SidebarContainer = styled.div`
  position: relative;
  width: ${(props) => props.width}px;
  min-width: 200px;
  max-width: 400px;
  overflow-y: auto;
`;

const ResizeHandle = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 10px;
  cursor: col-resize;
  background: ${(props) => (props.$isResizing ? "#e9ecef" : "transparent")};
  z-index: 10;
`;

const ResizableSidebar = ({ children, defaultWidth = 300 }) => {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const startX = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const delta = e.clientX - startX.current;
      const newWidth = Math.max(200, Math.min(500, width + delta));
      setWidth(newWidth);
      startX.current = e.clientX;
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, width]);

  const startResize = (e) => {
    setIsResizing(true);
    startX.current = e.clientX;
  };

  return (
    <SidebarContainer width={width}>
      <ResizeHandle $isResizing={isResizing} onMouseDown={startResize} />
      {children}
    </SidebarContainer>
  );
};

export default ResizableSidebar;
