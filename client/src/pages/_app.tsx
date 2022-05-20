import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Pane, defaultTheme, ThemeProvider } from "evergreen-ui";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider value={defaultTheme}>
      <Pane
        height={"100vh"}
        width={"100vw"}
        backgroundImage="url(/footer.svg), url(/right-yellow.svg), url(/left-red.svg)"
        backgroundPosition="bottom, right top, left center"
        backgroundSize="600px, 100px, 75px"
        backgroundRepeat="repeat-x, no-repeat, no-repeat"
      >
        <Component {...pageProps} />
      </Pane>
    </ThemeProvider>
  );
}

export default MyApp;
