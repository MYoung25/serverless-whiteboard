import { CanvasService } from "./canvasService"

const services = {
    CanvasService: new CanvasService()
}

export function useServices () {
    return services
}