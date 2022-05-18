import * as DB from 'worktop/cfw.kv'
import { ulid } from 'worktop/utils'

import type { ULID } from 'worktop/utils'
import type { KV } from 'worktop/cfw.kv'

export interface Counter {
    uid: ULID
    count: number
}

/**
 * Force-write a `Counter` record
 */
 export function save(COUNTER: KV.Namespace, item: Counter): Promise<boolean> {
	const key = item.uid
	return DB.write(COUNTER, key, item);
}

/**
 * Find a `Counter` record by its <username>::<uid> pair
 */
export function find(COUNTER: KV.Namespace, uid: string): Promise<Counter|null> {
	const key = uid
	return DB.read<Counter>(COUNTER, key, 'json');
}

/**
 * Create a new `Counter` record for <username>
 * - Ensures the `uid` value is unique to them
 * - Carefully picks value-keys for the record data
 * - Synchronizes owner's ID list for `GET /Counters` route
 */
export async function insert(COUNTER: KV.Namespace, item: Partial<Counter>): Promise<Counter|void> {
	try {
		// Generate new UID
		const nextID = await DB.until(
			() => ulid(), // 8 character string
			(x) => find(COUNTER, x), // check if unique for user
		);

		const values: Counter = {
			uid: nextID,
            count: item.count || 0
		};

		// exit early if could not save new `Counter` record
		if (!await save(COUNTER, values)) return;

		// return the new item
		return values;
	} catch (err) {
		// void
	}
}

/**
 * Update an existing `Counter` record for <username>
 * - Carefully picks value-keys to be saved
 * - Ensures `updated_at` is touched
 */
export async function update(COUNTER: KV.Namespace, username: string, item: Counter): Promise<Counter|void> {
	// Pick values explictly
	const values: Counter = {
		uid: item.uid,
        count: item.count || 0
	};

	const success = await save(COUNTER, values);
	if (success) return values;
}

/**
 * Remove an existing `Counter` record
 * - Synchronizes owner's ID list for `GET /Counters` route
 */
export function destroy(COUNTER: KV.Namespace, uid: string): Promise<boolean> {
	const key = uid
	return DB.remove(COUNTER, key);
}