import crypto from "crypto";
import { proto } from "../../WAProto/index.js";
import {
  delay,
  generateMessageID,
  generateWAMessage,
  generateWAMessageContent,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
} from "../Utils/index.js";
import {
  isJidGroup,
  isPnUser,
  jidNormalizedUser,
  normalizeMentionJid,
  STORIES_JID,
} from "../WABinary/index.js";

export class Hiura {
  constructor(waUploadToServer, relayMessageFn, config, sock) {
    this.relayMessage = relayMessageFn;
    this._waUploadToServerFn = waUploadToServer;
    this.config = config;
    this.sock = sock;
  }

  get waUploadToServer() {
    const fn = typeof this._waUploadToServerFn === 'function'
      ? this._waUploadToServerFn()
      : this._waUploadToServerFn;
    return fn || this.sock?.waUploadToServer;
  }

  detectType(content) {
    if (content.requestPaymentMessage) return "PAYMENT";
    if (content.productMessage) return "PRODUCT";
    if (content.interactiveButtons) return "INTERACTIVE_BUTTONS";
    if (content.interactiveMessage?.carouselMessage) return "CAROUSEL";
    if (content.interactiveMessage) return "INTERACTIVE";
    if (content.albumMessage || content.album) return "ALBUM";
    if (content.eventMessage) return "EVENT";
    if (content.pollResultMessage) return "POLL_RESULT";
    if (content.groupStatusMessage) return "GROUP_STORY";
    return null;
  }

  normalizeButtons(buttons) {
    if (!Array.isArray(buttons)) return [];
    return buttons.map(btn => {
      if (btn.name && typeof btn.buttonParamsJson !== 'undefined') return btn;
      if (btn.type === 'quick_reply' || btn.type === 'reply' || (btn.displayText && btn.id)) {
        return { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: btn.displayText || btn.text || btn.label || '', id: btn.id || '' }) };
      }
      if (btn.type === 'url' || btn.type === 'cta_url' || btn.url) {
        return { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: btn.displayText || btn.text || btn.label || '', url: btn.url || '', merchant_url: btn.url || '' }) };
      }
      if (btn.type === 'call' || btn.type === 'cta_call') {
        return { name: 'cta_call', buttonParamsJson: JSON.stringify({ display_text: btn.displayText || btn.text || '', phone_number: btn.phone || btn.number || '' }) };
      }
      if (btn.type === 'copy' || btn.type === 'cta_copy' || btn.copy !== undefined) {
        return { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: btn.displayText || btn.text || '', copy_code: btn.copy || btn.code || '' }) };
      }
      if (btn.type === 'list' || btn.type === 'single_select' || btn.sections) {
        return { name: 'single_select', buttonParamsJson: JSON.stringify({ title: btn.title || btn.displayText || '', sections: btn.sections || [] }) };
      }
      if (btn.type === 'flow' || btn.type === 'cta_flow') {
        return { name: 'flow', buttonParamsJson: JSON.stringify({ flow_message_version: '3', flow_action: btn.flowAction || 'navigate', flow_token: btn.flowToken || '', flow_id: btn.flowId || '', flow_title: btn.text || '', flow_cta: btn.text || '', mode: 'published' }) };
      }
      if (btn.buttonId && btn.buttonText?.displayText) {
        return { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: btn.buttonText.displayText, id: btn.buttonId }) };
      }
      return btn;
    });
  }

  async handlePayment(content, quoted) {
    const data = content.requestPaymentMessage;
    let notes = {};
    if (data.sticker?.stickerMessage) {
      notes = { stickerMessage: { ...data.sticker.stickerMessage, contextInfo: { stanzaId: quoted?.key?.id, participant: quoted?.key?.participant || content.sender, quotedMessage: quoted?.message } } };
    } else if (data.note) {
      notes = { extendedTextMessage: { text: data.note, contextInfo: { stanzaId: quoted?.key?.id, participant: quoted?.key?.participant || content.sender, quotedMessage: quoted?.message } } };
    }
    return {
      requestPaymentMessage: proto.Message.RequestPaymentMessage.fromObject({
        expiryTimestamp: data.expiry || 0,
        amount1000: data.amount || 0,
        currencyCodeIso4217: data.currency || "IDR",
        requestFrom: data.from || "0@s.whatsapp.net",
        noteMessage: notes,
        background: data.background ?? { id: "DEFAULT", placeholderArgb: 0xfff0f0f0 },
      }),
    };
  }

  async handleProduct(content, _jid, _quoted) {
    const { title, description, thumbnail, productId, retailerId, url, body = "", footer = "", buttons = [], priceAmount1000 = null, currencyCode = "IDR" } = content.productMessage;
    let productImage;
    if (Buffer.isBuffer(thumbnail)) {
      const { imageMessage } = await generateWAMessageContent({ image: thumbnail }, { upload: this.waUploadToServer });
      productImage = imageMessage;
    } else if (typeof thumbnail === "object" && thumbnail.url) {
      const { imageMessage } = await generateWAMessageContent({ image: { url: thumbnail.url } }, { upload: this.waUploadToServer });
      productImage = imageMessage;
    }
    return {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: { text: body },
            footer: { text: footer },
            header: { title, hasMediaAttachment: true, productMessage: { product: { productImage, productId, title, description, currencyCode, priceAmount1000, retailerId, url, productImageCount: 1 }, businessOwnerJid: "0@s.whatsapp.net" } },
            nativeFlowMessage: { buttons: this.normalizeButtons(buttons) },
          },
        },
      },
    };
  }

  async handleInteractive(content, _jid, _quoted) {
    const { title, footer, thumbnail, image, video, document, mimetype, fileName, jpegThumbnail, contextInfo, externalAdReply, buttons = [], nativeFlowMessage, header } = content.interactiveMessage;
    let media = null;
    if (thumbnail) {
      media = await prepareWAMessageMedia({ image: { url: thumbnail } }, { upload: this.waUploadToServer });
    } else if (image) {
      const src = typeof image === 'object' && image.url ? { image: { url: image.url } } : { image };
      media = await prepareWAMessageMedia(src, { upload: this.waUploadToServer });
    } else if (video) {
      const src = typeof video === 'object' && video.url ? { video: { url: video.url } } : { video };
      media = await prepareWAMessageMedia(src, { upload: this.waUploadToServer });
    } else if (document) {
      const docPayload = typeof document === 'object' && document.url ? { document: { url: document.url } } : { document };
      if (jpegThumbnail) docPayload.jpegThumbnail = typeof jpegThumbnail === 'object' && jpegThumbnail.url ? { url: jpegThumbnail.url } : jpegThumbnail;
      media = await prepareWAMessageMedia(docPayload, { upload: this.waUploadToServer });
      if (fileName) media.documentMessage.fileName = fileName;
      if (mimetype) media.documentMessage.mimetype = mimetype;
    }
    const interactiveMessage = {
      body: { text: title || "" },
      footer: { text: footer || "" },
    };
    if (buttons?.length > 0) {
      interactiveMessage.nativeFlowMessage = { buttons: this.normalizeButtons(buttons), ...(nativeFlowMessage || {}) };
    } else if (nativeFlowMessage) {
      interactiveMessage.nativeFlowMessage = nativeFlowMessage;
    }
    interactiveMessage.header = media
      ? { title: header || "", hasMediaAttachment: true, ...media }
      : { title: header || "", hasMediaAttachment: false };
    const finalCtx = {};
    if (contextInfo) {
      Object.assign(finalCtx, contextInfo);
      if (Array.isArray(finalCtx.mentionedJid)) finalCtx.mentionedJid = finalCtx.mentionedJid.map(normalizeMentionJid).filter(Boolean);
    }
    if (externalAdReply) {
      finalCtx.externalAdReply = { title: '', body: '', mediaType: 1, thumbnailUrl: '', mediaUrl: '', sourceUrl: '', showAdAttribution: false, renderLargerThumbnail: false, ...externalAdReply };
    }
    if (Object.keys(finalCtx).length > 0) interactiveMessage.contextInfo = finalCtx;
    return { interactiveMessage };
  }

  async handleInteractiveButtons(content, _jid, _quoted) {
    const { text = '', caption = '', title = '', subtitle = '', footer = '', interactiveButtons, hasMediaAttachment, image, video, document, mimetype, jpegThumbnail, location, product, businessOwnerJid } = content;
    const buttons = this.normalizeButtons(interactiveButtons);
    let headerContent = {};
    let mediaAttached = typeof hasMediaAttachment === 'boolean' ? hasMediaAttachment : false;

    if (image) {
      const src = typeof image === 'object' && image.url ? { image: { url: image.url } } : { image };
      const uploaded = await prepareWAMessageMedia(src, { upload: this.waUploadToServer });
      headerContent = { ...uploaded };
      mediaAttached = hasMediaAttachment ?? true;
    } else if (video) {
      const src = typeof video === 'object' && video.url ? { video: { url: video.url } } : { video };
      const uploaded = await prepareWAMessageMedia(src, { upload: this.waUploadToServer });
      headerContent = { ...uploaded };
      mediaAttached = hasMediaAttachment ?? true;
    } else if (document) {
      const docPayload = typeof document === 'object' && document.url ? { document: { url: document.url } } : { document };
      if (mimetype) docPayload.mimetype = mimetype;
      const uploaded = await prepareWAMessageMedia(docPayload, { upload: this.waUploadToServer });
      if (jpegThumbnail) {
        let thumbBuf;
        if (Buffer.isBuffer(jpegThumbnail)) thumbBuf = jpegThumbnail;
        else if (typeof jpegThumbnail === 'string' && jpegThumbnail.startsWith('http')) {
          try { const r = await fetch(jpegThumbnail); thumbBuf = Buffer.from(await r.arrayBuffer()); } catch {}
        } else if (typeof jpegThumbnail === 'string') thumbBuf = Buffer.from(jpegThumbnail, 'base64');
        if (thumbBuf) uploaded.documentMessage.jpegThumbnail = thumbBuf;
      }
      headerContent = { ...uploaded };
      mediaAttached = hasMediaAttachment ?? true;
    } else if (location) {
      let locThumb;
      if (location.jpegThumbnail) {
        if (Buffer.isBuffer(location.jpegThumbnail)) locThumb = location.jpegThumbnail;
        else if (typeof location.jpegThumbnail === 'string' && location.jpegThumbnail.startsWith('http')) {
          try { const r = await fetch(location.jpegThumbnail); locThumb = Buffer.from(await r.arrayBuffer()); } catch {}
        }
      }
      headerContent = { locationMessage: { degreesLatitude: location.degreesLatitude || 0, degreesLongitude: location.degreesLongitude || 0, name: location.name || '', address: location.address || '', ...(locThumb && { jpegThumbnail: locThumb }) } };
      mediaAttached = hasMediaAttachment ?? true;
    } else if (product) {
      let productImage;
      if (product.productImage) {
        const imgSrc = typeof product.productImage === 'object' && product.productImage.url ? { image: { url: product.productImage.url } } : { image: product.productImage };
        const uploaded = await prepareWAMessageMedia(imgSrc, { upload: this.waUploadToServer });
        productImage = uploaded.imageMessage;
      }
      headerContent = { productMessage: { product: { productImage, productId: product.productId, title: product.title, description: product.description, currencyCode: product.currencyCode || 'IDR', priceAmount1000: product.priceAmount1000, retailerId: product.retailerId, url: product.url, productImageCount: product.productImageCount || 1 }, businessOwnerJid: businessOwnerJid || '0@s.whatsapp.net' } };
      mediaAttached = hasMediaAttachment ?? true;
    }

    const bodyText = (image || video || document || location || product) ? caption : (text || caption);
    return {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2, messageSecret: crypto.randomBytes(32) },
          interactiveMessage: {
            body: { text: bodyText },
            footer: { text: footer },
            header: { title, subtitle, hasMediaAttachment: mediaAttached, ...headerContent },
            nativeFlowMessage: { buttons },
          },
        },
      },
    };
  }

  async handleCarousel(content, _jid, _quoted) {
    const { body, footer, header, carouselMessage, contextInfo } = content.interactiveMessage;
    const processedCards = [];
    for (const card of carouselMessage.cards) {
      const cardMsg = {
        body: card.body || { text: "" },
        footer: card.footer || { text: "" },
        header: { title: card.header?.title || "", hasMediaAttachment: false },
        nativeFlowMessage: card.nativeFlowMessage || { buttons: [] },
      };
      if (card.header?.imageMessage || card.header?.videoMessage || card.header?.documentMessage) {
        let headerContent = {};
        if (card.header.imageMessage) {
          const url = card.header.imageMessage.url || card.header.imageMessage;
          const src = typeof url === 'string' ? { image: { url } } : { image: url };
          const uploaded = await prepareWAMessageMedia(src, { upload: this.waUploadToServer });
          headerContent = { ...uploaded };
        } else if (card.header.videoMessage) {
          const url = card.header.videoMessage.url || card.header.videoMessage;
          const src = typeof url === 'string' ? { video: { url } } : { video: url };
          const uploaded = await prepareWAMessageMedia(src, { upload: this.waUploadToServer });
          headerContent = { ...uploaded };
        }
        cardMsg.header = { title: card.header?.title || "", hasMediaAttachment: true, ...headerContent };
      }
      processedCards.push(cardMsg);
    }
    const interactiveMsg = {
      body: body || { text: "" },
      footer: footer || { text: "" },
      header: header || { title: "", hasMediaAttachment: false },
      carouselMessage: { cards: processedCards, messageVersion: carouselMessage.messageVersion || 1, carouselCardType: carouselMessage.carouselCardType ?? 1 },
    };
    if (contextInfo) interactiveMsg.contextInfo = contextInfo;
    return {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2, messageSecret: crypto.randomBytes(32) },
          interactiveMessage: interactiveMsg,
        },
      },
    };
  }

  async handleAlbum(content, jid, quoted) {
    const array = content.albumMessage || content.album;
    const userJid = jidNormalizedUser(this.sock.authState?.creds?.me?.id || "");
    const album = await generateWAMessageFromContent(jid, {
      messageContextInfo: { messageSecret: crypto.randomBytes(32) },
      albumMessage: {
        expectedImageCount: array.filter(a => "image" in a).length,
        expectedVideoCount: array.filter(a => "video" in a).length,
      },
    }, { userJid, quoted, upload: this.waUploadToServer });
    await this.relayMessage(jid, album.message, { messageId: album.key.id });
    for (const item of array) {
      const img = await generateWAMessage(jid, item, { upload: this.waUploadToServer, userJid });
      img.message.messageContextInfo = {
        messageSecret: crypto.randomBytes(32),
        messageAssociation: { associationType: 1, parentMessageKey: album.key },
      };
      await this.relayMessage(jid, img.message, { messageId: img.key.id });
    }
    return album;
  }

  async handleEvent(content, jid, quoted) {
    const eventData = content.eventMessage;
    const msg = await generateWAMessageFromContent(jid, {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2, messageSecret: crypto.randomBytes(32) },
          eventMessage: {
            isCanceled: eventData.isCanceled || false,
            name: eventData.name,
            description: eventData.description,
            location: eventData.location || { degreesLatitude: 0, degreesLongitude: 0, name: "Location" },
            joinLink: eventData.joinLink || '',
            startTime: typeof eventData.startTime === 'string' ? parseInt(eventData.startTime) : eventData.startTime || Date.now(),
            endTime: typeof eventData.endTime === 'string' ? parseInt(eventData.endTime) : eventData.endTime || Date.now() + 3600000,
            extraGuestsAllowed: eventData.extraGuestsAllowed !== false,
          },
        },
      },
    }, { quoted, userJid: jidNormalizedUser(this.sock.authState?.creds?.me?.id || "") });
    await this.relayMessage(jid, msg.message, { messageId: msg.key.id });
    return msg;
  }

  async handlePollResult(content, jid, quoted) {
    const pollData = content.pollResultMessage;
    const msg = await generateWAMessageFromContent(jid, {
      pollResultSnapshotMessage: {
        name: pollData.name,
        pollVotes: pollData.pollVotes.map(vote => ({ optionName: vote.optionName, optionVoteCount: typeof vote.optionVoteCount === 'number' ? vote.optionVoteCount.toString() : vote.optionVoteCount })),
      },
    }, { quoted, userJid: jidNormalizedUser(this.sock.authState?.creds?.me?.id || "") });
    await this.relayMessage(jid, msg.message, { messageId: msg.key.id });
    return msg;
  }

  async handleGroupStory(content, jid, _quoted, options = {}) {
    const storyData = content.groupStatusMessage;
    let waMsgContent;
    if (storyData.message) {
      waMsgContent = storyData;
    } else {
      waMsgContent = await generateWAMessageContent(storyData, { upload: this.waUploadToServer });
    }
    const innerMsg = waMsgContent.message || waMsgContent;
    const msgKey = Object.keys(innerMsg).find(k => innerMsg[k] && typeof innerMsg[k] === 'object');
    if (msgKey) {
      innerMsg[msgKey].contextInfo = innerMsg[msgKey].contextInfo || {};
      innerMsg[msgKey].contextInfo.isGroupStatus = true;
    }
    return await this.relayMessage(jid, { groupStatusMessageV2: { message: innerMsg } }, { messageId: generateMessageID() });
  }

  async sendStatusWhatsApp(content, jids = []) {
    const userJid = jidNormalizedUser(this.sock.authState.creds.me.id);
    const allUsers = new Set([userJid]);
    for (const id of jids) {
      if (isJidGroup(id)) {
        try {
          const metadata = await this.sock.groupMetadata(id);
          metadata.participants.forEach(p => allUsers.add(jidNormalizedUser(p.id)));
        } catch (e) {
          this.config.logger?.error?.(`Error getting group metadata: ${e}`);
        }
      } else if (isPnUser(id)) {
        allUsers.add(jidNormalizedUser(id));
      }
    }
    const { getUrlInfo } = await import("../Utils/link-preview.js");
    const msg = await generateWAMessage(STORIES_JID, content, {
      logger: this.config.logger,
      userJid,
      getUrlInfo: text => getUrlInfo(text, { thumbnailWidth: this.config.linkPreviewImageThumbnailWidth, fetchOpts: { timeout: 3000 }, logger: this.config.logger }),
      upload: this.waUploadToServer,
      mediaCache: this.config.mediaCache,
      options: this.config.options,
    });
    await this.relayMessage(STORIES_JID, msg.message, {
      messageId: msg.key.id,
      statusJidList: Array.from(allUsers),
      additionalNodes: [{
        tag: "meta", attrs: {},
        content: [{ tag: "mentioned_users", attrs: {}, content: jids.map(jid => ({ tag: "to", attrs: { jid: jidNormalizedUser(jid) } })) }],
      }],
    });
    for (const id of jids) {
      try {
        const normalizedId = jidNormalizedUser(id);
        const isPrivate = isPnUser(normalizedId);
        const type = isPrivate ? "statusMentionMessage" : "groupStatusMentionMessage";
        const statusMsg = await generateWAMessageFromContent(normalizedId, {
          [type]: { message: { protocolMessage: { key: msg.key, type: 25 } } },
          messageContextInfo: { messageSecret: crypto.randomBytes(32) },
        }, { userJid });
        await this.relayMessage(normalizedId, statusMsg.message, {
          additionalNodes: [{ tag: "meta", attrs: isPrivate ? { is_status_mention: "true" } : { is_group_status_mention: "true" } }],
        });
        await delay(1500);
      } catch (e) {
        this.config.logger?.error?.(`Error sending mention to ${id}: ${e}`);
      }
    }
    return msg;
  }
}
//# sourceMappingURL=hiura.js.map
