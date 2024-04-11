import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: 'ANTON';
        src: url('./fonts/Anton-Regular.ttf');
    }

    html {
        font-family: ANTON;
        color: #fff;
        text-shadow: 1.5px 1.5px 0 #474747, 1.5px -1.5px 0 #474747, -1.5px 1.5px 0 #474747, -1.5px -1.5px 0 #474747, 1.5px 0px 0 #474747, 0px 1.5px 0 #474747, -1.5px 0px 0 #474747, 0px -1.5px 0 #474747;
    }
    body {
        margin: 0 !important;
        background-size: 12%;
        color: #757575;
        background-color: #5e7978;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    .dg.main.a {
        margin-right: 7%;
    }
`

export const InfoIco = ({ color = "" }: { color?: string }) => {
    return <img src={`./info${color ? `_${color}` : ''}.png`} className='ico'/>;
};

export function capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}