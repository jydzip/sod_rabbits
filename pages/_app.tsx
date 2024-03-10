import React from 'react'
import type { AppProps } from 'next/app'
import { GlobalStyle } from '../src/Styled'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
        <GlobalStyle />
        <Component {...pageProps} />
        </>
    )
}