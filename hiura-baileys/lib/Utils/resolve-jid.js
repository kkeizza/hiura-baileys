'use strict';
/**
 * resolve-jid.js
 * Resolve LID / participant ID → JID WhatsApp asli (@s.whatsapp.net)
 * Ported from blckrose-baileys 2.0.7 → CJS format untuk Hiura Baileys/sempak
 */

Object.defineProperty(exports, '__esModule', { value: true });

const { isJidGroup, jidNormalizedUser } = require('../WABinary/jid-utils');

/**
 * Resolve LID, mention JID, atau sender → @s.whatsapp.net
 *
 * @param {object} conn   - socket / mell
 * @param {object} m      - serialized message object
 * @param {string} [target] - JID/LID eksplisit (opsional)
 * @returns {Promise<string|null>}
 *
 * @example
 * const jid = await resolveJid(sock, m);
 * // → '628xxx@s.whatsapp.net' atau null
 *
 * @example
 * // Dari mention:
 * const jid = await resolveJid(sock, m, m.mentionedJid?.[0]);
 */
const resolveJid = async (conn, m, target) => {
    const input =
        target ||
        (m.mentionedJid && m.mentionedJid[0]) ||
        (m.quoted && (m.quoted.sender || m.quoted.participant)) ||
        m.sender ||
        m.jid;

    if (!input) return null;

    // Sudah @s.whatsapp.net → return langsung
    if (/@s\.whatsapp\.net$/.test(input)) {
        return jidNormalizedUser(input);
    }

    // Nomor saja (tanpa @) → tambah domain
    if (/^\d+$/.test(input.split('@')[0]) && !input.includes('@')) {
        return `${input}@s.whatsapp.net`;
    }

    // Bukan di grup → tidak bisa resolve via groupMetadata
    if (!m.isGroup && !isJidGroup(m.key?.remoteJid)) {
        if (/^\d+$/.test(input.split('@')[0])) {
            return `${input.split('@')[0]}@s.whatsapp.net`;
        }
        return null;
    }

    const chat = m.key?.remoteJid || m.chat;
    if (!chat) return null;

    let meta;
    try {
        meta = await conn.groupMetadata(chat);
    } catch {
        return null;
    }

    if (!meta || !Array.isArray(meta.participants)) return null;

    const inputUser = input.split('@')[0];

    // Cari di participants: cocokkan by jid, id, lid, atau user number
    const participant = meta.participants.find(p => {
        if (!p) return false;
        const pJid = p.jid || p.id || '';
        const pLid = p.lid || '';
        return (
            pJid === input ||
            pLid === input ||
            pJid.split('@')[0] === inputUser ||
            pLid.split('@')[0] === inputUser
        );
    });

    if (participant) {
        const resolved = participant.jid || participant.id;
        if (resolved && /@s\.whatsapp\.net$/.test(resolved)) {
            return jidNormalizedUser(resolved);
        }
        // Kalau resolved masih @lid tapi ada phoneNumber → pakai itu
        if (participant.phoneNumber && /@s\.whatsapp\.net$/.test(participant.phoneNumber)) {
            return jidNormalizedUser(participant.phoneNumber);
        }
    }

    return null;
};

/**
 * Resolve banyak JID/LID sekaligus
 * @param {object} conn
 * @param {object} m
 * @param {string[]} targets
 * @returns {Promise<(string|null)[]>}
 *
 * @example
 * const jids = await resolveJids(sock, m, m.mentionedJid);
 */
const resolveJids = async (conn, m, targets = []) => {
    return Promise.all(targets.map(t => resolveJid(conn, m, t)));
};

exports.resolveJid = resolveJid;
exports.resolveJids = resolveJids;
