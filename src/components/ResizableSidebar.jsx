import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const SidebarContainer = styled.div`
  position: relative;
  height: 100%;
  width: ${(props) => props.width}px;
  min-width: 200px;
  max-width: 500px;
`;

// const ResizeHandle = styled.div`
//   position: absolute;
//   top: 0;
//   bottom: 0;
//   left: 0;
//   width: 50px;
//   cursor: col-resize;
//   background: transparent;
// `;

const ResizeHandle = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 10px;
  cursor: col-resize;
  background: transparent;
  z-index: 10;
`;

const ResizableSidebar = ({ children, defaultWidth = 300 }) => {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const handleRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        const newWidth = Math.max(200, Math.min(500, e.clientX));
        setWidth(newWidth);
      }
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
  }, [isResizing]);

  return (
    <SidebarContainer width={width}>
      <ResizeHandle ref={handleRef} onMouseDown={() => setIsResizing(true)} />
      {children}
    </SidebarContainer>
  );
};

export default ResizableSidebar;
