<div align="center">

<img src="https://i.theoks.net/W8L2ki.jpg" width="100%" style="border-radius:12px;" alt="Hiura Baileys Banner"/>

[![npm](https://img.shields.io/npm/v/hiura-baileys?color=a855f7&style=for-the-badge&logo=npm)](https://npmjs.com/package/hiura-baileys)
[![stars](https://img.shields.io/github/stars/Nimzz-pemboy/hiura-baileys?color=f59e0b&style=for-the-badge&logo=github)](https://github.com/Nimzz-pemboy/hiura-baileys/stargazers)
[![forks](https://img.shields.io/github/forks/Nimzz-pemboy/hiura-baileys?color=10b981&style=for-the-badge&logo=github)](https://github.com/Nimzz-pemboy/hiura-baileys/network)
[![license](https://img.shields.io/github/license/Nimzz-pemboy/hiura-baileys?color=ec4899&style=for-the-badge)](LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D20-brightgreen?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![version](https://img.shields.io/badge/version-1.4.0-blue?style=for-the-badge)](https://github.com/Nimzz-pemboy/hiura-baileys)

**WhatsApp Web API for Node.js — by [Nimzz](https://github.com/Nimzz-pemboy)**

*Fork & enhancement dari blckrose-baileys dengan fitur LID, button lengkap, rich messages, album, latex, ephemeral auto-detect, dan Signal Protocol terstabil*

</div>

---

## 🙏 Credits

| | Project | Kontribusi |
|---|---------|-----------|
| 🖤 | [**blckrose-baileys**](https://www.npmjs.com/package/@blckrose/baileys) | Base utama — LID/JID mapping, session, CJS wrapper |
| ⚡ | [**whiskeysockets/libsignal-node**](https://github.com/whiskeysockets/libsignal-node) | Signal Protocol (E2E encryption) |
| 🔥 | [**@whiskeysockets/baileys**](https://github.com/WhiskeySockets/Baileys) | Baileys core original |
| 🌸 | [**itsukichan/baileys**](https://github.com/Itsukichann/Baileys) | Referensi stickerPack, orderMessage, ptv, ephemeral |

---

## 📋 Daftar Isi

- [✨ Fitur](#-fitur)
- [📦 Install](#-install)
- [🚀 Connection — index.js](#-connection--indexjs)
  - [QR Code](#qr-code)
  - [Pairing Code](#pairing-code)
  - [Default Pairing NIMZ1234](#default-pairing-nimz1234)
- [⚙️ Konfigurasi Socket](#️-konfigurasi-socket)
- [💬 Pesan Dasar](#-pesan-dasar)
- [🔘 Interactive Message](#-interactive-message)
- [🎠 Carousel](#-carousel)
- [🤖 Hiura Engine](#-hiura-engine)
- [📊 Rich Messages](#-rich-messages)
- [🏷️ JID Utils](#️-jid-utils)
- [👥 Group Management](#-group-management)
- [📡 Events](#-events)
- [🔔 Status / Story](#-status--story)
- [📰 Newsletter](#-newsletter)
- [💾 Store](#-store)
- [🔐 Auth & Session](#-auth--session)
- [🛠️ Utilities](#️-utilities)
- [❓ FAQ](#-faq)
- [📜 Changelog](#-changelog)

---

## ✨ Fitur

| Fitur | Status | Keterangan |
|-------|--------|------------|
| Full LID + JID support | ✅ | Tag/mention di grup LID beneran jalan |
| All button types | ✅ | quick_reply, cta_url, cta_call, cta_copy, single_select, flow, send_location, dll |
| Dual CJS/ESM | ✅ | `require()` dan `import` sama-sama jalan |
| Auto button compat | ✅ | buttonsMessage/templateMessage → interactiveMessage di grup |
| libsignal ori | ✅ | Session paling stabil |
| normalizeMentionJid | ✅ | Auto fix LID/@lid → @s.whatsapp.net |
| resolveJid / resolveJids | ✅ | Resolve LID bulk |
| Carousel message | ✅ | Multi-card swipeable dengan gambar/video |
| Album message | ✅ | Multi-foto + multi-video sekaligus |
| AI Rich Response | ✅ | Format ala Meta AI: teks, code, tabel, gambar |
| Pairing Code | ✅ | Login tanpa QR, default NIMZ1234 |
| Multi-device | ✅ | Full support |
| Newsletter | ✅ | Buat & kelola newsletter WA |
| Community | ✅ | Manajemen komunitas WA |
| In-memory store | ✅ | Simpan chat history & contact di RAM |
| Hiura Engine | ✅ | Interactive, album, payment, product, event, group story |
| Rich Messages | ✅ | sendTable, sendCodeBlock, sendLatex, sendRichMessage, dll |
| stickerPackMessage | ✅ | Kirim sticker pack custom |
| ptvMessage | ✅ | Video circle (PTV) |
| orderMessage | ✅ | Pesan order WA |
| keepInChatMessage | ✅ | Keep/bookmark pesan |
| paymentInviteMessage | ✅ | Undangan bayar |
| scheduledCallCreationMessage | ✅ | Jadwal panggilan |
| groupInviteMessage | ✅ | Undang ke grup dengan thumbnail |
| adminInviteMessage | ✅ | Undang admin newsletter |
| shopMessage | ✅ | Pesan toko storefront |
| collectionMessage | ✅ | Koleksi produk |
| getEphemeralGroup | ✅ | Fetch durasi ephemeral grup |
| Auto ephemeral detect | ✅ | sendMessage otomatis ikut ephemeral grup |
| Source Maps | ✅ | Full `.js.map` untuk debugging |

---

## 📦 Install

```bash
npm install hiura-baileys
# atau
yarn add hiura-baileys
# atau dari file lokal
npm install ./hiura-baileys-1.4.0.tgz
```

**Peer dependencies (opsional tapi disarankan):**

```bash
npm install sharp axios pino
```

**Requirement:**
- Node.js >= 20
- npm / yarn / pnpm

---

## 🚀 Connection — index.js

### QR Code

```js
import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    makeCacheableSignalKeyStore,
    makeInMemoryStore,
    fetchLatestBaileysVersion
} from 'hiura-baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import { readFileSync } from 'fs';

const logger = pino({ level: 'silent' });
const store = makeInMemoryStore({});

store.readFromFile('./data/store.json');
setInterval(() => store.writeToFile('./data/store.json'), 10_000);

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./sessions');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger)
        },
        printQRInTerminal: true,
        logger,
        browser: ['NimzzBot', 'Chrome', '1.0.0'],
        connectTimeoutMs: 20000,
        keepAliveIntervalMs: 30000,
        markOnlineOnConnect: true,
        syncFullHistory: false,
        generateHighQualityLinkPreview: false,
        getMessage: async (key) => store.loadMessage(key.remoteJid, key.id)?.message,
        cachedGroupMetadata: async (jid) => store.groupMetadata[jid],
    });

    store.bind(sock.ev);
    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            const shouldReconnect = new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
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
            if (text === '.ping') {
                await sock.sendMessage(jid, { text: 'Pong! 🏓' }, { quoted: m });
            }
        }
    });

    return sock;
}

startBot();
```

---

### Pairing Code

```js
import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    makeCacheableSignalKeyStore,
    makeInMemoryStore,
    fetchLatestBaileysVersion
} from 'hiura-baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import readline from 'readline';

const logger = pino({ level: 'silent' });
const store = makeInMemoryStore({});

store.readFromFile('./data/store.json');
setInterval(() => store.writeToFile('./data/store.json'), 10_000);

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./sessions');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger)
        },
        printQRInTerminal: false,
        logger,
        browser: ['NimzzBot', 'Chrome', '1.0.0'],
        connectTimeoutMs: 20000,
        keepAliveIntervalMs: 30000,
        markOnlineOnConnect: true,
        syncFullHistory: false,
        getMessage: async (key) => store.loadMessage(key.remoteJid, key.id)?.message,
        cachedGroupMetadata: async (jid) => store.groupMetadata[jid],
    });

    store.bind(sock.ev);
    sock.ev.on('creds.update', saveCreds);

    if (!sock.authState.creds.registered) {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question('Masukkan nomor WA (contoh: 6281234567890): ', async (num) => {
            rl.close();
            const phoneNumber = num.replace(/[^0-9]/g, '');
            const code = await sock.requestPairingCode(phoneNumber);
            console.log(`Pairing Code: ${code?.match(/.{1,4}/g)?.join('-')}`);
        });
    }

    sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            const shouldReconnect = new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
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
            if (text === '.ping') {
                await sock.sendMessage(jid, { text: 'Pong! 🏓' }, { quoted: m });
            }
        }
    });

    return sock;
}

startBot();
```

---

### Default Pairing NIMZ1234

Untuk bot yang pakai pairing code dengan kode default tanpa input user:

```js
import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    makeCacheableSignalKeyStore,
    fetchLatestBaileysVersion
} from 'hiura-baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';

const logger = pino({ level: 'silent' });

// Nomor bot dan default pairing code
const BOT_NUMBER = '6281234567890'; // ganti dengan nomor bot
const DEFAULT_PAIRING_CODE = 'NIMZ1234';

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./sessions');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger)
        },
        printQRInTerminal: false,
        logger,
        browser: ['NimzzBot', 'Chrome', '1.0.0'],
        connectTimeoutMs: 20000,
        keepAliveIntervalMs: 30000,
        markOnlineOnConnect: true,
        syncFullHistory: false,
    });

    sock.ev.on('creds.update', saveCreds);

    // Auto pairing dengan kode default NIMZ1234
    if (!sock.authState.creds.registered) {
        await new Promise(r => setTimeout(r, 3000));
        try {
            const code = await sock.requestPairingCode(BOT_NUMBER.replace(/[^0-9]/g, ''));
            // Tampilkan pairing code — default fallback NIMZ1234 jika gagal generate
            const displayCode = code?.match(/.{1,4}/g)?.join('-') || DEFAULT_PAIRING_CODE;
            console.log(`\n╔══════════════════════╗`);
            console.log(`  Pairing Code: ${displayCode}`);
            console.log(`╚══════════════════════╝\n`);
        } catch (err) {
            console.log(`Pairing Code (default): ${DEFAULT_PAIRING_CODE}`);
        }
    }

    sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
            if (code !== DisconnectReason.loggedOut) startBot();
        } else if (connection === 'open') {
            console.log('Bot online!');
        }
    });

    return sock;
}

startBot();
```

---

## ⚙️ Konfigurasi Socket

```js
const sock = makeWASocket({
    version,                          // dari fetchLatestBaileysVersion()
    auth: state,                      // dari useMultiFileAuthState()
    printQRInTerminal: true,          // tampilkan QR di terminal
    logger,                           // pino logger
    browser: ['NimzzBot', 'Chrome', '1.0.0'],
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
    generateHighQualityLinkPreview: false,
    linkPreviewImageThumbnailWidth: 192,
    defaultQueryTimeoutMs: 60000,
    getMessage: async (key) => store.loadMessage(key.remoteJid, key.id)?.message,
    cachedGroupMetadata: async (jid) => store.groupMetadata[jid],
    patchMessageBeforeSending: (msg) => msg,
    shouldIgnoreJid: (jid) => false,
    countryCode: 'ID',
});
```

---

## 💬 Pesan Dasar

### Teks

```js
await sock.sendMessage(jid, { text: 'Halo!' });
await sock.sendMessage(jid, { text: 'Halo!' }, { quoted: m });

// Mention user
await sock.sendMessage(jid, {
    text: '@628111 halo!',
    mentions: ['628111@s.whatsapp.net']
});

// Edit pesan
await sock.sendMessage(jid, { text: 'Pesan diedit', edit: m.key });

// Delete pesan
await sock.sendMessage(jid, { delete: m.key });
```

### Gambar

```js
await sock.sendMessage(jid, {
    image: { url: 'https://example.com/img.jpg' },
    caption: 'Caption gambar'
});

// View once
await sock.sendMessage(jid, {
    image: { url: 'https://example.com/img.jpg' },
    viewOnce: true,
});
```

### Video

```js
await sock.sendMessage(jid, {
    video: { url: 'https://example.com/video.mp4' },
    caption: 'Caption video'
});

// GIF
await sock.sendMessage(jid, {
    video: { url: 'https://example.com/anim.mp4' },
    gifPlayback: true,
    caption: 'GIF keren'
});

// PTV (video circle)
await sock.sendMessage(jid, {
    video: { url: 'https://example.com/clip.mp4' },
    ptv: true
});
```

### Audio & Voice Note

```js
await sock.sendMessage(jid, {
    audio: { url: 'https://example.com/audio.mp3' },
    mimetype: 'audio/mp4'
});

// Voice note
await sock.sendMessage(jid, {
    audio: { url: 'https://example.com/voice.ogg' },
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
import { readFileSync } from 'fs';

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
await sock.sendMessage(jid, { react: { text: '🔥', key: m.key } });
await sock.sendMessage(jid, { react: { text: '', key: m.key } }); // hapus reaction
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

### Keep / Bookmark Pesan

```js
await sock.sendMessage(jid, {
    keep: {
        key: m.key,
        type: 1,
        time: Date.now()
    }
});
```

### Share Phone Number

```js
await sock.sendMessage(jid, { sharePhoneNumber: true });
```

### Request Phone Number

```js
await sock.sendMessage(jid, { requestPhoneNumber: true });
```

### Jadwal Panggilan

```js
await sock.sendMessage(jid, {
    call: {
        name: 'Meeting Bulanan',
        time: Date.now() + 3600000,
        type: 1
    }
});
```

### Order Message

```js
await sock.sendMessage(jid, {
    order: {
        orderId: 'ORDER-001',
        thumbnail: readFileSync('./produk.jpg'),
        itemCount: 2,
        status: 1,
        surface: 1,
        message: 'Pesanan kamu sedang diproses',
        orderTitle: 'Pesanan #001',
        sellerJid: sock.user.id,
        token: 'TOKEN_ORDER',
        totalAmount1000: 50000000,
        totalCurrencyCode: 'IDR'
    }
});
```

### Payment Invite

```js
await sock.sendMessage(jid, {
    paymentInvite: {
        type: 2,
        expiry: Math.floor(Date.now() / 1000) + 86400
    }
});
```

### Group Invite (dengan thumbnail)

```js
await sock.sendMessage(jid, {
    groupInvite: {
        code: 'AbCdEfGhIjKl',
        expiration: Math.floor(Date.now() / 1000) + 86400,
        caption: 'Gabung ke grup kita!',
        jid: '628111-1234@g.us',
        name: 'Grup Hiura Bot'
    }
});
```

### Newsletter Admin Invite

```js
await sock.sendMessage(jid, {
    adminInvite: {
        jid: '123456789@newsletter',
        name: 'Hiura Updates',
        caption: 'Jadilah admin newsletter kami!',
        expiration: Math.floor(Date.now() / 1000) + 86400
    }
});
```

---

## 🔘 Interactive Message

### Quick Reply Button

```js
import { generateWAMessageFromContent, proto } from 'hiura-baileys';

const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({ text: 'Pilih salah satu:' }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Hiura Bot' }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '✅ Pilihan A', id: 'id_a' }) },
                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '❌ Pilihan B', id: 'id_b' }) },
            ]
        })
    })
}, { userJid: sock.user.id, quoted: m });

await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

### URL Button

```js
const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({ text: 'Kunjungi GitHub kami!' }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Hiura Baileys' }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [{
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                    display_text: '🌐 Buka GitHub',
                    url: 'https://github.com/Nimzz-pemboy/hiura-baileys',
                    merchant_url: 'https://github.com/Nimzz-pemboy/hiura-baileys'
                })
            }]
        })
    })
}, { userJid: sock.user.id, quoted: m });

await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

### Call Button

```js
const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({ text: 'Hubungi kami!' }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Customer Service' }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [{ name: 'cta_call', buttonParamsJson: JSON.stringify({ display_text: '📞 Telepon CS', phone_number: '6281234567890' }) }]
        })
    })
}, { userJid: sock.user.id, quoted: m });

await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

### Copy Kode Button

```js
const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({ text: '🎁 Gunakan kode promo diskon 50%!' }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Berlaku sampai 31 Des 2026' }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [{ name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Salin: HIURA2026', copy_code: 'HIURA2026' }) }]
        })
    })
}, { userJid: sock.user.id, quoted: m });

await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

### Dropdown / single_select

```js
const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({ text: 'Pilih menu:' }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Hiura Food 🍔' }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [{
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                    title: '🍽️ Lihat Menu',
                    sections: [
                        {
                            title: '🍔 Makanan',
                            rows: [
                                { title: 'Nasi Goreng Spesial', description: 'Rp 35.000', id: 'nasi_goreng' },
                                { title: 'Mie Ayam Bakso', description: 'Rp 25.000', id: 'mie_ayam' },
                            ]
                        },
                        {
                            title: '🥤 Minuman',
                            rows: [
                                { title: 'Es Teh Manis', description: 'Rp 8.000', id: 'es_teh' },
                                { title: 'Jus Alpukat', description: 'Rp 18.000', id: 'jus_alpukat' },
                            ]
                        }
                    ]
                })
            }]
        })
    })
}, { userJid: sock.user.id, quoted: m });

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
}, { userJid: sock.user.id, quoted: m });

await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

### Address Button

```js
const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({ text: 'Masukkan alamat pengiriman:' }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Hiura Shop' }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [{ name: 'address_message', buttonParamsJson: JSON.stringify({ display_text: '📍 Isi Alamat', id: 'alamat' }) }]
        })
    })
}, { userJid: sock.user.id, quoted: m });

await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

### Flow Button

```js
const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({ text: 'Isi formulir pendaftaran member:' }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Hiura Member' }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [{
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
            }]
        })
    })
}, { userJid: sock.user.id, quoted: m });

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
}, { userJid: sock.user.id, quoted: m });

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

### Shop Storefront

```js
await sock.sendMessage(jid, {
    shop: {
        surface: 1,
        id: 'SHOP_ID'
    },
    text: 'Kunjungi toko kami!',
    title: 'Hiura Shop',
    footer: 'Hiura Baileys Store'
}, { quoted: m });
```

### Collection Message

```js
await sock.sendMessage(jid, {
    collection: {
        bizJid: '628111@s.whatsapp.net',
        id: 'COLLECTION_ID',
        version: 1
    },
    text: 'Koleksi produk terbaru!',
    title: 'New Collection'
}, { quoted: m });
```

### External Ad Reply

```js
await sock.sendMessage(jid, {
    text: '🚀 Hiura Baileys v1.4.0 udah rilis!',
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

## 🎠 Carousel

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
}, { userJid: sock.user.id, quoted: m });

await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

---

## 🤖 Hiura Engine

Hiura Engine adalah sistem `sendMessage` yang sudah di-enhance — cukup pass object content dan hiura-baileys handle sisanya.

### Interactive Buttons (Hiura Style)

```js
// Format shorthand — otomatis di-handle engine
await sock.sendMessage(jid, {
    interactiveButtons: [
        { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '✅ Ya', id: 'yes' }) },
        { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '❌ Tidak', id: 'no' }) },
        { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '🌐 Website', url: 'https://github.com/Nimzz-pemboy/hiura-baileys', merchant_url: 'https://github.com/Nimzz-pemboy/hiura-baileys' }) },
    ],
    text: 'Pilih opsi:',
    footer: 'Hiura Bot',
    image: { url: 'https://example.com/banner.jpg' }
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
        title: 'Nama Produk Keren',
        description: 'Deskripsi produk keren banget',
        currencyCode: 'IDR',
        priceAmount1000: 50000000,
        retailerId: 'SKU-001',
        url: 'https://example.com/produk',
        thumbnail: { url: 'https://example.com/produk.jpg' },
        footer: 'Hiura Shop',
        buttons: [
            { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🛒 Beli Sekarang', id: 'beli' }) }
        ]
    }
}, { quoted: m });
```

### Event Message

```js
await sock.sendMessage(jid, {
    eventMessage: {
        name: 'Workshop Hiura Baileys',
        description: 'Belajar bikin bot WA dari nol bareng Nimzz',
        location: { name: 'Jakarta, Indonesia', degreesLatitude: -6.2, degreesLongitude: 106.8 },
        startTime: Math.floor(Date.now() / 1000) + 3600,
        endTime: Math.floor(Date.now() / 1000) + 7200,
        joinLink: 'https://example.com/join',
        extraGuestsAllowed: true
    }
}, { quoted: m });
```

### Group Story

```js
// Kirim story ke grup
await sock.swgc(jid, { text: 'Story dari Hiura Bot 🚀' });

// Atau pakai sendMessage
await sock.sendMessage(jid, {
    groupStatusMessage: { text: 'Story grup dari Hiura Bot 🚀' }
});
```

### Status Mention

```js
// Mention ke private
await sock.sendStatusMention(
    { text: 'Halo dari status Hiura Bot! 🚀' },
    ['628111@s.whatsapp.net', '628222@s.whatsapp.net']
);

// Mention ke semua member grup
await sock.sendStatusMention(
    { image: { url: 'https://example.com/banner.jpg' }, caption: 'Story keren!' },
    ['628111-1234@g.us']
);
```

### Ephemeral Group

```js
// Cek durasi ephemeral grup
const expiration = await sock.getEphemeralGroup(jid);
console.log(`Ephemeral: ${expiration} detik`);

// sendMessage otomatis ikut ephemeral grup (tidak perlu set manual)
await sock.sendMessage(jid, { text: 'Pesan ini otomatis ephemeral sesuai setting grup!' });
```

### Sticker Pack

```js
import { readFileSync } from 'fs';

await sock.sendMessage(jid, {
    stickerPack: {
        name: 'Nimzz Sticker Pack',
        publisher: 'Hiura Bot',
        description: 'Sticker pack keren dari Nimzz',
        cover: readFileSync('./stickers/cover.webp'),
        stickers: [
            {
                sticker: readFileSync('./stickers/s1.webp'),
                isAnimated: false,
                emojis: ['😀']
            },
            {
                sticker: readFileSync('./stickers/s2.webp'),
                isAnimated: true,
                emojis: ['🔥']
            }
        ]
    }
}, { quoted: m });
```

---

## 📊 Rich Messages

### sendTable

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

### sendTableV2

```js
await sock.sendTableV2(
    jid,
    {
        title: 'Laporan Bulanan',
        headers: ['Bulan', 'Pemasukan', 'Pengeluaran'],
        rows: [
            ['Januari', 'Rp 5.000.000', 'Rp 3.000.000'],
            ['Februari', 'Rp 6.500.000', 'Rp 4.200.000'],
        ],
        footer: 'Data per Q1 2026'
    },
    m
);
```

### sendList

```js
await sock.sendList(
    jid,
    'Daftar Tugas Hari Ini',
    ['Beli bahan makanan', 'Meeting jam 10', 'Deploy update bot'],
    m
);
```

### sendCodeBlock

```js
await sock.sendCodeBlock(
    jid,
    {
        language: 'javascript',
        code: `const greet = (name) => \`Halo, \${name}!\`;\nconsole.log(greet('Nimzz'));`
    },
    m
);
```

### sendCodeBlockV2

```js
await sock.sendCodeBlockV2(
    jid,
    {
        language: 'typescript',
        title: 'Contoh TypeScript',
        code: `interface User { name: string; age: number; }\nconst user: User = { name: 'Nimzz', age: 20 };`
    },
    m
);
```

### sendLink

```js
await sock.sendLink(
    jid,
    'Cek repo Hiura Baileys!',
    [{
        url: 'https://github.com/Nimzz-pemboy/hiura-baileys',
        title: 'hiura-baileys',
        description: 'WhatsApp Web API for Node.js',
    }],
    m
);
```

### sendLinkV2

```js
await sock.sendLinkV2(
    jid,
    'Referensi lengkap:',
    [
        { url: 'https://github.com/Nimzz-pemboy/hiura-baileys', title: 'Hiura Baileys', description: 'Official repo', citation: '[1]' },
        { url: 'https://npmjs.com/package/hiura-baileys', title: 'NPM Package', description: 'Install via npm', citation: '[2]' }
    ],
    m
);
```

### sendLatex

```js
await sock.sendLatex(jid, m, { formula: 'E = mc^2', caption: 'Rumus Einstein' });
```

### sendLatexImage

```js
import { renderLatex } from 'node-latex';

await sock.sendLatexImage(
    jid, m,
    { formula: '\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}', caption: 'Integral Gaussian' },
    renderLatex,
    sock.waUploadToServer
);
```

### sendLatexInlineImage

```js
await sock.sendLatexInlineImage(
    jid, m,
    { text: 'Rumus luas lingkaran adalah', expressions: [{ latexExpression: 'A = \\pi r^2' }], footer: 'dimana r adalah jari-jari' },
    renderLatex,
    sock.waUploadToServer
);
```

### sendRichMessage

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
            rows: [['Execution time', '12ms'], ['Memory usage', '4.2MB']]
        },
        { type: 'text', text: 'Kode sudah optimal! ✅' }
    ],
    m
);
```

### sendUnifiedResponse

```js
const captured = sock.captureUnifiedResponse([
    { type: 'text', content: 'Ini hasilnya:' },
    { type: 'code', language: 'python', content: 'print("done")' },
]);

await sock.sendUnifiedResponse(jid, m, captured);
```

### sendPreview (Link Preview Custom)

```js
await sock.sendPreview(jid, {
    url: 'https://github.com/Nimzz-pemboy/hiura-baileys',
    title: 'Hiura Baileys',
    description: 'WhatsApp Bot API for Node.js by Nimzz',
    caption: 'Cek repo kita!',
    image: 'https://example.com/banner.jpg',
}, { quoted: m });
```

---

## 🏷️ JID Utils

```js
import {
    jidNormalizedUser, jidDecode, jidEncode,
    normalizeMentionJid, resolveJid, resolveJids,
    isPnUser, isLidUser, isJidGroup,
    isJidBroadcast, isJidNewsletter, isJidStatusBroadcast,
    isJidBot, isJidMetaAI,
    areJidsSameUser, S_WHATSAPP_NET, STORIES_JID
} from 'hiura-baileys';

jidNormalizedUser('628111@s.whatsapp.net:0')     // → '628111@s.whatsapp.net'
jidDecode('628111@s.whatsapp.net')                // → { user: '628111', server: 's.whatsapp.net' }
jidEncode('628111', 's.whatsapp.net')             // → '628111@s.whatsapp.net'
normalizeMentionJid('628111@lid')                 // → '628111@s.whatsapp.net'
normalizeMentionJid('6281234567890')              // → '6281234567890@s.whatsapp.net'
resolveJid('6281234567890')                       // → '6281234567890@s.whatsapp.net'
resolveJids(['628111', '628222@s.whatsapp.net'])  // → ['628111@s.whatsapp.net', '628222@s.whatsapp.net']

isPnUser('628111@s.whatsapp.net')                 // → true
isLidUser('628111@lid')                           // → true
isJidGroup('628111-1234@g.us')                    // → true
isJidBroadcast('status@broadcast')                // → true
isJidNewsletter('123@newsletter')                 // → true
isJidStatusBroadcast('status@broadcast')          // → true
isJidBot('13135550002@c.us')                      // → true
areJidsSameUser('628111@s.whatsapp.net', '628111@lid') // → true
```

---

## 👥 Group Management

```js
// Metadata
const meta = await sock.groupMetadata(jid);
console.log(meta.subject, meta.participants);

// Partisipan
await sock.groupParticipantsUpdate(jid, ['628111@s.whatsapp.net'], 'add');
await sock.groupParticipantsUpdate(jid, ['628111@s.whatsapp.net'], 'remove');
await sock.groupParticipantsUpdate(jid, ['628111@s.whatsapp.net'], 'promote');
await sock.groupParticipantsUpdate(jid, ['628111@s.whatsapp.net'], 'demote');

// Setting grup
await sock.groupUpdateSubject(jid, 'Nama Grup Baru 🚀');
await sock.groupUpdateDescription(jid, 'Deskripsi baru');
await sock.groupSettingUpdate(jid, 'announcement');
await sock.groupSettingUpdate(jid, 'not_announcement');
await sock.groupSettingUpdate(jid, 'locked');
await sock.groupSettingUpdate(jid, 'unlocked');

// Invite
const code = await sock.groupInviteCode(jid);
console.log(`https://chat.whatsapp.com/${code}`);
await sock.groupAcceptInvite('AbCdEfGhIjKlMn');
await sock.groupRevokeInvite(jid);
await sock.groupLeave(jid);

// Buat grup
const { id: newGroupId } = await sock.groupCreate('Nama Grup Baru', ['628111@s.whatsapp.net']);
console.log('Grup baru:', newGroupId);

// Ephemeral
await sock.groupToggleEphemeral(jid, 86400); // 1 hari
const expiration = await sock.getEphemeralGroup(jid);

// Foto profil
await sock.updateProfilePicture(jid, { url: 'https://example.com/foto.jpg' });
await sock.removeProfilePicture(jid);

// Request join
const pending = await sock.groupRequestParticipantsList(jid);
await sock.groupRequestParticipantsUpdate(jid, ['628111@s.whatsapp.net'], 'approve');
await sock.groupRequestParticipantsUpdate(jid, ['628111@s.whatsapp.net'], 'reject');
```

---

## 📡 Events

```js
sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {});
sock.ev.on('creds.update', saveCreds);

sock.ev.on('messages.upsert', ({ messages, type }) => {});
sock.ev.on('messages.update', (updates) => {});
sock.ev.on('messages.delete', (item) => {});
sock.ev.on('messages.reaction', (reactions) => {});
sock.ev.on('messages.media-update', (updates) => {});

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

sock.ev.on('labels.association', (association) => {});
sock.ev.on('labels.edit', (label) => {});
```

---

## 🔔 Status / Story

```js
// Status teks
await sock.sendMessage('status@broadcast', { text: 'Halo semua! 🚀' });

// Status gambar
await sock.sendMessage('status@broadcast', {
    image: { url: 'https://example.com/story.jpg' },
    caption: 'Caption story',
});

// Status ke kontak tertentu
await sock.sendMessage('status@broadcast', {
    text: 'Status khusus!',
    statusJidList: ['628111@s.whatsapp.net']
});

// Status + mention (via sendStatusMention)
await sock.sendStatusMention(
    { text: 'Tag spesial buat kamu!' },
    ['628111@s.whatsapp.net']
);
```

---

## 📰 Newsletter

```js
const info = await sock.getNewsletterInfo('123456789@newsletter');

await sock.followNewsletter('123456789@newsletter');
await sock.unfollowNewsletter('123456789@newsletter');
await sock.muteNewsletter('123456789@newsletter', true);

const newNL = await sock.createNewsletter({
    name: 'Hiura Updates',
    description: 'Update terbaru dari Hiura Baileys',
});
console.log('Newsletter ID:', newNL.id);

// Post ke newsletter
await sock.sendMessage('123456789@newsletter', { text: 'Post terbaru! 📢' });
```

---

## 💾 Store

```js
import { makeInMemoryStore } from 'hiura-baileys';

const store = makeInMemoryStore({});
store.readFromFile('./data/store.json');
setInterval(() => store.writeToFile('./data/store.json'), 10_000);

const sock = makeWASocket({
    auth: state,
    getMessage: async (key) => store.loadMessage(key.remoteJid, key.id)?.message,
    cachedGroupMetadata: async (jid) => store.groupMetadata[jid]
});

store.bind(sock.ev);
```

---

## 🔐 Auth & Session

```js
import {
    useMultiFileAuthState,
    makeCacheableSignalKeyStore
} from 'hiura-baileys';
import pino from 'pino';

const logger = pino({ level: 'silent' });
const { state, saveCreds } = await useMultiFileAuthState('./sessions');

const sock = makeWASocket({
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger)
    }
});

sock.ev.on('creds.update', saveCreds);

console.log('Sudah registrasi:', sock.authState.creds.registered);
console.log('Nomor WA:', sock.authState.creds.me?.id);

// Logout
await sock.logout();
```

---

## 🛠️ Utilities

```js
import {
    downloadMediaMessage, getContentType,
    generateMessageID, generateMessageIDV2,
    unixTimestampSeconds, delay, toBuffer, getDevice
} from 'hiura-baileys';

// Download media
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

// Presence
await sock.presenceSubscribe(jid);
await sock.sendPresenceUpdate('composing', jid);
await sock.sendPresenceUpdate('paused', jid);
await sock.sendPresenceUpdate('available', jid);
await sock.sendPresenceUpdate('unavailable', jid);

// Profil
const url = await sock.profilePictureUrl(jid, 'image');
await sock.updateProfilePicture(sock.user.id, { url: 'https://example.com/foto.jpg' });
await sock.updateProfileName('Hiura Bot 🤖');
await sock.updateProfileStatus('Powered by Hiura Baileys v1.4.0');

// Read
await sock.readMessages([m.key]);

// Chat modify
await sock.chatModify({ archive: true }, jid);
await sock.chatModify({ pin: true }, jid);
await sock.chatModify({ mute: Date.now() + 8 * 60 * 60 * 1000 }, jid);

// Cek nomor ada di WA
const [result] = await sock.onWhatsApp('628111@s.whatsapp.net');
console.log(result?.exists);

// Delay
await delay(2000);
const now = unixTimestampSeconds();
const device = getDevice('628111:5@s.whatsapp.net');
```

---

## ❓ FAQ

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

### LID mention tidak jalan

```js
import { normalizeMentionJid } from 'hiura-baileys';

const fixedJid = normalizeMentionJid(mentionedLid);
await sock.sendMessage(groupJid, {
    text: `@${fixedJid.split('@')[0]} hai!`,
    mentions: [fixedJid]
});
```

### Session sering disconnect

- Pastikan `saveCreds` di-bind ke `creds.update`
- Aktifkan `enableAutoSessionRecreation: true`
- Jangan jalankan dua instance dengan session yang sama

### Session corrupt

```bash
rm -rf ./sessions
node index.js
```

### Bot lambat / tinggi CPU

```js
// Set logger silent di production
const logger = pino({ level: 'silent' });

// Disable full history sync
syncFullHistory: false

// Pakai makeCacheableSignalKeyStore
keys: makeCacheableSignalKeyStore(state.keys, logger)
```

### Anti-ban tips

```js
async function sendSafe(jid, content, options = {}) {
    await delay(1000 + Math.random() * 2000);
    return sock.sendMessage(jid, content, options);
}

async function sendWithTyping(jid, content, options = {}) {
    await sock.sendPresenceUpdate('composing', jid);
    await delay(1500 + Math.random() * 1000);
    await sock.sendPresenceUpdate('paused', jid);
    return sock.sendMessage(jid, content, options);
}
```

---

## 📜 Changelog

### v1.4.0 (Latest)
- Fix `isJidNewsletter` error — lazy-load `waUploadToServer` via getter di Hiura class
- Fix carousel crash `upload is not a function`
- Fix `ptvMessage` return type → `'ptv'`
- Fix `stickerMessage` detect `isLottie`/`isAvatar` → `'1p_sticker'`/`'avatar_sticker'`
- Tambah `normalizeMentionJid`, `resolveJid`, `resolveJids` di JID utils
- Tambah `getEphemeralGroup` — fetch ephemeral duration dari grup
- Auto ephemeral detect di `sendMessage` — kirim ke grup ephemeral otomatis ikut
- Tambah `albumMessage` type `'collection'` di getContentType
- Tambah `cataloglink` dan `productlink` detection dari URL
- Rename `kikyy` → `hiura` di type declarations
- Rename `dugong.d.ts` → `hiura-types.d.ts`
- Konversi `hiura-advanced.js` dari CJS ke ESM proper

### v1.3.0
- Fix lazy-load `waUploadToServer` di Hiura constructor
- Tambah `normalizeMentionJid` ke WABinary exports
- Improve `handleCarousel` upload handling

### v1.2.1
- Tambah Hiura Engine — interactive, album, payment, product, event, group story
- Tambah sendTable / sendTableV2 / sendList
- Tambah sendCodeBlock / sendCodeBlockV2
- Tambah sendLink / sendLinkV2
- Tambah sendLatex / sendLatexImage / sendLatexInlineImage
- Tambah sendRichMessage / sendUnifiedResponse
- Tambah sendStatusMention
- Full source maps untuk debugging
- Dual CJS/ESM stabil

### v1.0.0
- Base dari blckrose-baileys 2.0.7
- Full LID + JID support
- libsignal dari whiskeysockets
- Interactive message semua tipe button
- Pairing Code (login tanpa QR)
- Carousel message

---

## 📄 Lisensi

MIT License — Copyright (c) 2026 Nimzz (Nimzz-pemboy)

> ⚠️ **Disclaimer:** Proyek ini tidak berafiliasi dengan WhatsApp Inc. Penggunaan sepenuhnya tanggung jawab pengguna.

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
