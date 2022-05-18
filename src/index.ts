import { Router } from 'worktop'
import { start } from 'worktop/cfw'
import * as Counters from './routes'
import { Context } from './types'
import { reply } from 'worktop/response'

export * from './durableObject'

const xAPI = new Router<Context>()

xAPI.add('GET', '/counter/ws', async (request: Request, context) => {
    if (context.bindings) {
        const url = new URL(request.url)

        url.pathname = url.pathname.replace('/counter', '')

        let namespace = context.bindings.COUNTERDO as DurableObjectNamespace
        let id = namespace.idFromName("A");
        let obj = namespace.get(id);

        return obj.fetch(url.toString())
    }
    return reply(404)
})
xAPI.add('POST', '/counter', Counters.create)
xAPI.add('GET', '/counter/:uid', Counters.show)
xAPI.add('PUT', '/counter/:uid', Counters.update)
xAPI.add('DELETE', '/counter/:uid', Counters.destroy)

export default start(xAPI.run)