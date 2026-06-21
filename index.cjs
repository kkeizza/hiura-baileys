'use strict';

/**
 * hiura-baileys — CJS entry point
 * By Nimzz · github.com/Nimzz-pemboy
 * Base: hiura-baileys 1.5.0 (cr: @Blckrose0)
 *
 * Cara pakai — sama seperti CJS biasa, tidak ada lagi await/ready:
 *
 *   const { makeWASocket, useMultiFileAuthState, proto, BufferJSON } = require('hiura-baileys');
 *
 *   async function start() {
 *     const { state, saveCreds } = await useMultiFileAuthState('./auth');
 *     const conn = makeWASocket({ auth: state });
 *   }
 *   start();
 *
 * ============================================================
 * KENAPA FILE INI DITULIS ULANG (v1.5.0 -> v1.5.1 internal fix)
 * ============================================================
 * Versi sebelumnya pakai dynamic import() + lazy getter: semua nilai
 * non-fungsi (proto, BufferJSON, DisconnectReason, dst) baru benar-benar
 * tersedia SETELAH _load() selesai, dan _load() baru jalan kalau ada
 * fungsi (mis. useMultiFileAuthState) yang sempat dipanggil dan di-await
 * duluan. Konsekuensinya: kode yang melakukan
 *
 *   const { proto, BufferJSON } = require('hiura-baileys');
 *
 * di baris paling atas file (sebelum ada `await` apapun) akan dapat
 * error "belum siap", karena destructuring itu mengevaluasi getter
 * SAAT ITU JUGA, secara sinkron — padahal _mod waktu itu masih null.
 *
 * Solusinya: lib/index.js (ESM) di package ini TIDAK punya top-level
 * await, sehingga sejak Node v20.19.0 / v22.12.0 (require(esm) sudah
 * stabil tanpa flag), kita bisa require() dia langsung secara SINKRON
 * dan dapat semua exports-nya seketika — persis seperti module CJS
 * biasa. Tidak perlu lagi dynamic import(), tidak perlu lagi lazy
 * getter, tidak perlu lagi await ready.
 *
 * SYARAT NODE: >= 20.19.0 atau >= 22.12.0. Kalau Node lebih lama dari
 * itu, require() di bawah akan throw ERR_REQUIRE_ESM dengan pesan asli
 * dari Node — pesan error di catch block bawah ini menjelaskan kenapa
 * dan apa yang perlu di-upgrade.
 */

let _mod;
try {
  _mod = require('./lib/index.js');
} catch (err) {
  if (err && err.code === 'ERR_REQUIRE_ESM') {
    const v = process.versions.node;
    throw new Error(
      `[hiura-baileys] Gagal require('./lib/index.js') karena Node.js Anda (v${v}) ` +
      `belum mendukung require(esm) secara native.\n` +
      `Package ini butuh Node.js >= 20.19.0 atau >= 22.12.0 (tanpa flag tambahan).\n` +
      `Silakan upgrade Node.js Anda, lalu jalankan ulang.\n\n` +
      `Error asli dari Node: ${err.message}`
    );
  }
  throw err;
}

// Re-export semua named exports + default secara langsung, sinkron.
// Tidak ada lagi getter/proxy — ini object biasa, sama seperti hasil
// require() module CJS pada umumnya.
for (const key of Object.keys(_mod)) {
  if (key === 'default') continue;
  module.exports[key] = _mod[key];
}

// default export (makeWASocket) — exported juga sebagai named export
// 'makeWASocket' untuk kompatibilitas dengan kode yang sudah destructure
// `const { default: makeWASocket } = require('hiura-baileys')` (gaya lama)
// MAUPUN `const { makeWASocket } = require('hiura-baileys')` (gaya baru).
module.exports.default = _mod.default;
if (!('makeWASocket' in module.exports)) {
  module.exports.makeWASocket = _mod.default;
}

// Properti ini sengaja tetap disediakan (walau sekarang sudah tidak
// dibutuhkan secara fungsional) supaya kode lama yang masih menulis
// `await require('hiura-baileys').ready` tidak crash — sekarang cuma
// Promise yang sudah resolved dari awal.
module.exports.ready = Promise.resolve(_mod);
