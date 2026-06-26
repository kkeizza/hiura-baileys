/**
 * ESM wrapper untuk lib/Voip/index.js (CJS).
 *
 * Node.js mengizinkan ESM meng-import CJS lewat dynamic import() atau
 * lewat default-import lalu destructure — tapi TIDAK mengizinkan named
 * imports langsung dari CJS (karena named exports CJS tidak bisa dianalisis
 * secara static oleh ESM linker).
 *
 * Solusinya: kita import CJS sebagai default (yang mengembalikan
 * module.exports seluruhnya), lalu re-export tiap named export secara
 * eksplisit supaya ESM consumer bisa pakai:
 *
 *   import { VoipClient, ActiveCall, CallState } from 'hiura-baileys/lib/Voip/index.mjs'
 *   import VoipClient from 'hiura-baileys/lib/Voip/index.mjs'
 */

// createRequire supaya file ESM ini bisa require() CJS
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const _voip = require(join(__dirname, 'index.js'));

export const VoipClient   = _voip.VoipClient;
export const ActiveCall   = _voip.ActiveCall;
export const CallState    = _voip.CallState;
export default            _voip.VoipClient;
