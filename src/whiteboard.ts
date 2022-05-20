import { Router } from 'worktop'
import { Actor, Durable } from 'worktop/cfw.durable'
import { Bindings } from 'worktop/cfw'
import { WebSocket } from 'worktop/cfw.ws'
import { reply } from 'worktop/response'
import * as Model from './whiteboardModel'
import { KV } from 'worktop/cfw.kv'

type Connection = {
    ws: WebSocket
}

export interface drawObject {
    moveTo: {
        x: number, y: number
    }
    lineTo: {
        x: number, y: number
    }
    strokeStyle: string
    lineWidth: number
}

function replyWS(socket: WebSocket, type: string, data: drawObject | drawObject[]) {
    let message = JSON.stringify({ type, data })
    socket.send(message)
}

export class Whiteboard extends Actor {
    DEBUG = true
    BINDINGS: Bindings
    whiteboardId: string
    whiteboardPaths: drawObject[] = []
    API: Router
    connections: Connection[] = []
    storage: Durable.Storage
    #wait: Durable.State['waitUntil'];

    constructor(state: Durable.State, env: Bindings) {
        super(state, env);
        this.API = this.router()
        // NOTE: don't actually need this
        this.#wait = state.waitUntil.bind(state);
        this.storage = state.storage
        this.whiteboardId = state.id.toString()
        this.BINDINGS = env
    }

    async setup(state: Durable.State, bindings: Bindings) {
        const storedWhiteboard = await Model.find(bindings.WHITEBOARD as KV.Namespace, this.whiteboardId)
        if (storedWhiteboard) {
            this.whiteboardPaths = storedWhiteboard.whiteboardPaths
            return
        }
        this.whiteboardPaths = (await state.storage.get(`whiteboardPaths`)) || []
        await Model.insert(this.BINDINGS.WHITEBOARD as KV.Namespace, {
            id: this.whiteboardId,
            whiteboardPaths: this.whiteboardPaths
        })
    }

    receive(req: Request): Promise<Response> {
        return this.API.run(req, {
            waitUntil: this.#wait
        });
    }

    onconnect(req: Request, server: WebSocket) {
        this.connections.push({ ws: server })

        server.addEventListener(`message`, (e: MessageEvent) => {
            this.handleMessage(server, e)
        })
        server.addEventListener(`close`, this.handleCloseOrError)
        server.addEventListener(`error`, this.handleCloseOrError)
    }

    router() {
        const API = new Router()

        API.add(`GET`, `/`, () => {
            return reply(200, this.whiteboardPaths)
        })

        API.add(`GET`, `/ws`, async (req) => {
            return await this.connect(req)
        })
        return API
    }

    broadcast(event: string, data: drawObject | undefined , emitter?: WebSocket) {
        this.connections
            .filter(({ ws }: {ws: WebSocket}) => {
                if (!emitter) return true
                return ws !== emitter
            })
            .forEach((client) => {
                try {
                    replyWS(client.ws, event, data || this.whiteboardPaths)
                } catch (err) { }
            })
    }

    handleMessage = (server: WebSocket, e: MessageEvent) => {
        try {
            const event = JSON.parse(e.data)

            switch (event.type) {
                case 'addPath':
                    this.whiteboardPaths.push(event.data)
                    void this.storage.put('whiteboardPaths', this.whiteboardPaths)
                    this.broadcast(`whiteboard/UPDATED`, event.data, server)
                    break
                case 'load':
                    replyWS(server, `whiteboard/LOADED`, this.whiteboardPaths)
                    break
                default:
                    break
            }

        } catch (err) {}
    }

    handleCloseOrError = (e) => {
        this.connections = this.connections.filter(({ ws }) => ws !== e.target)

        void Model.update(this.BINDINGS.WHITEBOARD as KV.Namespace, {
            id: this.whiteboardId,
            whiteboardPaths: this.whiteboardPaths
        })
    }
}