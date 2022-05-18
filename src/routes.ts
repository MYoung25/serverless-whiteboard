import { reply } from 'worktop/response';
import * as utils from 'worktop/utils';
import * as Model from './model';

import type { Counter } from './model';
import type { Handler } from './types';

/**
 * POST /users/:username/todos
 */
export const create: Handler = async function (req, context) {
	// Grab input values;
	// NOTE: assumes JSON or FormData
	const input = await utils.body<Counter>(req);
	if (!input || !input.count) return reply(422, { count: 'required' });

	const result = await Model.insert(context.bindings.COUNTER, { ...input });

	if (result) return reply(201, result);
	return reply(500, 'Error creating item');
}

/**
 * GET /users/:username/todos/:uid
 */
export const show: Handler = async function (req, context) {
	const { uid } = context.params;
	const item = await Model.find(context.bindings.COUNTER, uid);

	if (item) return reply(200, item);
	else return reply(404, 'Missing item');
}

/**
 * PUT /users/:username/todos/:uid
 */
export const update: Handler = async function (req, context) {
	const { username } = context.params;

	// Grab input values;
	// NOTE: assumes JSON or FormData
	const input = await utils.body<Counter>(req);
	if (!input || !input.count) return reply(422, { title: 'required' });

	const result = await Model.update(context.bindings.COUNTER, username, input);

	if (result) return reply(201, result);
	return reply(500, 'Error updating item');
}

/**
 * DELETE /users/:username/todos/:uid
 */
export const destroy: Handler = async function (req, context) {
	const { uid } = context.params;
	const isDone = await Model.destroy(context.bindings.COUNTER, uid);

	if (isDone) return reply(204);
	else return reply(500, 'Error removing item');
}