import { Router } from 'worktop'
import { Actor, Durable } from 'worktop/cfw.durable'
import { Bindings } from 'worktop/cfw'
import { WebSocket } from 'worktop/cfw.ws'
import { reply } from 'worktop/response'

type Connection = {
    ws: WebSocket
}

function replyWS(socket: WebSocket, type: string, data: number | string) {
    let message = JSON.stringify({ type, data })
    socket.send(message)
}

export class Counter extends Actor {
    DEBUG = true
    count: number = 0
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

        console.log(Object.keys(this))
    }

    async setup(state: Durable.State, bindings: Bindings) {
        console.log('setup')
        this.count = (await state.storage.get(`count`)) || 0
    }

    receive(req: Request): Promise<Response> {
        console.log('receiver')

        return this.API.run(req, {
            waitUntil: this.#wait
        });
    }

    onconnect(req: Request, server: WebSocket) {
        console.log('onconnect')
        this.connections.push({ ws: server })

        server.addEventListener(`message`, this.handleMessage)
        server.addEventListener(`close`, this.handleCloseOrError)
        server.addEventListener(`error`, this.handleCloseOrError)

        replyWS(server, `count/LOADED`, this.count)
    }

    router() {
        console.log('router')
        const API = new Router()

        API.add(`GET`, `/`, () => {
            console.log('GET /')
            return reply(200, this.count)
        })

        API.add(`GET`, `/ws`, async (req) => {
            console.log('/ws')
            console.log(req)
            const x =  await this.connect(req)
            console.log(x)
            return x
        })
        return API
    }

    broadcast() {
        console.log('broadcast')
        this.connections.forEach((client) => {
            try {
                replyWS(client.ws, `count/UPDATED`, this.count)
            } catch (err) { }
        })
    }

    handleMessage = async (e) => {
        console.log('handleMessage', e)
        try {
            const event = JSON.parse(e.data)
            console.log(event, this.storage)

            // switch (event.type) {
            //     case 'increment':
            //         await this.storage.put('count', ++this.count)
            //         break

            //     case 'decrement':
            //         await this.storage.put('count', --this.count)
            //         break

            //     default:
            //         break
            // }

            this.broadcast()
        } catch (err) {
            console.error(err)
        }
    }

    handleCloseOrError = (e) => {
        console.log('handleCloseError', e)
        this.connections = this.connections.filter(({ ws }) => ws !== e.target)
    }
}