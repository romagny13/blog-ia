import styled from "styled-components";

export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.gradientStart},
    ${(props) => props.theme.gradientEnd}
  );
  color: ${(props) => props.theme.primaryText};
`;

export const LeftNav = styled.nav`
  width: 250px;
  background-color: ${(props) => props.theme.secondaryBackground};
  color: ${(props) => props.theme.primaryText};
  padding: 20px;
  height: 100%;
  position: sticky;
  top: 0;
  min-height: 100vh;
  border-right: 1px solid ${(props) => props.theme.border};
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
`;

export const Article = styled.article`
  flex: 1;
  padding: 30px;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
`;

// export const StyledLink = styled.a`
//   font-family: "Inter", sans-serif;
//   font-size: 0.95rem;
//   font-weight: 500;
//   color: ${(props) => props.theme.button};
//   text-decoration: none;
//   cursor: pointer;
//   transition: color 0.3s ease, transform 0.2s ease;
//   display: inline-block;

//   &:hover {
//     color: ${(props) => props.theme.buttonHover};
//     transform: translateX(5px);
//   }

//   &:active {
//     transform: scale(0.95);
//   }
// `;

export const StyledLink = styled.a`
  flex-grow: 1;
  text-decoration: none;
  color: ${(props) => props.theme.primaryText};

  &.active {
    font-weight: bold;
    border-left: 3px solid ${(props) => props.theme.activeLink};
    padding-left: 12px;
  }
`;
