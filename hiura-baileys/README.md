<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=Hiura%20Baileys&fontSize=60&fontColor=fff&animation=twinkling&fontAlignY=35&desc=WhatsApp%20Web%20API%20for%20Node.js&descAlignY=55&descSize=20" width="100%"/>

<br/>

[![npm version](https://img.shields.io/npm/v/hiura-baileys?color=a855f7&label=version&style=for-the-badge&logo=npm)](https://npmjs.com/package/hiura-baileys)
[![npm downloads](https://img.shields.io/npm/dm/hiura-baileys?color=6366f1&style=for-the-badge&logo=npm)](https://npmjs.com/package/hiura-baileys)
[![GitHub stars](https://img.shields.io/github/stars/Nimzz-pemboy/hiura-baileys?color=f59e0b&style=for-the-badge&logo=github)](https://github.com/Nimzz-pemboy/hiura-baileys/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Nimzz-pemboy/hiura-baileys?color=10b981&style=for-the-badge&logo=github)](https://github.com/Nimzz-pemboy/hiura-baileys/network)
[![License](https://img.shields.io/github/license/Nimzz-pemboy/hiura-baileys?color=ec4899&style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen?style=for-the-badge&logo=node.js)](https://nodejs.org)

<br/>

> **WhatsApp Web API** untuk Node.js — fork dari Baileys dengan fitur lengkap.
> Full LID+JID support, all button types, dual CJS/ESM, MessageBuilder built-in.

**By [Nimzz](https://github.com/Nimzz-pemboy)**

<br/>

</div>

---

## 🙏 Credits & Base

Hiura Baileys dibangun di atas pundak raksasa:

| Project | Kontribusi |
|---------|-----------|
| [**Socketon**](https://github.com/socketon) | Base CJS, advanced handler, custom signal |
| [**blckrose-baileys**](https://github.com/blckrose) | LID/JID mapping proper, button compat patch, resolve-jid |
| [**@whiskeysockets/baileys**](https://github.com/WhiskeySockets/Baileys) | Original Baileys core |
| [**Open Whisper Systems**](https://github.com/signalapp) | Signal Protocol implementation |

> Makasih banyak buat semua kontributor di atas — tanpa kalian project ini ga akan ada 🫶

---

## ✨ Fitur

- ✅ **Full LID + JID support** — tag/mention di grup LID addressing beneran jalan
- ✅ **All button types** — `quick_reply`, `cta_url`, `cta_call`, `cta_copy`, `single_select`, `flow`, `cta_reminder`, `address_message`, `send_location`, dll
- ✅ **Dual module** — support `require()` (CJS) dan `import` (ESM) sekaligus
- ✅ **Auto button compat** — `listMessage`, `buttonsMessage`, `templateMessage` otomatis convert ke `interactiveMessage` di grup
- ✅ **MessageBuilder built-in** — class builder untuk interactive message, carousel, AI rich response
- ✅ **resolveJid** — resolve LID participant → `@s.whatsapp.net` via `groupMetadata`
- ✅ **@hiura/libsignal** — pure JS Signal Protocol, cross-platform, no native binary

---

## 📦 Install

```bash
npm install hiura-baileys
# atau
yarn add hiura-baileys
# atau
pnpm add hiura-baileys
```

---

## 🚀 Quick Start

### Basic Bot (CJS)

```js
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('hiura-baileys');
const { Boom } = require('@hapi/boom');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            const shouldReconnect = new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('✅ Bot connected!');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if (!m.message || m.key.fromMe) return;
        const text = m.message.conversation || m.message.extendedTextMessage?.text || '';
        const jid = m.key.remoteJid;
        if (text === '!ping') {
            await sock.sendMessage(jid, { text: 'Pong! 🏓' }, { quoted: m });
        }
    });
}

startBot();
```

### Basic Bot (ESM)

```js
import { makeWASocket, useMultiFileAuthState, DisconnectReason } from 'hiura-baileys';
import { Boom } from '@hapi/boom';

const { state, saveCreds } = await useMultiFileAuthState('./auth');
const sock = makeWASocket({ auth: state, printQRInTerminal: true });
sock.ev.on('creds.update', saveCreds);
```

---

## 📱 Pairing Code (Tanpa QR)

```js
const { makeWASocket, useMultiFileAuthState } = require('hiura-baileys');
const readline = require('readline');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
    });

    sock.ev.on('creds.update', saveCreds);

    if (!sock.authState.creds.registered) {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question('Masukkan nomor WA (contoh: 6281234567890): ', async (number) => {
            rl.close();
            const code = await sock.requestPairingCode(number.trim());
            console.log(`\n🔑 Pairing Code: ${code}`);
            console.log('Masukkan di WhatsApp → Linked Devices → Link with phone number\n');
        });
    }

    sock.ev.on('connection.update', ({ connection }) => {
        if (connection === 'open') console.log('✅ Connected via pairing code!');
    });
}

startBot();
```

---

## 💬 Kirim Pesan

```js
// Teks biasa
await sock.sendMessage(jid, { text: 'Halo!' });

// Reply
await sock.sendMessage(jid, { text: 'Halo!' }, { quoted: m });

// Mention / tag (auto-normalize LID)
await sock.sendMessage(jid, {
    text: '@628111 halo!',
    mentions: ['628111@s.whatsapp.net']
});

// Gambar
await sock.sendMessage(jid, {
    image: { url: 'https://example.com/img.jpg' },
    caption: 'Caption'
});

// Video
await sock.sendMessage(jid, {
    video: { url: 'https://example.com/video.mp4' },
    caption: 'Caption video'
});

// Dokumen
await sock.sendMessage(jid, {
    document: { url: 'https://example.com/file.pdf' },
    mimetype: 'application/pdf',
    fileName: 'dokumen.pdf'
});

// Voice note
await sock.sendMessage(jid, {
    audio: fs.readFileSync('./voice.ogg'),
    mimetype: 'audio/ogg; codecs=opus',
    ptt: true
});

// Sticker
await sock.sendMessage(jid, {
    sticker: fs.readFileSync('./sticker.webp')
});

// Lokasi
await sock.sendMessage(jid, {
    location: {
        degreesLatitude: -6.200000,
        degreesLongitude: 106.816666,
        name: 'Jakarta'
    }
});
```

---

## 🔘 Semua Tipe Button

```js
const { Button, ButtonV2, Carousel, AIRich } = require('hiura-baileys/MessageBuilder');
```

### Quick Reply
```js
await new Button(sock)
    .setBody('Pilih salah satu:')
    .setFooter('Hiura Baileys')
    .addReply('Pilihan A', 'id_a')
    .addReply('Pilihan B', 'id_b')
    .send(jid, { quoted: m });
```

### URL Button
```js
await new Button(sock)
    .setBody('Kunjungi website kami!')
    .addUrl('Buka GitHub', 'https://github.com/Nimzz-pemboy', false)
    .send(jid, { quoted: m });
```

### Call Button
```js
await new Button(sock)
    .setBody('Hubungi kami')
    .addCall('Telepon Sekarang', '6281234567890')
    .send(jid, { quoted: m });
```

### Copy Kode
```js
await new Button(sock)
    .setBody('Promo hari ini!')
    .addCopy('Salin Kode Promo', 'HIURA2025')
    .send(jid, { quoted: m });
```

### Dropdown / List
```js
await new Button(sock)
    .setBody('Pilih menu:')
    .addSelection('Buka Menu')
        .makeSections('🍔 Makanan')
            .makeRow('', 'Nasi Goreng', 'Rp 25.000', 'menu_1')
            .makeRow('', 'Mie Ayam', 'Rp 20.000', 'menu_2')
        .makeSections('🥤 Minuman')
            .makeRow('', 'Es Teh', 'Rp 8.000', 'menu_3')
    .send(jid, { quoted: m });
```

### Reminder
```js
await new Button(sock)
    .setBody('Jangan lupa meeting jam 3!')
    .addReminder('Set Reminder', 'reminder_1')
    .send(jid, { quoted: m });
```

### Address
```js
await new Button(sock)
    .setBody('Isi alamat pengiriman:')
    .addAddress('Isi Alamat', 'addr_1')
    .send(jid, { quoted: m });
```

### Send Location
```js
await new Button(sock)
    .setBody('Kirim lokasi kamu:')
    .addLocation()
    .send(jid, { quoted: m });
```

### Mix Semua + Gambar
```js
await new Button(sock)
    .setBody('Menu Lengkap Bot')
    .setFooter('Hiura Baileys v1.0.0')
    .setImage('https://example.com/banner.jpg')
    .addReply('📋 Info', 'info')
    .addUrl('🌐 GitHub', 'https://github.com/Nimzz-pemboy')
    .addCall('📞 Hubungi', '6281234567890')
    .addCopy('🎁 Kode Promo', 'HIURA25')
    .addLocation()
    .send(jid, { quoted: m });
```

### Carousel
```js
const card1 = await new Button(sock)
    .setBody('Produk A — Rp 100.000')
    .setImage('https://example.com/a.jpg')
    .addReply('Pilih A', 'produk_a')
    .addUrl('Detail', 'https://example.com/a')
    .toCard();

const card2 = await new Button(sock)
    .setBody('Produk B — Rp 150.000')
    .setImage('https://example.com/b.jpg')
    .addReply('Pilih B', 'produk_b')
    .toCard();

await new Carousel(sock)
    .setBody('Pilih produk:')
    .addCard([card1, card2])
    .send(jid, { quoted: m });
```

### AI Rich Response
```js
await new AIRich(sock)
    .addText('## Hasil\n\nBerikut info yang ditemukan:')
    .addCode('javascript', `const greet = name => \`Halo \${name}!\`;`)
    .addTable([
        ['Nama', 'Harga', 'Stok'],
        ['Produk A', 'Rp 100k', '50'],
        ['Produk B', 'Rp 150k', '30'],
    ])
    .addImage('https://example.com/hasil.jpg')
    .send(jid);
```

---

## 🏷️ Resolve LID → JID

```js
const { resolveJid, resolveJids } = require('hiura-baileys');

// Auto detect sender
const jid = await resolveJid(sock, m);

// Dari mention
const jid = await resolveJid(sock, m, m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]);

// Bulk dari mention list
const jids = await resolveJids(sock, m, m.mentionedJid);

await sock.sendMessage(m.key.remoteJid, {
    text: `Halo @${jid.split('@')[0]}!`,
    mentions: [jid]
});
```

---

## 🔧 JID Utils

```js
const { lidToJid, normalizeMentionJid, isPnUser, isLidUser, WAJIDDomains } = require('hiura-baileys');

lidToJid('628111@lid')             // → '628111@s.whatsapp.net'
normalizeMentionJid('628111@lid')  // → '628111@s.whatsapp.net'
normalizeMentionJid('628111')      // → '628111@s.whatsapp.net'
isPnUser('628111@s.whatsapp.net')  // → true
isLidUser('628111@lid')            // → true
```

---

## 📄 index.js Bot Lengkap

```js
const {
    makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    resolveJid
} = require('hiura-baileys');
const { Button, Carousel } = require('hiura-baileys/MessageBuilder');
const { Boom } = require('@hapi/boom');
const readline = require('readline');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        browser: ['Hiura Bot', 'Chrome', '1.0.0'],
    });

    sock.ev.on('creds.update', saveCreds);

    // Pairing code
    if (!sock.authState.creds.registered) {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question('Nomor WA (contoh: 6281234567890): ', async (num) => {
            rl.close();
            const code = await sock.requestPairingCode(num.trim());
            console.log(`\n🔑 Pairing Code: ${code}\n`);
        });
    }

    sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
            if (code !== DisconnectReason.loggedOut) startBot();
            else console.log('❌ Logged out, hapus folder auth dan restart.');
        }
        if (connection === 'open') console.log('✅ Hiura Bot connected!');
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        for (const m of messages) {
            if (!m.message || m.key.fromMe) continue;

            const jid = m.key.remoteJid;
            const isGroup = jid.endsWith('@g.us');
            const body = m.message?.conversation
                || m.message?.extendedTextMessage?.text
                || m.message?.imageMessage?.caption
                || '';

            const cmd = body.startsWith('!') ? body.slice(1).split(' ')[0].toLowerCase() : null;
            if (!cmd) continue;

            if (cmd === 'ping') {
                await sock.sendMessage(jid, { text: '🏓 Pong!' }, { quoted: m });
            }

            else if (cmd === 'menu') {
                await new Button(sock)
                    .setBody('Halo! Selamat datang 👋\nPilih menu:')
                    .setFooter('Hiura Baileys v1.0.0')
                    .addReply('📋 Info', 'info')
                    .addReply('⚙️ Fitur', 'fitur')
                    .addUrl('📦 GitHub', 'https://github.com/Nimzz-pemboy/hiura-baileys')
                    .send(jid, { quoted: m });
            }

            else if (cmd === 'tag' && isGroup) {
                const targetJid = await resolveJid(sock, m,
                    m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]);
                if (targetJid) {
                    await sock.sendMessage(jid, {
                        text: `Hei @${targetJid.split('@')[0]}! 👋`,
                        mentions: [targetJid]
                    }, { quoted: m });
                }
            }

            else if (cmd === 'tagall' && isGroup) {
                const meta = await sock.groupMetadata(jid);
                const mentions = meta.participants.map(p => p.id);
                await sock.sendMessage(jid, {
                    text: mentions.map(id => `@${id.split('@')[0]}`).join(' '),
                    mentions
                }, { quoted: m });
            }
        }
    });
}

startBot();
```

---

## 📁 Struktur Repo

```
hiura-baileys/
├── lib/                       ← CJS (require)
│   ├── Socket/
│   │   ├── hiura-advanced.js  ← advanced handler
│   │   ├── messages-send.js
│   │   └── ...
│   ├── Utils/
│   │   ├── hiura-crypto-utils.js
│   │   ├── resolve-jid.js
│   │   └── ...
│   ├── WABinary/
│   │   └── jid-utils.js
│   └── index.js
├── esm/                       ← ESM (import)
│   ├── index.mjs
│   └── MessageBuilder.mjs
├── MessageBuilder.js
├── package.json
└── README.md
```

---

## 🔗 Repositories

<div align="center">

| Repo | Deskripsi | Link |
|------|-----------|------|
| **hiura-baileys** | Main WhatsApp API | [![GitHub](https://img.shields.io/badge/GitHub-hiura--baileys-a855f7?style=for-the-badge&logo=github)](https://github.com/Nimzz-pemboy/hiura-baileys) |
| **hiura-libsignal** | Signal Protocol | [![GitHub](https://img.shields.io/badge/GitHub-hiura--libsignal-6366f1?style=for-the-badge&logo=github)](https://github.com/Nimzz-pemboy/hiura-libsignal) |

</div>

---

## 📊 Stats

<div align="center">

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=Nimzz-pemboy&show_icons=true&theme=tokyonight&hide_border=true)

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=Nimzz-pemboy&layout=compact&theme=tokyonight&hide_border=true)

</div>

---

## 🤝 Contributing

1. Fork repo ini
2. Buat branch baru: `git checkout -b fitur-baru`
3. Commit: `git commit -m 'feat: tambah fitur X'`
4. Push: `git push origin fitur-baru`
5. Buat Pull Request

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

**Made with ❤️ by [Nimzz](https://github.com/Nimzz-pemboy)**

*Thanks to Socketon & blckrose-baileys for the amazing base 🙏*

</div>