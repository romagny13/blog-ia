import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.color};
    margin: 0;
    margin: 0;
    font-family: "Roobert", "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;

export default GlobalStyle;
