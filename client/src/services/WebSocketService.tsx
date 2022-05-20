import ReconnectingWebsocket from 'reconnecting-websocket'

export interface Listeners {
    eventName: string,
    handler: (message: MessageEvent) => void | Promise<void>
}

// @ts-ignore
const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL

export class WebsocketService {

    ws?: ReconnectingWebsocket
    listeners: Listeners[] = []
    
    init (id: string) {
        if (this.ws) return

        console.log('initializing websocket...')
        this.ws = new ReconnectingWebsocket(`${WEBSOCKET_URL}/whiteboard/${id}/ws`)

        this.ws.addEventListener('open', () => {
            this.emit({ type: 'load' })
            this.registerListeners(this.listeners)
        })
    }

    registerListeners (listeners?: Listeners[]) {
        if (!this.ws) return
        
        listeners?.forEach((listener: Listeners) => {
            console.log('registering listener...', listener.eventName)
            this.ws.addEventListener(listener.eventName, listener.handler)
        })

    }
    
    addListeners (listeners: Listeners[]) {
        if (!this.ws) {
            this.listeners = listeners
        } else {
            this.registerListeners(listeners)
        }
    }


    emit (data: { type: string, data?: string | object }) {
        if (!this.ws) return

        this.ws.send(JSON.stringify(data))
    }

}