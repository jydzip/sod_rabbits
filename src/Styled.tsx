import { css, createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`    
    html::before {
        content: "";
        width: 100%;
        height: 100%;
        background-size: 400px;
        position: fixed;
        animation: backgroundScroll 100s linear infinite;
    }

    body {
        margin: 0 !important;
        background-size: 12%;
        color: #757575;
        background-color: #5e6a79;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }
`