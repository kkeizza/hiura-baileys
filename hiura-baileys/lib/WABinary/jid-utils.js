"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jidNormalizedUser = exports.isJidNewsLetter = exports.isJidStatusBroadcast = exports.isJidGroup = exports.isJidBroadcast = exports.isLidUser = exports.isJidUser = exports.areJidsSameUser = exports.jidDecode = exports.jidEncode = exports.STORIES_JID = exports.PSA_WID = exports.SERVER_JID = exports.OFFICIAL_BIZ_JID = exports.S_WHATSAPP_NET = exports.normalizeMentionJid = exports.lidToJid = exports.transferDevice = exports.isJidBot = exports.isHostedLidUser = exports.isHostedPnUser = exports.isPnUser = exports.isJidMetaAI = exports.getServerFromDomainType = exports.WAJIDDomains = exports.META_AI_JID = void 0;
exports.S_WHATSAPP_NET = '@s.whatsapp.net';
exports.OFFICIAL_BIZ_JID = '16505361212@c.us';
exports.SERVER_JID = 'server@c.us';
exports.PSA_WID = '0@c.us';
exports.STORIES_JID = 'status@broadcast';
exports.META_AI_JID = '13135550002@c.us';

// WAJIDDomains enum (dari blckrose 2.0.7)
var WAJIDDomains;
(function (WAJIDDomains) {
    WAJIDDomains[WAJIDDomains["WHATSAPP"] = 0] = "WHATSAPP";
    WAJIDDomains[WAJIDDomains["LID"] = 1] = "LID";
    WAJIDDomains[WAJIDDomains["HOSTED"] = 128] = "HOSTED";
    WAJIDDomains[WAJIDDomains["HOSTED_LID"] = 129] = "HOSTED_LID";
})(WAJIDDomains = exports.WAJIDDomains || (exports.WAJIDDomains = {}));

const getServerFromDomainType = (initialServer, domainType) => {
    switch (domainType) {
        case WAJIDDomains.LID: return 'lid';
        case WAJIDDomains.HOSTED: return 'hosted';
        case WAJIDDomains.HOSTED_LID: return 'hosted.lid';
        case WAJIDDomains.WHATSAPP:
        default: return initialServer;
    }
};
exports.getServerFromDomainType = getServerFromDomainType;
const jidEncode = (user, server, device, agent) => {
    return `${user || ''}${!!agent ? `_${agent}` : ''}${!!device ? `:${device}` : ''}@${server}`;
};
exports.jidEncode = jidEncode;
const jidDecode = (jid) => {
    const sepIdx = typeof jid === 'string' ? jid.indexOf('@') : -1;
    if (sepIdx < 0) {
        return undefined;
    }
    const server = jid.slice(sepIdx + 1);
    const userCombined = jid.slice(0, sepIdx);
    const [userAgent, device] = userCombined.split(':');
    const [user, agent] = userAgent.split('_');
    // Full domain type support (blckrose 2.0.7)
    let domainType = WAJIDDomains.WHATSAPP;
    if (server === 'lid') {
        domainType = WAJIDDomains.LID;
    } else if (server === 'hosted') {
        domainType = WAJIDDomains.HOSTED;
    } else if (server === 'hosted.lid') {
        domainType = WAJIDDomains.HOSTED_LID;
    } else if (agent) {
        domainType = parseInt(agent);
    }
    return {
        server,
        user,
        domainType,
        device: device ? +device : undefined
    };
};
exports.jidDecode = jidDecode;
/** is the jid a user */
const areJidsSameUser = (jid1, jid2) => {
    var _a, _b;
    return (((_a = (0, exports.jidDecode)(jid1)) === null || _a === void 0 ? void 0 : _a.user) === ((_b = (0, exports.jidDecode)(jid2)) === null || _b === void 0 ? void 0 : _b.user));
};
exports.areJidsSameUser = areJidsSameUser;
/** is the jid Meta AI (@bot) */
const isJidMetaAI = (jid) => (jid === null || jid === void 0 ? void 0 : jid.endsWith('@bot'));
exports.isJidMetaAI = isJidMetaAI;
/** is the jid a PN user (alias isJidUser) */
const isPnUser = (jid) => (jid === null || jid === void 0 ? void 0 : jid.endsWith('@s.whatsapp.net'));
exports.isPnUser = isPnUser;
/** is the jid a user */
const isJidUser = (jid) => (jid === null || jid === void 0 ? void 0 : jid.endsWith('@s.whatsapp.net'));
exports.isJidUser = isJidUser;
/** is the jid a LID */
const isLidUser = (jid) => (jid === null || jid === void 0 ? void 0 : jid.endsWith('@lid'));
exports.isLidUser = isLidUser;
/** is the jid a broadcast */
const isJidBroadcast = (jid) => (jid === null || jid === void 0 ? void 0 : jid.endsWith('@broadcast'));
exports.isJidBroadcast = isJidBroadcast;
/** is the jid a group */
const isJidGroup = (jid) => (jid === null || jid === void 0 ? void 0 : jid.endsWith('@g.us'));
exports.isJidGroup = isJidGroup;
/** is the jid the status broadcast */
const isJidStatusBroadcast = (jid) => jid === 'status@broadcast';
exports.isJidStatusBroadcast = isJidStatusBroadcast;
/** is the jid a newsletter */
const isJidNewsLetter = (jid) => (jid === null || jid === void 0 ? void 0 : jid.endsWith('newsletter'));
exports.isJidNewsLetter = isJidNewsLetter;
/** is the jid a hosted PN */
const isHostedPnUser = (jid) => (jid === null || jid === void 0 ? void 0 : jid.endsWith('@hosted'));
exports.isHostedPnUser = isHostedPnUser;
/** is the jid a hosted LID */
const isHostedLidUser = (jid) => (jid === null || jid === void 0 ? void 0 : jid.endsWith('@hosted.lid'));
exports.isHostedLidUser = isHostedLidUser;
/** is the jid a WA bot */
const botRegexp = /^1313555\d{4}$|^131655500\d{2}$/;
const isJidBot = (jid) => jid && botRegexp.test(jid.split('@')[0]) && jid.endsWith('@c.us');
exports.isJidBot = isJidBot;
const jidNormalizedUser = (jid) => {
    const result = (0, exports.jidDecode)(jid);
    if (!result) {
        return '';
    }
    const { user, server } = result;
    return (0, exports.jidEncode)(user, server === 'c.us' ? 's.whatsapp.net' : server);
};
exports.jidNormalizedUser = jidNormalizedUser;

/**
 * Convert a LID JID (@lid) to a standard WhatsApp JID (@s.whatsapp.net).
 * Useful for mention/tag di grup yang addressingMode-nya 'lid'.
 * Kalau bukan LID, dikembalikan apa adanya.
 */
const lidToJid = (jid) => {
    if (!jid) return jid;
    const decoded = (0, exports.jidDecode)(jid);
    if (!decoded) return jid;
    if (decoded.server === 'lid') {
        return (0, exports.jidEncode)(decoded.user, 's.whatsapp.net');
    }
    return jid;
};
exports.lidToJid = lidToJid;

/**
 * Normalize mention JID: pastikan semua JID di array mentionedJid
 * menggunakan @s.whatsapp.net (bukan @lid), supaya tag beneran jalan.
 * Juga support input berupa nomor HP saja (otomatis ditambah @s.whatsapp.net).
 */
const normalizeMentionJid = (jidOrNum) => {
    if (!jidOrNum) return null;
    const str = String(jidOrNum).trim();
    // Kalau tidak ada '@', anggap sebagai nomor HP saja
    if (!str.includes('@')) {
        const clean = str.replace(/[^0-9]/g, '');
        return clean ? `${clean}@s.whatsapp.net` : null;
    }
    // Kalau @lid → konversi ke @s.whatsapp.net
    if (str.endsWith('@lid')) {
        return (0, exports.lidToJid)(str);
    }
    // Kalau @c.us → konversi ke @s.whatsapp.net
    if (str.endsWith('@c.us')) {
        const decoded = (0, exports.jidDecode)(str);
        return decoded ? (0, exports.jidEncode)(decoded.user, 's.whatsapp.net') : str;
    }
    return str;
};
exports.normalizeMentionJid = normalizeMentionJid;

/**
 * Transfer device dari satu JID ke JID lain (dari blckrose)
 */
const transferDevice = (fromJid, toJid) => {
    const fromDecoded = (0, exports.jidDecode)(fromJid);
    const deviceId = (fromDecoded === null || fromDecoded === void 0 ? void 0 : fromDecoded.device) || 0;
    const { server, user } = (0, exports.jidDecode)(toJid);
    return (0, exports.jidEncode)(user, server, deviceId);
};
exports.transferDevice = transferDevice;
