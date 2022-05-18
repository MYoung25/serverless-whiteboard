import type * as worktop from 'worktop';
import type { KV } from 'worktop/cfw.kv';
import type { Durable } from 'worktop/cfw.durable';

export interface Context extends worktop.Context {
	bindings: {
		COUNTER: KV.Namespace;
        COUNTERDO: Durable.Namespace;
	};
}

export type Handler = worktop.Handler<Context>;