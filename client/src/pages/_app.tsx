import type { AppProps } from 'next/app'
import { Pane, defaultTheme, ThemeProvider } from 'evergreen-ui'

function MyApp({ Component, pageProps }: AppProps) {
  return <ThemeProvider value={defaultTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
}

export default MyApp
