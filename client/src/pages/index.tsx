import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { Pane, Heading, TextInput, Button, majorScale, toaster } from "evergreen-ui";
import { Canvas } from "../components/Canvas";
import GitHubButton from "react-github-btn"

const Home: NextPage = () => {
  const [whiteboardInput, setWhiteboardInput] = useState("");
  const [whiteboardId, setWhiteboardId] = useState<undefined | string>(
    undefined
  );

  function handleSubmit(e: KeyboardEvent | MouseEvent) {
      if (e.type === 'click' || (e.type === 'keypress' && 'code' in e && e.code === 'Enter')) {
            if (whiteboardInput.length === 0) {
                toaster.danger("Whiteboard ID cannot be empty");
                return;
            }
            setWhiteboardId(whiteboardInput)
      }      
  }

  return (
    <Pane>
      <Head>
        <title>Serverless Whiteboard</title>
        <meta name="description" content="A serverless whiteboard created with Cloudflare products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
          <Pane
            position="fixed"
            bottom={majorScale(1)}
            right={majorScale(1)}
          >
            <GitHubButton href="https://github.com/MYoung25/serverless-whiteboard" aria-label="Star MYoung25/serverless-whiteboard on GitHub">Serverless Whiteboard</GitHubButton>
          </Pane>
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Pane flex={1} textAlign='center'>
            <Heading size={900}>Serverless Whiteboard</Heading>
            <Heading size={500}>
              Includes auto-saving and real-time collaboration
            </Heading>
            <Heading size={200}>Refresh the page to change whiteboards</Heading>
          </Pane>

          <Pane flex={1}>
            {
                whiteboardId
                ? <Canvas whiteboardId={whiteboardId} />
                :
                <Pane marginTop={majorScale(2)}>
                    <TextInput
                        onChange={(e: Event) => {
                            setWhiteboardInput((e.target as HTMLInputElement).value)
                        }}
                        onKeyPress={handleSubmit}
                        value={whiteboardInput}
                        placeholder="Whiteboard ID"
                    />
                    <Button
                        appearance="primary"
                        intent="success"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                    <Pane
                        marginTop={majorScale(4)}
                        display='grid'
                        alignItems='center'
                        height={majorScale(6)}
                        backgroundImage='url(/pages.svg)'
                        backgroundSize='contain'
                        backgroundRepeat='no-repeat'
                        backgroundPosition='right'
                    >
                        <Heading>Hosted On</Heading>
                    </Pane>
                    <Pane
                        display='grid'
                        alignItems='center'
                        height={majorScale(6)}
                        backgroundImage='url(/workers.svg)'
                        backgroundSize='contain'
                        backgroundRepeat='no-repeat'
                        backgroundPosition='right'
                    >
                        <Heading>Built With</Heading>
                    </Pane>
                </Pane>
            }
          </Pane>
        </Pane>
      </main>
    </Pane>
  );
};

export default Home;
