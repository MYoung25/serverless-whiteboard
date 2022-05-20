import * as DB from 'worktop/cfw.kv'

import type { KV } from 'worktop/cfw.kv'
import type { drawObject } from './whiteboard'

export interface Whiteboard {
    id: string
    whiteboardPaths: drawObject[]
}

/**
 * Force-write a `Whiteboard` record
 */
 export function save(WHITEBOARD: KV.Namespace, item: Whiteboard): Promise<boolean> {
	const key = item.id
	return DB.write(WHITEBOARD, key, item);
}

/**
 * Find a `Whiteboard` record by its id
 */
export function find(WHITEBOARD: KV.Namespace, id: string): Promise<Whiteboard|null> {
	const key = id
	return DB.read<Whiteboard>(WHITEBOARD, key, 'json');
}

/**
 * Create a new `Whiteboard` record
 */
export async function insert(WHITEBOARD: KV.Namespace, item: Whiteboard): Promise<Whiteboard|void> {
	try {
		// exit early if could not save new `Whiteboard` record
		if (!await save(WHITEBOARD, item)) return;

		// return the new item
		return item;
	} catch (err) {
		// void
	}
}

/**
 * Update an existing `Whiteboard` record with :id
 */
export async function update(WHITEBOARD: KV.Namespace, item: Whiteboard): Promise<Whiteboard|void> {
	// Pick values explictly
	const values: Whiteboard = {
		id: item.id,
        whiteboardPaths: item.whiteboardPaths
	};

	const success = await save(WHITEBOARD, values);
	if (success) return values;
}

/**
 * Remove an existing `Counter` record
 * - Synchronizes owner's ID list for `GET /Counters` route
 */
export function destroy(WHITEBOARD: KV.Namespace, id: string): Promise<boolean> {
	const key = id
	return DB.remove(WHITEBOARD, key);
}