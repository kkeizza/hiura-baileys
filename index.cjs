'use strict';

/**
 * hiura-baileys — CJS wrapper
 * By Nimzz · github.com/Nimzz-pemboy
 * Base: blckrose-baileys 2.0.7 (cr: @Blckrose0)
 *
 * Destructure dan langsung pakai tanpa await ready:
 *
 *   const { makeWASocket, useMultiFileAuthState, Browsers } = require('hiura-baileys');
 *
 *   async function start() {
 *     const { state, saveCreds } = await useMultiFileAuthState('./auth');
 *     const conn = makeWASocket({ auth: state });
 *   }
 *   start();
 *
 * Cara kerja:
 *   - ESM di-load di background saat require() dipanggil
 *   - Semua fungsi auto-await load selesai sebelum dieksekusi
 *   - Semua nilai non-fungsi (konstanta, enum) tersedia via getter setelah load
 *   - Tidak perlu await ready, tidak perlu top-level await
 */

let _mod = null;
let _loadPromise = null;
let _loadError = null;

function _load() {
  if (_loadPromise) return _loadPromise;
  _loadPromise = import('./lib/index.js').then(mod => {
    _mod = mod;
    // Populate semua exports setelah load
    for (const key of Object.keys(mod)) {
      if (key === 'default') continue;
      const val = mod[key];
      // Fungsi: sudah di-wrap jadi async-safe di bawah, skip overwrite
      if (typeof val === 'function') continue;
      // Nilai statis (konstanta, enum, object): langsung assign
      Object.defineProperty(module.exports, key, {
        value: val,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
    Object.defineProperty(module.exports, 'default', {
      value: mod.default,
      writable: true,
      enumerable: true,
      configurable: true,
    });
    module.exports.ready = Promise.resolve(mod);
    return mod;
  }).catch(err => {
    _loadError = err;
    throw err;
  });
  return _loadPromise;
}

// Kick off immediately on require()
_load();

module.exports.ready = _loadPromise;
module.exports.load = _load;

// ── Async-safe function wrapper ───────────────────────────────────────────────
// Semua fungsi di-wrap: otomatis tunggu ESM load selesai lalu eksekusi.
// Hasilnya: bisa dipanggil langsung tanpa await ready.

function _wrapFn(name) {
  return async function(...args) {
    if (_loadError) throw new Error('[blckrose-baileys] Load failed: ' + _loadError.message);
    if (!_mod) await _load();
    const fn = name === 'makeWASocket' ? _mod.default : _mod[name];
    if (typeof fn !== 'function') throw new Error('[blckrose-baileys] "' + name + '" bukan fungsi');
    return fn(...args);
  };
}

// makeWASocket khusus: return value-nya sync (WASocket object), bukan Promise
// Jadi kita wrap tapi return langsung hasil pemanggilan fn
function _wrapMakeWASocket() {
  return function makeWASocket(...args) {
    if (_mod) return _mod.default(...args);
    // Kalau belum load, throw — karena makeWASocket tidak async
    if (_loadError) throw new Error('[blckrose-baileys] Load failed: ' + _loadError.message);
    throw new Error(
      '[blckrose-baileys] makeWASocket dipanggil sebelum Baileys selesai load.\n' +
      'Pastikan await useMultiFileAuthState() dulu (itu sudah cukup untuk menunggu load).'
    );
  };
}

// ── Lazy getter untuk nilai non-fungsi ────────────────────────────────────────
function _makeLazyGetter(name) {
  return function() {
    if (_loadError) throw new Error('[blckrose-baileys] Load failed: ' + _loadError.message);
    if (_mod) return _mod[name];
    throw new Error(
      '[blckrose-baileys] "' + name + '" belum siap. ' +
      'Gunakan await useMultiFileAuthState() sebelum akses konstanta ini.'
    );
  };
}

// ── Daftar semua exports ──────────────────────────────────────────────────────

const _functions = [
  'addTransactionCapability','aesDecrypt','aesDecryptCTR','aesDecryptGCM',
  'aesDecryptWithIV','aesEncrypWithIV','aesEncrypt','aesEncryptCTR','aesEncryptGCM',
  'aggregateMessageKeysNotFromMe','areJidsSameUser','assertMediaContent',
  'assertNodeErrorFree','bindWaitForConnectionUpdate','bindWaitForEvent',
  'bytesToCrockford','chatModificationToAppPatch','debouncedTimeout',
  'decodeMediaRetryNode','decodePatches','decodeSyncdMutations','decodeSyncdPatch',
  'decodeSyncdSnapshot','decryptMediaRetryData','delay','delayCancellable',
  'derivePairingCodeKey','downloadContentFromMessage','downloadEncryptedContent',
  'downloadExternalBlob','downloadExternalPatch','downloadMediaMessage',
  'encodeBase64EncodedStringForUpload','encodeBigEndian','encodeNewsletterMessage',
  'encodeSyncdPatch','encodeWAMessage','encryptMediaRetryRequest','encryptedStream',
  'extensionForMediaMessage','extractImageThumb','extractMessageContent',
  'extractSyncdPatches','extractUrlFromText','fetchLatestBaileysVersion',
  'fetchLatestWaWebVersion','generateForwardMessageContent',
  'generateLinkPreviewIfRequired','generateMdTagPrefix','generateMessageID',
  'generateMessageIDV2','generateParticipantHashV2','generateProfilePicture',
  'generateRegistrationId','generateSignalPubKey','generateThumbnail',
  'generateWAMessage','generateWAMessageContent','generateWAMessageFromContent',
  'getAggregateResponsesInEventMessage','getAggregateVotesInPollMessage',
  'getAllBinaryNodeChildren','getAudioDuration','getAudioWaveform',
  'getBinaryNodeChild','getBinaryNodeChildBuffer','getBinaryNodeChildString',
  'getBinaryNodeChildUInt','getBinaryNodeChildren','getBinaryNodeMessages',
  'getCallStatusFromNode','getCodeFromWSError','getContentType','getDevice',
  'getErrorCodeFromStreamError','getHttpStream','getKeyAuthor','getMediaKeys',
  'getMediaTypeFromContentType','getPlatformId','getRawMediaUploadData',
  'getServerFromDomainType','getStatusCodeForMediaRetry','getStatusFromReceiptType',
  'getStream','getUrlFromDirectPath','getWAUploadToServer','hasNonNullishProperty',
  'hkdf','hkdfInfoKey','hmacSign','initAuthCreds','isHostedLidUser','isHostedPnUser',
  'isJidBot','isJidBroadcast','isJidGroup','isJidMetaAI','isJidNewsletter',
  'isJidStatusBroadcast','isLidUser','isPnUser','isStringNullOrEmpty',
  'isWABusinessPlatform','jidDecode','jidEncode','jidNormalizedUser',
  'makeCacheableSignalKeyStore','md5','mediaMessageSHA256B64','newLTHashState',
  'normalizeMessageContent','prepareDisappearingMessageSettingContent',
  'prepareWAMessageMedia','processSyncAction','promiseTimeout',
  'reduceBinaryNodeToDictionary','sha256','signedKeyPair','toBuffer','toNumber',
  'toReadable','transferDevice','trimUndefined','unixTimestampSeconds',
  'unpadRandomMax16','updateMessageWithEventResponse','updateMessageWithPollUpdate',
  'updateMessageWithReaction','updateMessageWithReceipt','uploadWithNodeHttp',
  'useMultiFileAuthState','writeRandomPadMax16','makeNewsletterUtils','resolveJid','resolveJids','binaryNodeToString',
];

const _constants = [
  'Browsers','BufferJSON','CALL_AUDIO_PREFIX','CALL_VIDEO_PREFIX','Curve',
  'DEFAULT_CACHE_TTLS','DEFAULT_CONNECTION_CONFIG','DEFAULT_ORIGIN',
  'DEF_CALLBACK_PREFIX','DEF_TAG_PREFIX','DICT_VERSION','DisconnectReason',
  'INITIAL_PREKEY_COUNT','KEY_BUNDLE_TYPE','MEDIA_HKDF_KEY_MAPPING','MEDIA_KEYS',
  'MEDIA_PATH_MAP','META_AI_JID','MIN_PREKEY_COUNT','MIN_UPLOAD_INTERVAL',
  'NOISE_MODE','NOISE_WA_HEADER','OFFICIAL_BIZ_JID','PHONE_CONNECTION_CB',
  'PLACEHOLDER_MAX_AGE_SECONDS','PROCESSABLE_HISTORY_TYPES','PSA_WID','proto',
  'SERVER_JID','STATUS_EXPIRY_SECONDS','STORIES_JID','S_WHATSAPP_NET','TimeMs',
  'UNAUTHORIZED_CODES','UPLOAD_TIMEOUT','URL_REGEX','WA_ADV_ACCOUNT_SIG_PREFIX',
  'WA_ADV_DEVICE_SIG_PREFIX','WA_ADV_HOSTED_ACCOUNT_SIG_PREFIX',
  'WA_ADV_HOSTED_DEVICE_SIG_PREFIX','WA_CERT_DETAILS','WA_DEFAULT_EPHEMERAL',
  'WAJIDDomains',
];

// Register fungsi sebagai async-safe wrapper
for (const name of _functions) {
  Object.defineProperty(module.exports, name, {
    value: _wrapFn(name),
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

// makeWASocket khusus — sync wrapper
Object.defineProperty(module.exports, 'makeWASocket', {
  value: _wrapMakeWASocket(),
  writable: true,
  enumerable: true,
  configurable: true,
});

// Register konstanta sebagai lazy getter
for (const name of _constants) {
  if (name in module.exports) continue;
  Object.defineProperty(module.exports, name, {
    get: _makeLazyGetter(name),
    set(v) {
      Object.defineProperty(module.exports, name, {
        value: v, writable: true, enumerable: true, configurable: true,
      });
    },
    enumerable: true,
    configurable: true,
  });
}
