// hiura-baileys — ESM wrapper
// CJS source di-wrap via createRequire supaya dual module support
// require() → lib/index.js  |  import → esm/index.mjs

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const hiura = require('../lib/index.js');

// Re-export semua exports dari CJS
export const {
    // Auth
    useMultiFileAuthState,
    useSingleFileAuthState,
    makeCacheableSignalKeyStore,
    // WABinary / JID utils
    jidEncode,
    jidDecode,
    jidNormalizedUser,
    areJidsSameUser,
    isJidUser,
    isJidGroup,
    isJidBroadcast,
    isJidStatusBroadcast,
    isJidNewsLetter,
    isLidUser,
    isPnUser,
    isHostedPnUser,
    isHostedLidUser,
    isJidMetaAI,
    isJidBot,
    WAJIDDomains,
    getServerFromDomainType,
    lidToJid,
    normalizeMentionJid,
    transferDevice,
    S_WHATSAPP_NET,
    STORIES_JID,
    // Utils
    resolveJid,
    resolveJids,
    generateWAMessageFromContent,
    generateWAMessage,
    prepareWAMessageMedia,
    downloadContentFromMessage,
    downloadMediaMessage,
    getContentType,
    normalizeMessageContent,
    extractMessageContent,
    getDevice,
    makeInMemoryStore,
    // Socket / makeWASocket
    makeWASocket,
    default: makeWASocket,
} = hiura;

export default hiura.default || hiura;
