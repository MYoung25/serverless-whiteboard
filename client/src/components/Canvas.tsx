import { useRef, useEffect } from "react";
import { Pane, majorScale } from "evergreen-ui";

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

export function Canvas() {
    const { CanvasService } = useServices();
    const canvasRef = useRef(null);
    
    useEffect(() => {
        CanvasService.init(canvasRef.current);
    }, [canvasRef.current])

    return (
        <>
            <Pane elevation={3} width={375} height={300}>
                <canvas
                    ref={canvasRef}
                />
            </Pane>

            <Pane display={'flex'} marginTop={majorScale(3)}>
                {
                    palette.map(color => (
                        <Pane
                            key={color}
                            marginRight={majorScale(1)}
                            flex={1} 
                            onClick={() => CanvasService.color(color)}
                            style={{ backgroundColor: color }}
                        >
                            {color}
                        </Pane>
                    ))
                }
                
            </Pane>
        </>
    );
}
