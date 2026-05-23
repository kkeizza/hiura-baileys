// Hiura Baileys Advanced Feature Handler
// Hiura Baileys v1.7.0
// Developer: Nimzz

const WAProto = require('../../WAProto').proto;
const crypto = require('crypto');
const Utils_1 = require("../Utils");
const { normalizeMentionJid } = require('../WABinary/jid-utils');

/**
 * Normalize semua mentionedJid dalam contextInfo:
 * LID (@lid) dan nomor HP saja otomatis jadi @s.whatsapp.net
 */
function normalizeMentions(contextInfo) {
    if (!contextInfo) return contextInfo;
    if (Array.isArray(contextInfo.mentionedJid) && contextInfo.mentionedJid.length > 0) {
        contextInfo.mentionedJid = contextInfo.mentionedJid
            .map(j => normalizeMentionJid(j))
            .filter(Boolean);
    }
    return contextInfo;
}

/**
 * Normalize semua tipe button yang mungkin.
 * Support: quick_reply, url, call, copy, cta_url, cta_call, cta_copy,
 * plain_text, list, reply, dan raw object langkah-langkah WA.
 * 
 * @param {Array} buttons - array button dari user
 * @returns {Array} - array button siap kirim ke WA
 */
function normalizeButtons(buttons) {
    if (!Array.isArray(buttons)) return [];
    return buttons.map(btn => {
        // Sudah dalam format raw WA (punya field 'name' dan 'buttonParamsJson')
        if (btn.name && typeof btn.buttonParamsJson !== 'undefined') {
            return btn;
        }

        // Quick reply / reply button
        if (btn.type === 'quick_reply' || btn.type === 'reply') {
            return {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({ display_text: btn.text || btn.label || btn.title || '', id: btn.id || btn.text || '' })
            };
        }

        // URL / CTA URL button
        if (btn.type === 'url' || btn.type === 'cta_url') {
            return {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                    display_text: btn.text || btn.label || btn.title || '',
                    url: btn.url || btn.value || '',
                    merchant_url: btn.merchantUrl || btn.url || btn.value || ''
                })
            };
        }

        // Call / CTA call button
        if (btn.type === 'call' || btn.type === 'cta_call') {
            return {
                name: 'cta_call',
                buttonParamsJson: JSON.stringify({
                    display_text: btn.text || btn.label || btn.title || '',
                    phone_number: btn.phone || btn.number || btn.value || ''
                })
            };
        }

        // Copy / CTA copy button
        if (btn.type === 'copy' || btn.type === 'cta_copy') {
            return {
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                    display_text: btn.text || btn.label || btn.title || '',
                    copy_code: btn.code || btn.value || ''
                })
            };
        }

        // Reminder / address / MPM / plain_text fallback
        if (btn.type === 'plain_text') {
            return {
                name: 'plain_text',
                buttonParamsJson: JSON.stringify({ display_text: btn.text || btn.label || '' })
            };
        }

        // List / single_select
        if (btn.type === 'list' || btn.type === 'single_select') {
            return {
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                    title: btn.title || btn.text || 'Pilih',
                    sections: btn.sections || []
                })
            };
        }

        // Flow button
        if (btn.type === 'flow' || btn.type === 'cta_flow') {
            return {
                name: 'flow',
                buttonParamsJson: JSON.stringify({
                    flow_message_version: btn.flowVersion || '3',
                    flow_action: btn.flowAction || 'navigate',
                    flow_token: btn.flowToken || '',
                    flow_id: btn.flowId || '',
                    flow_title: btn.text || btn.title || '',
                    flow_cta: btn.cta || btn.text || '',
                    mode: btn.mode || 'published',
                    ...(btn.flowActionPayload ? { flow_action_payload: btn.flowActionPayload } : {})
                })
            };
        }

        // Fallback: object langsung (biarkan apa adanya)
        return btn;
    });
}

class HiuraAdvancedHandler {
    constructor(utils, waUploadToServer, relayMessageFn) {
        this.utils = utils;
        this.relayMessage = relayMessageFn
        this.waUploadToServer = waUploadToServer;
        
        this.bail = {
            generateWAMessageContent: this.utils.generateWAMessageContent || Utils_1.generateWAMessageContent,
            generateMessageID: Utils_1.generateMessageID,
            getContentType: (msg) => Object.keys(msg.message || {})[0]
        };
    }

    detectType(content) {
        if (content.requestPaymentMessage) return 'PAYMENT';
        if (content.productMessage) return 'PRODUCT';
        if (content.interactiveMessage) return 'INTERACTIVE';
        if (content.albumMessage) return 'ALBUM';
        if (content.eventMessage) return 'EVENT';
        if (content.pollResultMessage) return 'POLL_RESULT';
        if (content.groupStatusMessage) return 'GROUP_STORY';
        return null;
    }

    async handlePayment(content, quoted) {
        const data = content.requestPaymentMessage;
        let notes = {};

        if (data.sticker?.stickerMessage) {
            notes = {
                stickerMessage: {
                    ...data.sticker.stickerMessage,
                    contextInfo: {
                        stanzaId: quoted?.key?.id,
                        participant: quoted?.key?.participant || content.sender,
                        quotedMessage: quoted?.message
                    }
                }
            };
        } else if (data.note) {
            notes = {
                extendedTextMessage: {
                    text: data.note,
                    contextInfo: {
                        stanzaId: quoted?.key?.id,
                        participant: quoted?.key?.participant || content.sender,
                        quotedMessage: quoted?.message
                    }
                }
            };
        }

        return {
            requestPaymentMessage: WAProto.Message.RequestPaymentMessage.fromObject({
                expiryTimestamp: data.expiry || 0,
                amount1000: data.amount || 0,
                currencyCodeIso4217: data.currency || "IDR",
                requestFrom: data.from || "0@s.whatsapp.net",
                noteMessage: notes,
                background: data.background ?? {
                    id: "DEFAULT",
                    placeholderArgb: 0xFFF0F0F0
                }
            })
        };
    }
        
    async handleProduct(content, jid, quoted) {
        const {
            title, 
            description, 
            thumbnail,
            productId, 
            retailerId, 
            url, 
            body = "", 
            footer = "", 
            buttons = [],
            priceAmount1000 = null,
            currencyCode = "IDR"
        } = content.productMessage;

        let productImage;

        if (Buffer.isBuffer(thumbnail)) {
            const { imageMessage } = await this.utils.generateWAMessageContent(
                { image: thumbnail }, 
                { upload: this.waUploadToServer }
            );
            productImage = imageMessage;
        } else if (typeof thumbnail === 'object' && thumbnail.url) {
            const { imageMessage } = await this.utils.generateWAMessageContent(
                { image: { url: thumbnail.url }}, 
                { upload: this.waUploadToServer }
            );
            productImage = imageMessage;
        }

        return {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: body },
                        footer: { text: footer },
                        header: {
                            title,
                            hasMediaAttachment: true,
                            productMessage: {
                                product: {
                                    productImage,
                                    productId,
                                    title,
                                    description,
                                    currencyCode,
                                    priceAmount1000,
                                    retailerId,
                                    url,
                                    productImageCount: 1
                                },
                                businessOwnerJid: "0@s.whatsapp.net"
                            }
                        },
                        nativeFlowMessage: { buttons: normalizeButtons(buttons) }
                    }
                }
            }
        };
    }
    
    async handleInteractive(content, jid, quoted) {
        const {
            title,
            footer,
            thumbnail,
            image,
            video,
            document,
            mimetype,
            fileName,
            jpegThumbnail,
            contextInfo,
            externalAdReply,
            buttons = [],
            nativeFlowMessage,
            header
        } = content.interactiveMessage;

        let media = null;
        let mediaType = null;

        if (thumbnail) {
            media = await this.utils.prepareWAMessageMedia(
                { image: { url: thumbnail } },
                { upload: this.waUploadToServer }
            );
            mediaType = 'image';
        } else if (image) {
            if (typeof image === 'object' && image.url) {
                media = await this.utils.prepareWAMessageMedia(
                    { image: { url: image.url } },
                    { upload: this.waUploadToServer }
                );
            } else {
                media = await this.utils.prepareWAMessageMedia(
                    { image: image },
                    { upload: this.waUploadToServer }
                );
            }
            mediaType = 'image';
        } else if (video) {
            if (typeof video === 'object' && video.url) {
                media = await this.utils.prepareWAMessageMedia(
                    { video: { url: video.url } },
                    { upload: this.waUploadToServer }
                );
            } else {
                media = await this.utils.prepareWAMessageMedia(
                    { video: video },
                    { upload: this.waUploadToServer }
                );
            }
            mediaType = 'video';
        } else if (document) {
            let documentPayload = { 
                document: document 
            };
            if (jpegThumbnail) {
                if (typeof jpegThumbnail === 'object' && jpegThumbnail.url) {
                    documentPayload.jpegThumbnail = { url: jpegThumbnail.url };
                } else {
                    documentPayload.jpegThumbnail = jpegThumbnail;
                }
            }
            
            media = await this.utils.prepareWAMessageMedia(
                documentPayload,
                { upload: this.waUploadToServer }
            );
            if (fileName) {
                media.documentMessage.fileName = fileName;
            }
            if (mimetype) {
                media.documentMessage.mimetype = mimetype;
            }
            mediaType = 'document';
        }
        let interactiveMessage = {
            body: { text: title || "" },
            footer: { text: footer || "" }
        };
        if (buttons && buttons.length > 0) {
            interactiveMessage.nativeFlowMessage = {
                buttons: normalizeButtons(buttons)
            };
            if (nativeFlowMessage) {
                interactiveMessage.nativeFlowMessage = {
                    ...interactiveMessage.nativeFlowMessage,
                    ...nativeFlowMessage
                };
            }
        } else if (nativeFlowMessage) {
            interactiveMessage.nativeFlowMessage = nativeFlowMessage;
        }
        
        if (media) {
            interactiveMessage.header = {
                title: header || "",
                hasMediaAttachment: true,
                ...media
            };
        } else {
            interactiveMessage.header = {
                title: header || "",        
                hasMediaAttachment: false
            };
        }
        
        let finalContextInfo = {};
        if (contextInfo) {
            finalContextInfo = {
                mentionedJid: contextInfo.mentionedJid || [],
                forwardingScore: contextInfo.forwardingScore || 0,
                isForwarded: contextInfo.isForwarded || false,
                ...contextInfo
            };
            // Fix LID → JID untuk mention/tag
            normalizeMentions(finalContextInfo);
        }
        
        if (externalAdReply) {
            finalContextInfo.externalAdReply = {
                title: externalAdReply.title || "",
                body: externalAdReply.body || "",
                mediaType: externalAdReply.mediaType || 1,
                thumbnailUrl: externalAdReply.thumbnailUrl || "",
                mediaUrl: externalAdReply.mediaUrl || "",
                sourceUrl: externalAdReply.sourceUrl || "",
                showAdAttribution: externalAdReply.showAdAttribution || false,
                renderLargerThumbnail: externalAdReply.renderLargerThumbnail || false,
                ...externalAdReply
            };
        }
        
        if (Object.keys(finalContextInfo).length > 0) {
            interactiveMessage.contextInfo = finalContextInfo;
        }
        return {
            interactiveMessage: interactiveMessage
        };
    }
    
    async handleAlbum(content, jid, quoted) {
        const array = content.albumMessage;
        const album = await this.utils.generateWAMessageFromContent(jid, {
            messageContextInfo: {
                messageSecret: crypto.randomBytes(32),
            },
            albumMessage: {
                expectedImageCount: array.filter((a) => a.hasOwnProperty("image")).length,
                expectedVideoCount: array.filter((a) => a.hasOwnProperty("video")).length,
            },
        }, {
            userJid: this.utils.generateMessageID().split('@')[0] + '@s.whatsapp.net',
            quoted,
            upload: this.waUploadToServer
        });
        
        await this.relayMessage(jid, album.message, {
            messageId: album.key.id,
        });
        
        for (let content of array) {
            const img = await this.utils.generateWAMessage(jid, content, {
                upload: this.waUploadToServer,
            });
            
            img.message.messageContextInfo = {
                messageSecret: crypto.randomBytes(32),
                messageAssociation: {
                    associationType: 1,
                    parentMessageKey: album.key,
                },    
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast",
                forwardingScore: 99999,
                isForwarded: true,
                mentionedJid: [jid],
                starred: true,
                labels: ["Y", "Important"],
                isHighlighted: true,
                businessMessageForwardInfo: {
                    businessOwnerJid: jid,
                },
                dataSharingContext: {
                    showMmDisclosure: true,
                },
            };

            img.message.forwardedNewsletterMessageInfo = {
                newsletterJid: "120363421598489822@newsletter",
                serverMessageId: 1,
                newsletterName: `Hiura Baileys`,
                contentType: 1,
                timestamp: new Date().toISOString(),
                                senderName: "Hiura Baileys Handler",
                content: "Text Message",
                priority: "high",
                status: "sent",
            };
            
            img.message.disappearingMode = {
                initiator: 3,
                trigger: 4,
                initiatorDeviceJid: jid,
                initiatedByExternalService: true,
                initiatedByUserDevice: true,
                initiatedBySystem: true,      
                initiatedByServer: true,
                initiatedByAdmin: true,
                initiatedByUser: true,
                initiatedByApp: true,
                initiatedByBot: true,
                initiatedByMe: true,
            };

            await this.relayMessage(jid, img.message, {
                messageId: img.key.id,
                quoted: {
                    key: {
                        remoteJid: album.key.remoteJid,
                        id: album.key.id,
                        fromMe: true,
                        participant: this.utils.generateMessageID().split('@')[0] + '@s.whatsapp.net',
                    },
                    message: album.message,
                },
            });
        }
        return album;
    }   

    async handleEvent(content, jid, quoted) {
        const eventData = content.eventMessage;
        
        const msg = await this.utils.generateWAMessageFromContent(jid, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2,
                        messageSecret: crypto.randomBytes(32),
                        supportPayload: JSON.stringify({
                            version: 2,
                            is_ai_message: true,
                            should_show_system_message: true,
                            ticket_id: crypto.randomBytes(16).toString('hex')
                        })
                    },
                    eventMessage: {
                        contextInfo: {
                            mentionedJid: [jid],
                            participant: jid,
                            remoteJid: "status@broadcast",
                            forwardedNewsletterMessageInfo: {
                                 newsletterName: "Hiura Baileys",
                                 newsletterJid: "120363421598489822@newsletter",
                                serverMessageId: 1
                            }
                        },
                        isCanceled: eventData.isCanceled || false,
                        name: eventData.name,
                        description: eventData.description,
                        location: eventData.location || {
                            degreesLatitude: 0,
                            degreesLongitude: 0,
                            name: "Location"
                        },
                        joinLink: eventData.joinLink || '',
                        startTime: typeof eventData.startTime === 'string' ? parseInt(eventData.startTime) : eventData.startTime || Date.now(),
                        endTime: typeof eventData.endTime === 'string' ? parseInt(eventData.endTime) : eventData.endTime || Date.now() + 3600000,
                        extraGuestsAllowed: eventData.extraGuestsAllowed !== false
                    }
                }
            }
        }, { quoted });
        
        await this.relayMessage(jid, msg.message, {
            messageId: msg.key.id
        });
        return msg;
    }
    
    async handlePollResult(content, jid, quoted) {
        const pollData = content.pollResultMessage;
    
        const msg = await this.utils.generateWAMessageFromContent(jid, {
            pollResultSnapshotMessage: {
                name: pollData.name,
                pollVotes: pollData.pollVotes.map(vote => ({
                    optionName: vote.optionName,
                    optionVoteCount: typeof vote.optionVoteCount === 'number' 
                    ? vote.optionVoteCount.toString() 
                    : vote.optionVoteCount
                }))
            }
        }, {
            userJid: this.utils.generateMessageID().split('@')[0] + '@s.whatsapp.net',
            quoted
        });
    
        await this.relayMessage(jid, msg.message, {
            messageId: msg.key.id
        });

        return msg;
    }

    async handleGroupStory(content, jid, quoted) {
        const storyData = content.groupStatusMessage;
        let waMsgContent;
        
        if (storyData.message) {
            waMsgContent = storyData;
        } else {
            if (typeof this.bail?.generateWAMessageContent === "function") {
                waMsgContent = await this.bail.generateWAMessageContent(storyData, {
                    upload: this.waUploadToServer
                });
            } else if (typeof this.utils?.generateWAMessageContent === "function") {
                waMsgContent = await this.utils.generateWAMessageContent(storyData, {
                    upload: this.waUploadToServer
                });
            } else if (typeof this.utils?.prepareMessageContent === "function") {
                waMsgContent = await this.utils.prepareMessageContent(storyData, {
                    upload: this.waUploadToServer
                });
            } else {
                waMsgContent = await Utils_1.generateWAMessageContent(storyData, {
                    upload: this.waUploadToServer
                });
            }
        }

        let msg = {
            message: {
                groupStatusMessageV2: {
                    message: waMsgContent.message || waMsgContent
                }
            }
        };

        return await this.relayMessage(jid, msg.message, {
            messageId: this.bail.generateMessageID()
        });
    }
}

module.exports = HiuraAdvancedHandler;
