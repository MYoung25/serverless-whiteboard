import React, { useRef, useEffect, useState } from "react";
import { Pane, majorScale, Heading } from "evergreen-ui";
import { ConnectionIndicator } from "./ConnectionIndicator";
import { animated, useSpring, config } from "@react-spring/web";

import { useServices } from "../services";

const palette: string[] = [
        "green",
        "blue",
        "red",
        "yellow",
        "orange",
        "black",
        "white",
]

export function Canvas({ whiteboardId = '' }: { whiteboardId: string }) {
    const { CanvasService, WebsocketService } = useServices();
    const canvasRef = useRef(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (canvasRef.current) {
            CanvasService.init(canvasRef.current);
            WebsocketService.init(whiteboardId);
            setIsInitialized(true);
        }
    }, [whiteboardId, CanvasService, WebsocketService]);

    const spring = useSpring({
        to: {
            opacity: 1,
            width: '100%',
        },
        from: {
            opacity: 0,
            width: '0',
        },
        config: config.slow
    })

    return (
        <animated.div style={spring} >
            <Pane marginBottom={majorScale(3)}>
                <Heading marginTop={majorScale(3)} marginBottom={majorScale(1)}>Color Palette</Heading>
                <Pane display={'flex'}>
                    {
                        palette.map(color => (
                            <Pane
                                key={color}
                                marginRight={majorScale(1)}
                                flex={1} 
                                onClick={() => CanvasService.setColor(color)}
                                backgroundColor={color}
                                height={majorScale(5)}
                                border='1px solid black'
                            />
                        ))
                    }
                </Pane>
            </Pane>

            <Pane elevation={3} width={375} height={300} backgroundColor="white" >
                <canvas
                    ref={canvasRef}
                    style={{touchAction:"none"}}
                />
            </Pane>
            <ConnectionIndicator whiteboardId={whiteboardId} />
        </animated.div>
    );
}
