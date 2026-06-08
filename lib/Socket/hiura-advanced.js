import { proto } from "../../WAProto/index.js";
import crypto from "crypto";
import { generateWAMessage, generateWAMessageContent, generateWAMessageFromContent, generateMessageID, prepareWAMessageMedia } from "../Utils/index.js";
import { normalizeMentionJid } from "../WABinary/jid-utils.js";

function normalizeMentions(contextInfo) {
  if (!contextInfo) return contextInfo;
  if (Array.isArray(contextInfo.mentionedJid) && contextInfo.mentionedJid.length > 0) {
    contextInfo.mentionedJid = contextInfo.mentionedJid.map(j => normalizeMentionJid(j)).filter(Boolean);
  }
  return contextInfo;
}

function normalizeButtons(buttons) {
  if (!Array.isArray(buttons)) return [];
  return buttons.map(btn => {
    if (btn.name && typeof btn.buttonParamsJson !== 'undefined') return btn;
    if (btn.type === 'quick_reply' || btn.type === 'reply') return { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: btn.text || btn.label || btn.title || '', id: btn.id || btn.text || '' }) };
    if (btn.type === 'url' || btn.type === 'cta_url') return { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: btn.text || btn.label || btn.title || '', url: btn.url || btn.value || '', merchant_url: btn.merchantUrl || btn.url || btn.value || '' }) };
    if (btn.type === 'call' || btn.type === 'cta_call') return { name: 'cta_call', buttonParamsJson: JSON.stringify({ display_text: btn.text || btn.label || btn.title || '', phone_number: btn.phone || btn.number || btn.value || '' }) };
    if (btn.type === 'copy' || btn.type === 'cta_copy') return { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: btn.text || btn.label || btn.title || '', copy_code: btn.code || btn.value || '' }) };
    if (btn.type === 'plain_text') return { name: 'plain_text', buttonParamsJson: JSON.stringify({ display_text: btn.text || btn.label || '' }) };
    if (btn.type === 'list' || btn.type === 'single_select') return { name: 'single_select', buttonParamsJson: JSON.stringify({ title: btn.title || btn.text || 'Pilih', sections: btn.sections || [] }) };
    if (btn.type === 'flow' || btn.type === 'cta_flow') return { name: 'flow', buttonParamsJson: JSON.stringify({ flow_message_version: btn.flowVersion || '3', flow_action: btn.flowAction || 'navigate', flow_token: btn.flowToken || '', flow_id: btn.flowId || '', flow_title: btn.text || btn.title || '', flow_cta: btn.cta || btn.text || '', mode: btn.mode || 'published' }) };
    return btn;
  });
}

export class HiuraAdvancedHandler {
  constructor(utils, waUploadToServer, relayMessageFn) {
    this.utils = utils;
    this.relayMessage = relayMessageFn;
    this.waUploadToServer = waUploadToServer;
  }
}

export { normalizeButtons, normalizeMentions };
//# sourceMappingURL=hiura-advanced.js.map
