import { Handler } from 'worktop'
import { Bindings } from 'worktop/cfw'
import ws, { WebSocket, Socket } from 'worktop/cfw.ws'
import { Actor, Durable } from 'worktop/cfw.durable'

function reply (socket: Socket, type: string, data: number | string) {
    let message = JSON.stringify({ type, data })
    socket.send(message)
}

export const listen: Handler = ws.listen(async function (req, context, socket) {
    let { name } = context.params;
	let { event, state } = socket;

    console.log(context.bindings)

	// ignore non-'message' events
	if (event.type !== 'message') return;

	// initialize context on start
	state.count = state.count || 0;

	// parse & react to incoming message data
	let { type, value=1 } = JSON.parse(event.data);

	if (type === 'ping') {
		return reply(socket, 'pong', Date.now());
	}

	if (type === 'incr') {
		state.count += value;
		return reply(socket, name, state.count);
	}

	if (type === 'decr') {
		state.count -= value;
		return reply(socket, name, state.count);
	}

	if (type === 'exit') {
		reply(socket, 'exit', 'goodbye');
		return socket.close();
	}
})

