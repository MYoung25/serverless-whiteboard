import React, { useRef, useEffect } from "react";
import { Pane, majorScale, Heading } from "evergreen-ui";
import { ConnectionIndicator } from "./ConnectionIndicator";

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

export function Canvas({ whiteboardId }: { whiteboardId: string }) {
    const { CanvasService, WebsocketService } = useServices();
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            CanvasService.init(canvasRef.current);
            WebsocketService.init(whiteboardId);
        }
    }, [canvasRef.current, whiteboardId, CanvasService, WebsocketService]);

    return (
        <Pane>
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

            <Pane elevation={3} width={375} height={300}>
                <canvas
                    ref={canvasRef}
                />
            </Pane>
            <ConnectionIndicator whiteboardId={whiteboardId} />
        </Pane>
    );
}
