import { reply } from 'worktop/response';
import * as utils from 'worktop/utils';
import * as Model from './whiteboardModel';

import type { Whiteboard } from './whiteboardModel';
import type { Handler } from './types';

/**
 * POST /whiteboard/:id
 */
export const create: Handler = async function (req, context) {
	const { id } = context.params

	const result = await Model.insert(context.bindings.WHITEBOARD, id);

	if (result) return reply(201, result);
	return reply(500, 'Error creating item');
}

/**
 * GET /whiteboard/:id
 */
export const show: Handler = async function (req, context) {
	const { id } = context.params;
	const item = await Model.find(context.bindings.WHITEBOARD, id);

	if (item) return reply(200, item);
	else return reply(404, 'Missing item');
}

/**
 * PUT /whiteboard/:id
 */
export const update: Handler = async function (req, context) {
	const { username } = context.params;

	// Grab input values;
	// NOTE: assumes JSON or FormData
	const input = await utils.body<Whiteboard>(req);
	if (!input || !input.count) return reply(422, { title: 'required' });

	const result = await Model.update(context.bindings.WHITEBOARD, username, input);

	if (result) return reply(201, result);
	return reply(500, 'Error updating item');
}

/**
 * DELETE /whiteboard/:id
 */
export const destroy: Handler = async function (req, context) {
	const { id } = context.params;
	const isDone = await Model.destroy(context.bindings.WHITEBOARD, id);

	if (isDone) return reply(204);
	else return reply(500, 'Error removing item');
}