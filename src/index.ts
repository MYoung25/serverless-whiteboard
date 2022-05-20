import { Router } from 'worktop'
import { start } from 'worktop/cfw'
import { Context } from './types'
import { reply } from 'worktop/response'
import { Durable } from 'worktop/cfw.durable'

export * from './durableObject'
export * from './whiteboard'

const xAPI = new Router<Context>()

xAPI.add('GET', '/whiteboard/:id/ws', async (request: Request, context) => {
    if (!context.bindings) return reply(500)
    try {
        const { id } = context.params
        const url = new URL(request.url)
    
        url.pathname = url.pathname.replace(`/whiteboard/${id}`, '')
    
        let namespace = context.bindings.WHITEBOARDDO as Durable.Namespace
        let objectId = namespace.idFromName(id);
        let obj = namespace.get(objectId);

        return obj.fetch(url.toString(), request)
    } catch (e) {
        return reply(500)
    }
})

export default start(xAPI.run)