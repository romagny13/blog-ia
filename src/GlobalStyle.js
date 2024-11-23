import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
* {
    box-sizing: border-box;  
  }

  body {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.color};
    margin: 0;
    margin: 0;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    line-height: 1.5;
  }
`;

export default GlobalStyle;
