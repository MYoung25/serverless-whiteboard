import ReconnectingWebsocket from 'reconnecting-websocket'

export interface Listeners {
    eventName: string,
    handler: (message: MessageEvent) => void | Promise<void>
}

// @ts-ignore
const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL

export class WebsocketService {

    ws?: ReconnectingWebsocket
    
    init (id: string) {
        if (this.ws) return

        this.ws = new ReconnectingWebsocket(`${WEBSOCKET_URL}/whiteboard/${id}/ws`)

    }

    registerListeners (listeners?: Listeners[]) {
        if (!this.ws) return

        listeners?.forEach((listener: Listeners) => {
            this.ws.addEventListener(listener.eventName, listener.handler)
        })

    }

    emit (data: { type: string, data?: string | object }) {
        if (!this.ws) return

        this.ws.send(JSON.stringify(data))
    }

}