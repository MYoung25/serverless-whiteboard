import { CanvasService as cs } from "./CanvasService"
import { WebsocketService as wss } from "./WebSocketService"

const WebsocketService = new wss()
const CanvasService = new cs(WebsocketService)

export const services = {
    WebsocketService,
    CanvasService,
}

export function useServices () {
    return services
}