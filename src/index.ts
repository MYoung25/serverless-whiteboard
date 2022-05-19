import { Router } from 'worktop'
import { start } from 'worktop/cfw'
import * as Counters from './routes'
import { Context } from './types'
import { reply } from 'worktop/response'
import { Durable } from 'worktop/cfw.durable'

export * from './durableObject'

const xAPI = new Router<Context>()

xAPI.add('GET', '/hello/ws', async (request: Request, context) => {
    if (!context.bindings) return reply(500)

    const url = new URL(request.url)

    url.pathname = url.pathname.replace('/hello', '')

    let namespace = context.bindings.COUNTERDO as Durable.Namespace
    let id = namespace.idFromName("A");
    let obj = namespace.get(id);

    return obj.fetch(url.toString(), request)
})
xAPI.add('POST', '/counter', Counters.create)
xAPI.add('GET', '/counter/:uid', Counters.show)
xAPI.add('PUT', '/counter/:uid', Counters.update)
xAPI.add('DELETE', '/counter/:uid', Counters.destroy)

export default start(xAPI.run)