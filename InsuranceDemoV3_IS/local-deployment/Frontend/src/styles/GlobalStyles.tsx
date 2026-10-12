import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .main-content {
    margin-top: 64px !important; /* Force content below header */
  }

  body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
    color: #333;
  }

  h1 {
    font-size: 2.5rem;
    color: #4a90e2;
  }

  button {
    cursor: pointer;
  }
`;

// Make sure to include this default export
export default GlobalStyles;