<div align="center">

<img src="https://i.theoks.net/W8L2ki.jpg" width="100%" style="border-radius:12px;" alt="Hiura Baileys Banner"/>

[![npm](https://img.shields.io/npm/v/hiura-baileys?color=a855f7&style=for-the-badge&logo=npm)](https://npmjs.com/package/hiura-baileys)
[![stars](https://img.shields.io/github/stars/Nimzz-pemboy/hiura-baileys?color=f59e0b&style=for-the-badge&logo=github)](https://github.com/Nimzz-pemboy/hiura-baileys/stargazers)
[![forks](https://img.shields.io/github/forks/Nimzz-pemboy/hiura-baileys?color=10b981&style=for-the-badge&logo=github)](https://github.com/Nimzz-pemboy/hiura-baileys/network)
[![license](https://img.shields.io/github/license/Nimzz-pemboy/hiura-baileys?color=ec4899&style=for-the-badge)](LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D20-brightgreen?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![version](https://img.shields.io/badge/version-2.1-blue?style=for-the-badge)](https://github.com/Nimzz-pemboy/hiura-baileys)

**WhatsApp Web API for Node.js — by [Nimzz](https://github.com/Nimzz-pemboy)**

*Fork & enhancement dari blckrose-baileys dengan fitur LID, button lengkap, rich messages, album, latex, dan Signal Protocol terstabil*

</div>

---

## 🙏 Special Thanks & Credits

> Proyek ini tidak akan ada tanpa kontribusi luar biasa dari:

| | Project | Kontribusi |
|---|---------|-----------|
| 🖤 | [**blckrose-baileys**](https://www.npmjs.com/package/@blckrose/baileys) **(@Blckrose0)** | **Base utama** — LID/JID mapping, session handling, CJS wrapper |
| ⚡ | [**whiskeysockets/libsignal-node**](https://github.com/whiskeysockets/libsignal-node) | Signal Protocol (E2E enkripsi) |
| 🔥 | [**@whiskeysockets/baileys**](https://github.com/WhiskeySockets/Baileys) | Baileys core original |

**Makasih besar buat @Blckrose0 atas izin dan base yang luar biasa! 🫶**

---

## 📋 Daftar Isi

- [✨ Fitur](#-fitur)
- [📦 Install](#-install)
- [⚙️ Konfigurasi Socket](#️-konfigurasi-socket)
- [🚀 Quick Start](#-quick-start)
  - [ESM (import)](#esm-import)
  - [Pairing Code (Tanpa QR)](#pairing-code-tanpa-qr)
- [🌐 Browser & Platform](#-browser--platform)
- [💬 Kirim Pesan Dasar](#-kirim-pesan-dasar)
  - [Teks](#teks)
  - [Gambar](#gambar)
  - [Video](#video)
  - [Audio & Voice Note](#audio--voice-note)
  - [Dokumen](#dokumen)
  - [Sticker](#sticker)
  - [Lokasi](#lokasi)
  - [Kontak](#kontak)
  - [Reaction](#reaction)
  - [Poll](#poll)
- [🔘 Interactive Message (Raw)](#-interactive-message-raw)
  - [Quick Reply Button](#quick-reply-button)
  - [URL Button](#url-button)
  - [Call Button](#call-button)
  - [Copy Kode Button](#copy-kode-button)
  - [Dropdown / single_select](#dropdown--single_select)
  - [Send Location Button](#send-location-button)
  - [Address Button](#address-button)
  - [Reminder Button](#reminder-button)
  - [Flow Button](#flow-button)
  - [Mix Semua Button + Gambar](#mix-semua-button--gambar)
  - [Carousel](#carousel)
  - [External Ad Reply](#external-ad-reply)
- [🤖 Hiura Engine](#-hiura-engine)
  - [Interactive Buttons](#interactive-buttons-1)
  - [Album](#album-multi-image--multi-video)
  - [Payment Message](#payment-message)
  - [Product Message](#product-message)
  - [Event Message](#event-message)
  - [Group Story](#group-story)
  - [Status Mention](#status-mention)
- [📊 Rich Messages](#-rich-messages)
  - [sendTable](#sendtable--kirim-tabel)
  - [sendTableV2](#sendtablev2--tabel-format-unified)
  - [sendList](#sendlist--kirim-list)
  - [sendCodeBlock](#sendcodeblock--kirim-code-block)
  - [sendCodeBlockV2](#sendcodeblockv2--code-block-unified-style)
  - [sendLink](#sendlink--kirim-rich-link)
  - [sendLinkV2](#sendlinkv2--rich-link-unified-style)
  - [sendLatex](#sendlatex--formula-matematika)
  - [sendLatexImage](#sendlateximage--latex-sebagai-gambar)
  - [sendLatexInlineImage](#sendlatexinlineimage--latex-inline-dalam-teks)
  - [sendRichMessage](#sendrichmessage--gabungan-banyak-tipe)
  - [sendUnifiedResponse](#sendunifiedresponse--unified-response-meta-ai-style)
- [🏷️ JID Utils](#️-jid-utils)
- [🔍 Resolve LID → JID](#-resolve-lid--jid)
- [👥 Group Management](#-group-management)
- [📡 Event Handling](#-event-handling)
- [💾 Store (In-Memory)](#-store-in-memory)
- [🔔 Status / Story](#-status--story)
- [📰 Newsletter](#-newsletter)
- [🏘️ Community](#️-community)
- [🔐 Auth & Session](#-auth--session)
- [🛠️ Utility Functions](#️-utility-functions)
- [❓ FAQ & Troubleshooting](#-faq--troubleshooting)
- [🤝 Contributing](#-contributing)

---

## ✨ Fitur

| Fitur | Status | Keterangan |
|-------|--------|------------|
| Full LID + JID support | ✅ | Tag/mention di grup LID beneran jalan |
| All button types | ✅ | quick_reply, cta_url, cta_call, cta_copy, single_select, flow, dll |
| Dual CJS/ESM | ✅ | `require()` dan `import` sama-sama jalan |
| Auto button compat | ✅ | listMessage/buttonsMessage/templateMessage → interactiveMessage di grup |
| libsignal ori dari whiskeysockets | ✅ | Session paling stabil |
| resolveJid | ✅ | Resolve LID → @s.whatsapp.net |
| Carousel message | ✅ | Multi-card swipeable |
| AI Rich Response | ✅ | Format pesan ala Meta AI (teks, code, tabel, gambar) |
| Pairing Code | ✅ | Login tanpa QR |
| Multi-device | ✅ | Full multi-device support |
| Newsletter | ✅ | Buat & kelola newsletter WA |
| Community | ✅ | Manajemen komunitas WA |
| In-memory store | ✅ | Simpan chat history & contact di RAM |
| LRU cache LID mapping | ✅ | TTL 3 hari, auto-purge |
| Hiura Engine | ✅ | Interactive, album, payment, product, event, group story |
| Rich Messages | ✅ | sendTable, sendCodeBlock, sendLatex, sendRichMessage, dll |
| Source Maps | ✅ | Full .js.map untuk debugging |

---

## 📦 Install

```bash
npm install hiura-baileys
# atau
yarn add hiura-baileys
# atau
pnpm add hiura-baileys
```

**Peer dependencies (opsional, tapi disarankan):**

```bash
npm install sharp axios pino
```

**Requirement:**
- Node.js >= 20
- npm / yarn / pnpm

---

## ⚙️ Konfigurasi Socket

```js
import { makeWASocket, Browsers } from 'hiura-baileys';

const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: Browsers.ubuntu('Chrome'),
    connectTimeoutMs: 20000,
    keepAliveIntervalMs: 30000,
    retryRequestDelayMs: 250,
    maxMsgRetryCount: 5,
    markOnlineOnConnect: true,
    emitOwnEvents: true,
    syncFullHistory: false,
    fireInitQueries: true,
    enableAutoSessionRecreation: true,
    enableRecentMessageCache: true,
    logger: logger.child({ level: 'silent' }),
    generateHighQualityLinkPreview: false,
    linkPreviewImageThumbnailWidth: 192,
    defaultQueryTimeoutMs: 60000,
    getMessage: async (key) => {
        return store.loadMessage(key.remoteJid, key.id);
    },
    cachedGroupMetadata: async (jid) => {
        return store.groupMetadata[jid];
    },
    patchMessageBeforeSending: (msg) => msg,
    shouldIgnoreJid: (jid) => false,
    countryCode: 'ID',
});
```

---

## 🚀 Quick Start

### ESM (import)

```js
import { makeWASocket, useMultiFileAuthState, DisconnectReason } from 'hiura-baileys';
import { Boom } from '@hapi/boom';

const { state, saveCreds } = await useMultiFileAuthState('./session');

const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
});

sock.ev.on('creds.update', saveCreds);

sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
        const shouldReconnect = new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) process.exit(0);
    } else if (connection === 'open') {
        console.log('Bot online!');
    }
});

sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const m of messages) {
        if (!m.message) continue;
        const jid = m.key.remoteJid;
        const text = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
        if (text === '!ping') {
            await sock.sendMessage(jid, { text: 'Pong! 🏓' }, { quoted: m });
        }
    }
});
```

### Pairing Code (Tanpa QR)

```js
import { makeWASocket, useMultiFileAuthState } from 'hiura-baileys';
import readline from 'readline';

const { state, saveCreds } = await useMultiFileAuthState('./session');

const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
});

sock.ev.on('creds.update', saveCreds);

if (!sock.authState.creds.registered) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('Masukkan nomor WA (contoh: 6281234567890): ', async (num) => {
        rl.close();
        const code = await sock.requestPairingCode(num.trim());
        console.log('Pairing Code:', code?.match(/.{1,4}/g)?.join('-'));
    });
}
```

---

## 🌐 Browser & Platform

```js
import { Browsers } from 'hiura-baileys';

Browsers.ubuntu('Chrome')
Browsers.macOS('Safari')
Browsers.windows('Edge')
Browsers.linux('Firefox')
Browsers.android('Chrome')
Browsers.iOS('Safari')
Browsers.baileys('Baileys')
Browsers.appropriate('Chrome')

const sock = makeWASocket({
    auth: state,
    browser: Browsers.ubuntu('Chrome'),
});
```

---

## 💬 Kirim Pesan Dasar

### Teks

```js
await sock.sendMessage(jid, { text: 'Halo!' });
await sock.sendMessage(jid, { text: 'Halo!' }, { quoted: m });

await sock.sendMessage(jid, {
    text: '@628111 halo!',
    mentions: ['628111@s.whatsapp.net']
});

await sock.sendMessage(jid, {
    text: 'Pesan sudah diedit',
    edit: m.key
});

await sock.sendMessage(jid, { delete: m.key });
```

### Gambar

```js
import { readFileSync } from 'fs';

await sock.sendMessage(jid, {
    image: { url: 'https://example.com/img.jpg' },
    caption: 'Caption gambar'
});

await sock.sendMessage(jid, {
    image: readFileSync('./gambar.jpg'),
    caption: 'Dari file lokal'
});

await sock.sendMessage(jid, {
    image: { url: 'https://example.com/img.jpg' },
    viewOnce: true,
});
```

### Video

```js
await sock.sendMessage(jid, {
    video: { url: 'https://example.com/video.mp4' },
    caption: 'Caption video',
    mimetype: 'video/mp4'
});

await sock.sendMessage(jid, {
    video: { url: 'https://example.com/anim.mp4' },
    gifPlayback: true,
    caption: 'GIF keren'
});
```

### Audio & Voice Note

```js
await sock.sendMessage(jid, {
    audio: { url: 'https://example.com/audio.mp3' },
    mimetype: 'audio/mp4'
});

await sock.sendMessage(jid, {
    audio: readFileSync('./voice.ogg'),
    mimetype: 'audio/ogg; codecs=opus',
    ptt: true
});
```

### Dokumen

```js
await sock.sendMessage(jid, {
    document: { url: 'https://example.com/file.pdf' },
    mimetype: 'application/pdf',
    fileName: 'dokumen.pdf',
    caption: 'Ini dokumennya'
});
```

### Sticker

```js
await sock.sendMessage(jid, {
    sticker: readFileSync('./sticker.webp')
});
```

### Lokasi

```js
await sock.sendMessage(jid, {
    location: {
        degreesLatitude: -6.200000,
        degreesLongitude: 106.816666,
        name: 'Jakarta',
        address: 'DKI Jakarta, Indonesia'
    }
});
```

### Kontak

```js
await sock.sendMessage(jid, {
    contacts: {
        displayName: 'Nimzz',
        contacts: [{
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Nimzz\nTEL;type=CELL;waid=6281234567890:+62 812-3456-7890\nEND:VCARD`
        }]
    }
});
```

### Reaction

```js
await sock.sendMessage(jid, {
    react: { text: '🔥', key: m.key }
});

await sock.sendMessage(jid, {
    react: { text: '', key: m.key }
});
```

### Poll

```js
await sock.sendMessage(jid, {
    poll: {
        name: 'Bot favorit kamu?',
        values: ['Hiura Bot 🤖', 'Bot Lain 😅', 'Gak pakai bot'],
        selectableCount: 1
    }
});
```

---

## 🔘 Interactive Message (Raw)

### Quick Reply Button

```js
import { generateWAMessageFromContent, proto } from 'hiura-baileys';

const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({ text: 'Pilih salah satu:' }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Hiura Baileys' }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '✅ Pilihan A', id: 'id_a' }) },
                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '❌ Pilihan B', id: 'id_b' }) },
            ]
        })
    })
}, { userJid: sock.user.id });

await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

### URL Button

```js
const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({ text: 'Kunjungi GitHub kami!' }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Hiura Baileys' }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '🌐 Buka GitHub',
                        url: 'https://github.com/Nimzz-pemboy/hiura-baileys',
                        merchant_url: 'https://github.com/Nimzz-pemboy/hiura-baileys',
                        webview_interaction: false
                    })
                }
            ]
        })
    })
}, { userJid: sock.user.id });

await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

### Call Button

```js
const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({ text: 'Hubungi kami langsung!' }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Customer Service' }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
                { name: 'cta_call', buttonParamsJson: JSON.stringify({ display_text: '📞 Telepon CS', phone_number: '6281234567890' }) }
            ]
        })
    })
}, { userJid: sock.user.id });

await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

### Copy Kode Button

```js
const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({ text: '🎁 Gunakan kode promo untuk diskon 50%!' }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Berlaku sampai 31 Des 2026' }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
                { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Salin Kode: HIURA2026', copy_code: 'HIURA2026' }) }
            ]
        })
    })
}, { userJid: sock.user.id });

await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

### Dropdown / single_select

```js
const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({ text: 'Pilih menu:' }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Hiura Food 🍔' }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: '🍽️ Lihat Menu',
                        sections: [
                            {
                                title: '🍔 Makanan',
                                rows: [
                                    { title: 'Nasi Goreng Spesial', description: 'Rp 35.000', id: 'menu_nasi_goreng' },
                                    { title: 'Mie Ayam Bakso', description: 'Rp 25.000', id: 'menu_mie_ayam' },
                                ]
                            },
                            {
                                title: '🥤 Minuman',
                                rows: [
                                    { title: 'Es Teh Manis', description: 'Rp 8.000', id: 'menu_es_teh' },
                                    { title: 'Jus Alpukat', description: 'Rp 18.000', id: 'menu_jus_alpukat' },
                                ]
                            }
                        ]
                    })
                }
            ]
        })
    })
}, { userJid: sock.user.id });

await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

### Send Location Button

```js
const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({ text: 'Kirimkan lokasimu!' }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Hiura Delivery' }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [{ name: 'send_location', buttonParamsJson: '' }]
        })
    })
}, { userJid: sock.user.id });

await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

### Address Button

```js
const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({ text: 'Masukkan alamat pengiriman:' }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Hiura Shop' }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
                { name: 'address_message', buttonParamsJson: JSON.stringify({ display_text: '📍 Isi Alamat', id: 'alamat_pengiriman' }) }
            ]
        })
    })
}, { userJid: sock.user.id });

await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

### Reminder Button

```js
const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({ text: '⏰ Jangan lupa jadwal maintenance!' }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Hiura Bot' }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
                { name: 'cta_reminder', buttonParamsJson: JSON.stringify({ display_text: '🔔 Set Reminder', id: 'reminder_001' }) }
            ]
        })
    })
}, { userJid: sock.user.id });

await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

### Flow Button

```js
const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({ text: 'Isi formulir pendaftaran member:' }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Hiura Member' }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
                {
                    name: 'flow',
                    buttonParamsJson: JSON.stringify({
                        flow_message_version: '3',
                        flow_action: 'navigate',
                        flow_token: 'TOKEN_UNIK',
                        flow_id: 'ID_FLOW',
                        flow_title: 'Daftar Member',
                        flow_cta: '📝 Mulai Daftar',
                        mode: 'published'
                    })
                }
            ]
        })
    })
}, { userJid: sock.user.id });

await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

### Mix Semua Button + Gambar

```js
import { generateWAMessageFromContent, proto, prepareWAMessageMedia } from 'hiura-baileys';

const mediaContent = await prepareWAMessageMedia(
    { image: { url: 'https://example.com/banner.jpg' } },
    { upload: sock.waUploadToServer }
);

const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({ text: '🤖 Hiura Bot — Menu Utama\n\nPilih fitur:' }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Hiura Baileys by Nimzz' }),
        header: proto.Message.InteractiveMessage.Header.create({
            title: 'Selamat Datang!',
            hasMediaAttachment: true,
            ...mediaContent
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '📋 Info Bot', id: 'cmd_info' }) },
                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '⚙️ Pengaturan', id: 'cmd_setting' }) },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '🌐 GitHub', url: 'https://github.com/Nimzz-pemboy/hiura-baileys', merchant_url: 'https://github.com/Nimzz-pemboy/hiura-baileys' }) },
                { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '🎁 Kode Promo', copy_code: 'HIURA2026' }) },
                { name: 'send_location', buttonParamsJson: '' }
            ]
        })
    })
}, { userJid: sock.user.id });

await sock.relayMessage(jid, msg.message, {
    messageId: msg.key.id,
    additionalNodes: [{
        tag: 'biz',
        attrs: {},
        content: [{
            tag: 'interactive',
            attrs: { type: 'native_flow', v: '1' },
            content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }]
        }]
    }]
});
```

### Carousel

```js
import { generateWAMessageFromContent, proto, prepareWAMessageMedia } from 'hiura-baileys';

async function buatCard(imageUrl, bodyText, buttons) {
    const media = await prepareWAMessageMedia(
        { image: { url: imageUrl } },
        { upload: sock.waUploadToServer }
    );
    return proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({ text: bodyText }),
        header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: true, ...media }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons })
    });
}

const card1 = await buatCard(
    'https://example.com/ps5.jpg',
    '🎮 PlayStation 5\n💰 Rp 8.500.000',
    [{ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🛒 Beli PS5', id: 'beli_ps5' }) }]
);

const card2 = await buatCard(
    'https://example.com/xbox.jpg',
    '🎮 Xbox Series X\n💰 Rp 7.800.000',
    [{ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🛒 Beli Xbox', id: 'beli_xbox' }) }]
);

const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({ text: '🛍️ Pilih konsol gaming favoritmu!' }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Hiura Gaming Store' }),
        header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.create({ cards: [card1, card2] })
    })
}, { userJid: sock.user.id });

await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

### External Ad Reply

```js
await sock.sendMessage(jid, {
    text: '🚀 Hiura Baileys udah rilis! Cek sekarang!',
    contextInfo: {
        externalAdReply: {
            title: 'Hiura Baileys',
            body: 'WhatsApp Bot API — by Nimzz',
            mediaType: 1,
            renderLargerThumbnail: true,
            thumbnailUrl: 'https://example.com/banner.jpg',
            sourceUrl: 'https://github.com/Nimzz-pemboy/hiura-baileys'
        }
    }
});
```

---

## 🤖 Hiura Engine

`Hiura` adalah engine untuk mengirim pesan-pesan canggih: interactive, album, payment, product, event, carousel, poll result, dan group story.

```js
import makeWASocket, { Hiura, useMultiFileAuthState } from 'hiura-baileys';

const { state, saveCreds } = await useMultiFileAuthState('./session');
const sock = makeWASocket({ auth: state });

const hiura = new Hiura(sock.waUploadToServer, sock.relayMessage, sock.config, sock);
```

### Interactive Buttons

```js
await sock.sendMessage(jid, {
    interactiveButtons: {
        body: 'Pilih menu:',
        footer: 'Hiura Bot',
        buttons: [
            { type: 'quick_reply', text: 'Opsi 1', id: 'opt_1' },
            { type: 'quick_reply', text: 'Opsi 2', id: 'opt_2' },
            { type: 'cta_url', text: 'Website', url: 'https://github.com/Nimzz-pemboy/hiura-baileys' },
        ]
    }
}, { quoted: m });
```

### Album (Multi-image / Multi-video)

```js
await sock.sendMessage(jid, {
    album: [
        { image: { url: 'https://example.com/foto1.jpg' }, caption: 'Foto 1' },
        { image: { url: 'https://example.com/foto2.jpg' }, caption: 'Foto 2' },
        { video: { url: 'https://example.com/clip.mp4' }, caption: 'Video' },
    ]
}, { quoted: m });
```

### Payment Message

```js
await sock.sendMessage(jid, {
    requestPaymentMessage: {
        amount: 50000,
        currency: 'IDR',
        from: '628111@s.whatsapp.net',
        expiry: Math.floor(Date.now() / 1000) + 86400,
        note: 'Pembayaran pesanan #001'
    }
}, { quoted: m });
```

### Product Message

```js
await sock.sendMessage(jid, {
    productMessage: {
        title: 'Nama Produk',
        description: 'Deskripsi produk keren',
        currencyCode: 'IDR',
        priceAmount1000: 50000000,
        retailerId: 'SKU-001',
        url: 'https://example.com/produk',
        productImageCount: 1,
        firstImageUrl: 'https://example.com/produk.jpg',
    }
}, { quoted: m });
```

### Event Message

```js
await sock.sendMessage(jid, {
    eventMessage: {
        name: 'Workshop Hiura Baileys',
        description: 'Belajar bikin bot WA dari nol',
        location: { name: 'Jakarta, Indonesia' },
        startTime: Math.floor(Date.now() / 1000) + 3600,
        endTime: Math.floor(Date.now() / 1000) + 7200,
        joinLink: 'https://example.com/join',
    }
}, { quoted: m });
```

### Group Story

```js
await sock.sendMessage(jid, {
    groupStatusMessage: {
        text: 'Story grup dari Hiura Bot 🚀',
    }
});
```

### Status Mention

```js
await sock.sendStatusMention(
    { text: 'Halo semua dari status!' },
    ['628111@s.whatsapp.net', '628222@s.whatsapp.net']
);
```

---

## 📊 Rich Messages

### sendTable — Kirim Tabel

```js
await sock.sendTable(
    jid,
    'Data Pengguna',
    ['Nama', 'Umur', 'Kota'],
    [
        ['Budi', '25', 'Jakarta'],
        ['Ani', '22', 'Bandung'],
        ['Raka', '30', 'Surabaya'],
    ],
    m,
    { footer: 'Total: 3 pengguna' }
);
```

### sendTableV2 — Tabel Format Unified

```js
await sock.sendTableV2(
    jid,
    {
        title: 'Laporan Bulanan',
        headers: ['Bulan', 'Pemasukan', 'Pengeluaran'],
        rows: [
            ['Januari', 'Rp 5.000.000', 'Rp 3.000.000'],
            ['Februari', 'Rp 6.500.000', 'Rp 4.200.000'],
            ['Maret', 'Rp 7.000.000', 'Rp 3.800.000'],
        ],
        footer: 'Data per Q1 2026'
    },
    m,
    {}
);
```

### sendList — Kirim List

```js
await sock.sendList(
    jid,
    'Daftar Tugas Hari Ini',
    [
        'Beli bahan makanan',
        'Meeting jam 10 pagi',
        'Deploy update bot',
        'Review PR dari tim',
    ],
    m,
    {}
);
```

### sendCodeBlock — Kirim Code Block

Mendukung: `javascript`, `typescript`, `python`, `go`, `lua`, `bash`

```js
await sock.sendCodeBlock(
    jid,
    {
        language: 'javascript',
        code: `const greet = (name) => {
    return \`Halo, \${name}!\`;
};

console.log(greet('Nimzz'));`
    },
    m
);
```

### sendCodeBlockV2 — Code Block Unified Style

```js
await sock.sendCodeBlockV2(
    jid,
    {
        language: 'typescript',
        title: 'Contoh TypeScript',
        code: `interface User {
    name: string;
    age: number;
}

const user: User = { name: 'Nimzz', age: 20 };`
    },
    m
);
```

### sendLink — Kirim Rich Link

```js
await sock.sendLink(
    jid,
    'Cek repo Hiura Baileys!',
    [
        {
            url: 'https://github.com/Nimzz-pemboy/hiura-baileys',
            title: 'hiura-baileys',
            description: 'WhatsApp Web API for Node.js',
        }
    ],
    m,
    {}
);
```

### sendLinkV2 — Rich Link Unified Style

```js
await sock.sendLinkV2(
    jid,
    'Referensi lengkap:',
    [
        {
            url: 'https://github.com/Nimzz-pemboy/hiura-baileys',
            title: 'Hiura Baileys',
            description: 'Official repo',
            citation: '[1]',
        },
        {
            url: 'https://npmjs.com/package/hiura-baileys',
            title: 'NPM Package',
            description: 'Install via npm',
            citation: '[2]',
        }
    ],
    m,
    {}
);
```

### sendLatex — Formula Matematika

```js
await sock.sendLatex(
    jid,
    m,
    {
        formula: 'E = mc^2',
        caption: 'Rumus Einstein'
    }
);
```

### sendLatexImage — Latex sebagai Gambar

```js
import { renderLatex } from 'node-latex';

await sock.sendLatexImage(
    jid,
    m,
    {
        formula: '\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}',
        caption: 'Integral Gaussian'
    },
    renderLatex,
    sock.waUploadToServer
);
```

### sendLatexInlineImage — Latex Inline dalam Teks

```js
await sock.sendLatexInlineImage(
    jid,
    m,
    {
        text: 'Rumus luas lingkaran adalah',
        formula: 'A = \\pi r^2',
        suffix: 'dimana r adalah jari-jari.'
    },
    renderLatex,
    sock.waUploadToServer
);
```

### sendRichMessage — Gabungan Banyak Tipe

```js
await sock.sendRichMessage(
    jid,
    [
        { type: 'text', text: 'Hasil analisis kode kamu:' },
        { type: 'code', language: 'javascript', code: 'console.log("Hello World");' },
        {
            type: 'table',
            title: 'Performa',
            headers: ['Metric', 'Value'],
            rows: [
                ['Execution time', '12ms'],
                ['Memory usage', '4.2MB'],
            ]
        },
        { type: 'text', text: 'Kode sudah optimal!' }
    ],
    m,
    {}
);
```

### sendUnifiedResponse — Unified Response (Meta AI Style)

```js
const captured = sock.captureUnifiedResponse([
    { type: 'text', content: 'Ini hasilnya:' },
    { type: 'code', language: 'python', content: 'print("done")' },
]);

await sock.sendUnifiedResponse(jid, m, captured);
```

---

## 🏷️ JID Utils

```js
import {
    jidNormalizedUser, jidDecode, jidEncode,
    lidToJid, normalizeMentionJid,
    isPnUser, isLidUser, isJidGroup,
    isJidBroadcast, isJidNewsletter, areJidsSameUser
} from 'hiura-baileys';

jidNormalizedUser('628111@s.whatsapp.net:0')  // → '628111@s.whatsapp.net'
jidDecode('628111@s.whatsapp.net')             // → { user: '628111', server: 's.whatsapp.net' }
jidEncode('628111', 's.whatsapp.net')          // → '628111@s.whatsapp.net'
lidToJid('628111@lid')                         // → '628111@s.whatsapp.net'
normalizeMentionJid('628111@lid')              // → '628111@s.whatsapp.net'

isPnUser('628111@s.whatsapp.net')              // → true
isLidUser('628111@lid')                        // → true
isJidGroup('628111-1234@g.us')                 // → true
isJidBroadcast('status@broadcast')             // → true
isJidNewsletter('123@newsletter')              // → true
areJidsSameUser('628111@s.whatsapp.net', '628111@lid') // → true
```

---

## 🔍 Resolve LID → JID

```js
import { resolveJid, resolveJids } from 'hiura-baileys';

sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const m of messages) {
        if (!m.message) continue;

        const senderJid = await resolveJid(sock, m);
        console.log('Sender JID:', senderJid);

        const allMentions = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (allMentions.length > 0) {
            const resolvedJids = await resolveJids(sock, m, allMentions);
            await sock.sendMessage(m.key.remoteJid, {
                text: resolvedJids.map(j => `@${j.split('@')[0]}`).join(' ') + ' hai semua!',
                mentions: resolvedJids
            });
        }
    }
});
```

---

## 👥 Group Management

```js
const meta = await sock.groupMetadata(jid);
console.log(meta.subject, meta.participants);

await sock.groupParticipantsUpdate(jid, ['628111@s.whatsapp.net'], 'add');
await sock.groupParticipantsUpdate(jid, ['628111@s.whatsapp.net'], 'remove');
await sock.groupParticipantsUpdate(jid, ['628111@s.whatsapp.net'], 'promote');
await sock.groupParticipantsUpdate(jid, ['628111@s.whatsapp.net'], 'demote');

await sock.groupUpdateSubject(jid, 'Nama Grup Baru 🚀');
await sock.groupUpdateDescription(jid, 'Deskripsi baru');
await sock.updateProfilePicture(jid, { url: 'https://example.com/foto.jpg' });

await sock.groupSettingUpdate(jid, 'announcement');
await sock.groupSettingUpdate(jid, 'not_announcement');
await sock.groupSettingUpdate(jid, 'locked');
await sock.groupSettingUpdate(jid, 'unlocked');

const code = await sock.groupInviteCode(jid);
console.log(`https://chat.whatsapp.com/${code}`);

await sock.groupAcceptInvite('AbCdEfGhIjKlMn');
await sock.groupLeave(jid);

const { id: newGroupId } = await sock.groupCreate('Nama Grup Baru', ['628111@s.whatsapp.net']);
console.log('Grup baru:', newGroupId);
```

---

## 📡 Event Handling

```js
sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {});
sock.ev.on('creds.update', saveCreds);

sock.ev.on('messages.upsert', ({ messages, type }) => {});
sock.ev.on('messages.update', (updates) => {});
sock.ev.on('messages.delete', (item) => {});
sock.ev.on('messages.reaction', (reactions) => {});

sock.ev.on('chats.upsert', (chats) => {});
sock.ev.on('chats.update', (updates) => {});
sock.ev.on('chats.delete', (ids) => {});

sock.ev.on('contacts.upsert', (contacts) => {});
sock.ev.on('contacts.update', (updates) => {});

sock.ev.on('groups.upsert', (groups) => {});
sock.ev.on('groups.update', (updates) => {});
sock.ev.on('group-participants.update', ({ id, participants, action }) => {});

sock.ev.on('presence.update', ({ id, presences }) => {});

sock.ev.on('call', (calls) => {
    for (const call of calls) {
        if (call.status === 'offer') sock.rejectCall(call.id, call.from);
    }
});
```

---

## 💾 Store (In-Memory)

```js
import { makeInMemoryStore, makeWASocket, useMultiFileAuthState } from 'hiura-baileys';

const store = makeInMemoryStore({});

store.readFromFile('./store.json');
setInterval(() => store.writeToFile('./store.json'), 10_000);

const { state, saveCreds } = await useMultiFileAuthState('./session');
const sock = makeWASocket({
    auth: state,
    getMessage: async (key) => {
        return store.loadMessage(key.remoteJid, key.id)?.message;
    },
    cachedGroupMetadata: async (jid) => store.groupMetadata[jid]
});

store.bind(sock.ev);
```

---

## 🔔 Status / Story

```js
await sock.sendMessage('status@broadcast', { text: 'Halo semua! 🚀' });
await sock.sendMessage('status@broadcast', {
    image: { url: 'https://example.com/story.jpg' },
    caption: 'Caption story',
});
await sock.sendMessage('status@broadcast', {
    text: 'Status khusus!',
    statusJidList: ['628111@s.whatsapp.net']
});
```

---

## 📰 Newsletter

```js
const info = await sock.getNewsletterInfo('123456789@newsletter');
await sock.followNewsletter('123456789@newsletter');
await sock.unfollowNewsletter('123456789@newsletter');

const newNL = await sock.createNewsletter({
    name: 'Hiura Updates',
    description: 'Update terbaru dari Hiura Baileys',
});
console.log('Newsletter ID:', newNL.id);

await sock.sendMessage('123456789@newsletter', { text: 'Post terbaru! 📢' });
await sock.muteNewsletter('123456789@newsletter', true);
```

---

## 🏘️ Community

```js
const community = await sock.groupCreate('Komunitas Hiura', [], { isCommunity: true });
await sock.groupLinkCommunity(communityJid, groupJid);
await sock.groupUnlinkCommunity(communityJid, groupJid);
await sock.groupParticipantsUpdate(communityJid, ['628111@s.whatsapp.net'], 'add');
```

---

## 🔐 Auth & Session

```js
import { useMultiFileAuthState, makeCacheableSignalKeyStore } from 'hiura-baileys';
import pino from 'pino';

const logger = pino({ level: 'silent' });
const { state, saveCreds } = await useMultiFileAuthState('./session');

const sock = makeWASocket({
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger)
    }
});

sock.ev.on('creds.update', saveCreds);

console.log('Sudah registrasi:', sock.authState.creds.registered);
console.log('Nomor WA:', sock.authState.creds.me?.id);

await sock.logout();
```

---

## 🛠️ Utility Functions

```js
import {
    downloadMediaMessage, getContentType,
    generateWAMessageID, unixTimestampSeconds,
    delay, toBuffer, getDevice
} from 'hiura-baileys';

sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const m of messages) {
        const type = getContentType(m.message);

        if (type === 'imageMessage') {
            const buffer = await downloadMediaMessage(m, 'buffer', {}, {
                logger: console,
                reuploadRequest: sock.updateMediaMessage
            });
            writeFileSync(`./media/${m.key.id}.jpg`, buffer);
        }
    }
});

await delay(2000);
const now = unixTimestampSeconds();
const device = getDevice('628111@s.whatsapp.net:5');

await sock.presenceSubscribe(jid);
await sock.sendPresenceUpdate('composing', jid);
await sock.sendPresenceUpdate('paused', jid);

const url = await sock.profilePictureUrl(jid, 'image');
await sock.updateProfilePicture(sock.user.id, { url: 'https://example.com/foto.jpg' });
await sock.updateProfileName('Hiura Bot 🤖');
await sock.updateProfileStatus('Powered by Hiura Baileys');
await sock.readMessages([m.key]);

await sock.chatModify({ archive: true }, jid);
await sock.chatModify({ pin: true }, jid);
await sock.chatModify({ mute: Date.now() + 8 * 60 * 60 * 1000 }, jid);
```

---

## ❓ FAQ & Troubleshooting

### Button tidak muncul di grup

Pakai `relayMessage` dengan `additionalNodes`:

```js
await sock.relayMessage(jid, msg.message, {
    messageId: msg.key.id,
    additionalNodes: [{
        tag: 'biz',
        attrs: {},
        content: [{
            tag: 'interactive',
            attrs: { type: 'native_flow', v: '1' },
            content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }]
        }]
    }]
});
```

### LID mention tidak jalan di grup

```js
const jid = await resolveJid(sock, m, mentionedLid);
await sock.sendMessage(groupJid, {
    text: `@${jid.split('@')[0]} hai!`,
    mentions: [jid]
});
```

### Session sering disconnect

- Pastikan `saveCreds` di-bind ke `creds.update` event
- Aktifkan `enableAutoSessionRecreation: true`
- Jangan jalankan dua instance dengan session yang sama

### Session corrupt

```bash
rm -rf ./session
node index.js
```

### Bot lambat / tinggi CPU

- Set `syncFullHistory: false`
- Set `logger` ke `level: 'silent'` di production
- Gunakan `makeCacheableSignalKeyStore`

---

## ⚡ Tips Performa

```js
// Throttle pengiriman pesan (anti-ban)
async function sendSafe(jid, content, options = {}) {
    await delay(1000 + Math.random() * 2000);
    return sock.sendMessage(jid, content, options);
}

// Auto-typing indicator
async function sendWithTyping(jid, content, options = {}) {
    await sock.sendPresenceUpdate('composing', jid);
    await delay(1500 + Math.random() * 1000);
    await sock.sendPresenceUpdate('paused', jid);
    return sock.sendMessage(jid, content, options);
}

// Cek apakah nomor ada di WA
async function isOnWhatsApp(number) {
    const jid = number.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    const [result] = await sock.onWhatsApp(jid);
    return result?.exists ?? false;
}
```

---

## 📜 Changelog

### v2.1 (Latest)
- Tambah `Hiura Engine` — interactive, album, payment, product, event, group story
- Tambah `sendTable` / `sendTableV2` / `sendList`
- Tambah `sendCodeBlock` / `sendCodeBlockV2`
- Tambah `sendLink` / `sendLinkV2`
- Tambah `sendLatex` / `sendLatexImage` / `sendLatexInlineImage`
- Tambah `sendRichMessage` / `sendUnifiedResponse`
- Tambah `sendStatusMention`
- Full source maps `.js.map` untuk debugging
- Perbaiki LID-mapping store: TTL 3 hari, LRU cache, batch fetch
- Improve `resolveJid` & `resolveJids` — support bulk resolve
- Fix carousel dengan `additionalNodes` biz node
- Dual CJS/ESM stabil

### v2.0
- Base dari blckrose-baileys 2.0.7
- Full LID + JID support
- libsignal dari whiskeysockets (paling stabil)
- Interactive message semua tipe button
- Pairing Code (login tanpa QR)
- Carousel message
- External Ad Reply

---

## 📄 Lisensi

MIT License — Copyright (c) 2026 Nimzz (Nimzz-pemboy)

> ⚠️ **Disclaimer:** Proyek ini tidak berafiliasi dengan WhatsApp Inc. Penggunaan library ini sepenuhnya tanggung jawab pengguna.

---

## 🤝 Contributing

1. Fork repo ini
2. Buat branch baru: `git checkout -b fitur/nama-fitur`
3. Commit: `git commit -m 'feat: tambah fitur X'`
4. Push: `git push origin fitur/nama-fitur`
5. Buat Pull Request ke branch `main`

---

<div align="center">

**Made with ❤️ by [Nimzz](https://github.com/Nimzz-pemboy)**

*Special thanks to [@Blckrose0](https://www.npmjs.com/package/@blckrose/baileys) for the amazing base*

[![npm](https://img.shields.io/npm/v/hiura-baileys?color=a855f7&style=for-the-badge&logo=npm)](https://npmjs.com/package/hiura-baileys)
[![GitHub](https://img.shields.io/badge/GitHub-Nimzz--pemboy-181717?style=for-the-badge&logo=github)](https://github.com/Nimzz-pemboy)

</div>