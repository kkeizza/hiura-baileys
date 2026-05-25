/**
 * @ryuhan/baileys — CJS wrapper type declarations
 *
 * Destructure dan langsung pakai, tanpa await ready:
 *
 *   const { makeWASocket, useMultiFileAuthState, Browsers } = require('@ryuhan/baileys');
 *
 *   async function start() {
 *     const { state, saveCreds } = await useMultiFileAuthState('./auth');
 *     const conn = makeWASocket({ auth: state });
 *   }
 *   start();
 */

export * from './lib/index.js';
export { default, default as makeWASocket } from './lib/index.js';

import type { UserFacingSocketConfig } from './lib/Types/index.js';
type BaileysModule = typeof import('./lib/index.js');

/** Promise yang resolve saat Baileys selesai load. Opsional — fungsi sudah auto-await. */
export declare const ready: Promise<BaileysModule>;

/** Load Baileys secara eksplisit. */
export declare function load(): Promise<BaileysModule>;

/** Convenience: load + makeWASocket sekaligus. */
export declare function createSocket(
  config: UserFacingSocketConfig
): Promise<ReturnType<BaileysModule['default']>>;
