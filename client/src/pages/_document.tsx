// COPIED FROM segmentio/evergreen-ui:
// https://github.com/segmentio/evergreen/blob/0ba8a87b70c029febac59b57277336a8f45fe5cd/examples/ssr-next/pages/_document.js

/* eslint-disable react/no-danger */
import React from 'react'
import { extractStyles } from 'evergreen-ui'
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
    // @ts-ignore
    static async getInitialProps({ renderPage }) {
        const page = await renderPage()
        // `css` is a string with css from both glamor and ui-box.
        // No need to get the glamor css manually if you are using it elsewhere in your app.
        //
        // `hydrationScript` is a script you should render on the server.
        // It contains a stringified version of the glamor and ui-box caches.
        // Evergreen will look for that script on the client and automatically hydrate
        // both glamor and ui-box.
        const { css, hydrationScript } = extractStyles()

        return {
            ...page,
            css,
            hydrationScript
        }
    }

    render() {
        // @ts-ignore
        const { css, hydrationScript } = this.props

        return (
            <Html>
                <Head>
                    <style dangerouslySetInnerHTML={{ __html: css }} />
                </Head>

                <body>
                <Main />
                {hydrationScript}
                <NextScript />
                </body>
            </Html>
        )
    }
}
