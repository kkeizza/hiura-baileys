# hiura-baileys

WhatsApp Web API for Node.js. Fork dari [@blckrose/baileys](https://www.npmjs.com/package/@blckrose/baileys) dengan penambahan fitur LID penuh, semua tipe button dan interactive message, rich messages, decrypt handler, dan perbaikan CJS compatibility.

[![npm](https://img.shields.io/npm/v/hiura-baileys?style=flat-square)](https://npmjs.com/package/hiura-baileys)
[![node](https://img.shields.io/badge/node-%3E%3D20-brightgreen?style=flat-square)](https://nodejs.org)
[![license](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

---

## Credits

| Project | Kontribusi |
|---------|-----------|
| [@blckrose/baileys](https://www.npmjs.com/package/@blckrose/baileys) | Base utama library ini |
| [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) | Baileys core original |

---

## Persyaratan

- Node.js >= 20
- npm atau yarn

```bash
npm install hiura-baileys
```

Untuk fitur media (thumbnail, image processing):
```bash
npm install sharp
```

Untuk logging:
```bash
npm install pino
```

---

## Cara Import

### ESM
```js
import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    Browsers,
    makeCacheableSignalKeyStore,
    makeInMemoryStore,
    fetchLatestBaileysVersion,
    proto
} from 'hiura-baileys';
```

### CJS
```js
const {
    makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    Browsers,
    makeCacheableSignalKeyStore,
    makeInMemoryStore,
    fetchLatestBaileysVersion,
    proto
} = require('hiura-baileys');
```

Semua 317 export tersedia di CJS maupun ESM. Tidak perlu `await ready` atau top-level await khusus — cukup `await useMultiFileAuthState()` dan semua siap digunakan.

---

## Quick Start

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

const logger = pino({ level: 'silent' });
const store = makeInMemoryStore({});
store.readFromFile('./data/store.json');
setInterval(() => store.writeToFile('./data/store.json'), 10_000);

async function start() {
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
        syncFullHistory: false,
        getMessage: async (key) => store.loadMessage(key.remoteJid, key.id)?.message,
        cachedGroupMetadata: async (jid) => store.groupMetadata[jid],
    });

    store.bind(sock.ev);
    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
            if (code !== DisconnectReason.loggedOut) start();
            else console.log('Logged out. Hapus folder sessions lalu restart.');
        }
        if (connection === 'open') console.log('Connected!');
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        const m = messages[0];
        if (!m.message) return;
        const jid = m.key.remoteJid;
        const text = m.message?.conversation
            || m.message?.extendedTextMessage?.text
            || '';
        if (text === '.ping') await sock.sendMessage(jid, { text: 'pong' }, { quoted: m });
    });
}

start();
```

### Pairing Code (tanpa QR)

```js
const sock = makeWASocket({ printQRInTerminal: false, ...config });

sock.ev.on('connection.update', async ({ connection }) => {
    if (connection === 'connecting' && !sock.authState.creds.registered) {
        const code = await sock.requestPairingCode('6281234567890');
        console.log('Kode:', code?.match(/.{1,4}/g)?.join('-'));
    }
});
```

---

## Pesan Teks

```js
// teks biasa
await sock.sendMessage(jid, { text: 'halo' });

// dengan mention
await sock.sendMessage(jid, {
    text: '@628111 halo',
    mentions: ['628111@s.whatsapp.net']
});

// dengan quoted
await sock.sendMessage(jid, { text: 'balas' }, { quoted: m });

// edit pesan
await sock.sendMessage(jid, { text: 'teks baru', edit: m.key });

// forward
await sock.sendMessage(jid, { forward: m });
```

---

## Pesan Media

```js
// gambar
await sock.sendMessage(jid, { image: { url: 'https://...' }, caption: 'caption' });
await sock.sendMessage(jid, { image: readFileSync('./img.jpg'), caption: 'caption' });

// video
await sock.sendMessage(jid, { video: { url: 'https://...' }, caption: 'caption' });

// audio biasa
await sock.sendMessage(jid, {
    audio: { url: 'https://...' },
    mimetype: 'audio/mp4'
});

// voice note (PTT)
await sock.sendMessage(jid, {
    audio: { url: 'https://...' },
    mimetype: 'audio/ogg; codecs=opus',
    ptt: true
});

// video note (PTV / lingkaran)
await sock.sendMessage(jid, {
    video: { url: 'https://...' },
    ptv: true
});

// dokumen
await sock.sendMessage(jid, {
    document: { url: 'https://...' },
    mimetype: 'application/pdf',
    fileName: 'file.pdf'
});

// sticker
await sock.sendMessage(jid, { sticker: readFileSync('./sticker.webp') });

// kontak
await sock.sendMessage(jid, {
    contacts: {
        displayName: 'Nama',
        contacts: [{ vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:Nama\nTEL:+62811\nEND:VCARD' }]
    }
});

// lokasi
await sock.sendMessage(jid, {
    location: {
        degreesLatitude: -6.200000,
        degreesLongitude: 106.816666,
        name: 'Jakarta',
        address: 'Jakarta, Indonesia'
    }
});
```

---

## Album (multi-media)

Kirim beberapa gambar/video sekaligus dalam satu album:

```js
await sock.sendMessage(jid, {
    album: [
        { image: { url: 'https://...' }, caption: 'foto 1' },
        { image: readFileSync('./img.jpg'), caption: 'foto 2' },
        { video: { url: 'https://...' }, caption: 'video 1' },
    ]
}, { quoted: m });
```

Maksimal campuran gambar dan video. Caption per item.

---

## Sticker Pack

Kirim pack sticker ke chat:

```js
// Butuh: npm install fflate sharp
await sock.sendMessage(jid, {
    stickerPack: {
        name: 'Nama Pack',
        publisher: 'Publisher',
        packId: 'pack-id-unik',           // opsional, auto-generate kalau kosong
        description: 'Deskripsi pack',    // opsional
        cover: readFileSync('./cover.webp'), // opsional
        stickers: [
            { data: readFileSync('./sticker1.webp') },
            { data: readFileSync('./sticker2.jpg') }, // auto-convert ke webp
            { data: readFileSync('./animated.webp') }, // animated juga support
        ]
    }
});
```

Batas: 1–120 sticker per pack. Format input: webp, jpg, png (auto-convert). Animated webp support.

---

## Reaction, Delete, Pin, Keep

```js
// react
await sock.sendMessage(jid, {
    react: { text: '👍', key: m.key }
});

// hapus react
await sock.sendMessage(jid, {
    react: { text: '', key: m.key }
});

// hapus pesan (butuh admin kalau di grup)
await sock.sendMessage(jid, { delete: m.key });

// pin pesan (type: 1=86400s, 2=604800s, 3=2592000s, 5=hapus pin)
await sock.sendMessage(jid, {
    pin: { key: m.key, type: 1, time: 86400 }
});

// keep pesan (simpan ke starred)
await sock.sendMessage(jid, {
    keep: { key: m.key, type: 1 }
});
```

---

## Poll & Event

```js
// poll biasa (pilih satu)
await sock.sendMessage(jid, {
    poll: {
        name: 'Pilih satu:',
        values: ['Opsi A', 'Opsi B', 'Opsi C'],
        selectableCount: 1
    }
});

// poll multi-pilih
await sock.sendMessage(jid, {
    poll: {
        name: 'Pilih beberapa:',
        values: ['A', 'B', 'C'],
        selectableCount: 0  // 0 = boleh pilih semua
    }
});

// poll untuk community announcement group
await sock.sendMessage(jid, {
    poll: {
        name: 'Voting:',
        values: ['Ya', 'Tidak'],
        selectableCount: 1,
        toAnnouncementGroup: true
    }
});

// hasil poll (snapshot)
await sock.sendMessage(jid, {
    pollResult: {
        name: 'Nama Poll',
        values: [
            ['Opsi A', 42],
            ['Opsi B', 17],
        ]
    }
});

// event
await sock.sendMessage(jid, {
    event: {
        name: 'Nama Acara',
        description: 'Deskripsi acara',
        startDate: new Date('2026-07-01T09:00:00+07:00'),
        endDate: new Date('2026-07-01T17:00:00+07:00'),
        location: {
            degreesLatitude: -6.2,
            degreesLongitude: 106.8,
            name: 'Jakarta Convention Center'
        },
        isCancelled: false,
        extraGuestsAllowed: true,
    }
});
```

---

## Payment & Order

```js
// minta bayar
await sock.sendMessage(jid, {
    payment: {
        currency: 'IDR',
        amount: 50000,
        offset: 0,
        expiry: Math.floor(Date.now() / 1000) + 86400,
        from: '628111@s.whatsapp.net',
        note: 'Bayar dong',
    }
});

// payment invite
await sock.sendMessage(jid, {
    paymentInvite: {
        type: 2,
        expiry: Math.floor(Date.now() / 1000) + 86400
    }
});
```

---

## Scheduled Call

```js
await sock.sendMessage(jid, {
    call: {
        name: 'Meeting Mingguan',
        type: 1,  // 1 = voice, 2 = video
        time: Date.now() + 3600000
    }
});
```

---

## Group Invite & Newsletter Admin Invite

```js
// undangan grup
const code = await sock.groupInviteCode(groupJid);
await sock.sendMessage(jid, {
    groupInvite: {
        inviteCode: code,
        inviteExpiration: Math.floor(Date.now() / 1000) + 86400 * 3,
        jid: groupJid,
        subject: 'Nama Grup',
        text: 'Gabung yuk!'
    }
});

// undangan admin newsletter
await sock.sendMessage(jid, {
    adminInvite: {
        jid: '123456@newsletter',
        name: 'Nama Saluran',
        caption: 'Jadi admin saluran kami!',
        expiration: Math.floor(Date.now() / 1000) + 86400 * 7
    }
});
```

---

## Share Phone & Limit Sharing

```js
// bagikan nomor telepon
await sock.sendMessage(jid, { sharePhoneNumber: true });

// minta nomor telepon
await sock.sendMessage(jid, { requestPhoneNumber: true });

// batasi sharing (privacy)
await sock.sendMessage(jid, { limitSharing: true });
await sock.sendMessage(jid, { limitSharing: false }); // cabut batasan
```

---

## List Reply & Button Reply

Untuk membalas pesan interaktif yang masuk:

```js
// balas list (single_select)
await sock.sendMessage(jid, {
    buttonReply: { title: 'Judul Item', description: 'Deskripsi', rowId: 'row_id' },
    type: 'list'
});

// balas template button
await sock.sendMessage(jid, {
    buttonReply: { displayText: 'Teks Tombol', id: 'button_id', index: 0 },
    type: 'template'
});

// balas plain button
await sock.sendMessage(jid, {
    buttonReply: { id: 'button_id', displayText: 'Teks Tombol' },
    type: 'plain'
});

// balas native flow / interactive button
await sock.sendMessage(jid, {
    buttonReply: {
        displayText: 'Teks',
        nativeFlows: {
            name: 'quick_reply',
            paramsJson: JSON.stringify({ id: 'btn_id' }),
            version: 1
        }
    },
    type: 'interactive'
});

// balas list response (listReply)
await sock.sendMessage(jid, {
    listReply: {
        singleSelectReply: { selectedRowId: 'row_id' },
        title: 'Pilihan',
        listType: 1
    }
});
```

---

## Sections (List Message)

```js
await sock.sendMessage(jid, {
    sections: [
        {
            title: 'Kategori 1',
            rows: [
                { title: 'Item A', description: 'Deskripsi A', id: 'item_a' },
                { title: 'Item B', description: 'Deskripsi B', id: 'item_b' },
            ]
        },
        {
            title: 'Kategori 2',
            rows: [
                { title: 'Item C', id: 'item_c' },
            ]
        }
    ],
    title: 'Judul List',
    buttonText: 'Lihat Pilihan',
    text: 'Pilih salah satu:',
    footer: 'footer teks',
    mentions: ['628111@s.whatsapp.net'],
}, { quoted: m });
```

---

## Product List

```js
await sock.sendMessage(jid, {
    productList: [
        {
            title: 'Kategori Produk',
            products: [
                { productId: 'prod_1' },
                { productId: 'prod_2' },
            ]
        }
    ],
    businessOwnerJid: '628111@s.whatsapp.net',
    title: 'Katalog',
    buttonText: 'Lihat Produk',
    text: 'Produk kami:',
    footer: 'footer',
    thumbnail: readFileSync('./thumb.jpg'),
}, { quoted: m });
```

---

## Buttons (Plain)

```js
await sock.sendMessage(jid, {
    buttons: [
        { buttonId: 'id1', buttonText: { displayText: 'Tombol 1' }, type: 1 },
        { buttonId: 'id2', buttonText: { displayText: 'Tombol 2' }, type: 1 },
        { buttonId: 'id3', buttonText: { displayText: 'Tombol 3' }, type: 1 },
    ],
    text: 'Pilih:',
    footer: 'footer',
    mentions: ['628111@s.whatsapp.net'],
}, { quoted: m });
```

---

## Template Buttons

```js
await sock.sendMessage(jid, {
    templateButtons: [
        {
            urlButton: {
                displayText: 'Buka Website',
                url: 'https://github.com'
            }
        },
        {
            callButton: {
                displayText: 'Telepon',
                phoneNumber: '+6281234567890'
            }
        },
        {
            quickReplyButton: {
                displayText: 'Reply',
                id: 'reply_id'
            }
        }
    ],
    text: 'Template button:',
    caption: 'caption',
    footer: 'footer',
}, { quoted: m });
```

---

## Interactive Buttons (Native Flow)

Ini yang paling fleksibel dan support semua tipe button modern WA:

```js
await sock.sendMessage(jid, {
    interactiveButtons: [
        // quick reply
        {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: 'Ya', id: 'yes' })
        },
        // buka URL
        {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
                display_text: 'Buka Link',
                url: 'https://github.com',
                merchant_url: 'https://github.com'
            })
        },
        // telepon
        {
            name: 'cta_call',
            buttonParamsJson: JSON.stringify({
                display_text: 'Hubungi',
                phone_number: '6281234567890'
            })
        },
        // salin teks
        {
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
                display_text: 'Salin Kode',
                id: 'copy_id',
                copy_code: 'KODE123'
            })
        },
        // kirim lokasi
        { name: 'send_location', buttonParamsJson: '' },
        // address message
        { name: 'address_message', buttonParamsJson: '' },
        // dropdown / single select
        {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
                title: 'Buka Menu',
                sections: [{
                    title: 'Pilihan',
                    rows: [
                        { title: 'Menu 1', description: 'desc', id: 'menu1' },
                        { title: 'Menu 2', id: 'menu2' },
                    ]
                }]
            })
        },
    ],
    text: 'Isi pesan',
    title: 'Judul header',
    subtitle: 'Subjudul',
    footer: 'Footer teks',
    // media di header (opsional, pilih salah satu)
    image: { url: 'https://...' },
    // video: { url: 'https://...' },
    // document: { url: 'https://...' },
    mentions: ['628111@s.whatsapp.net'],
}, { quoted: m });
```

### Dengan raw `generateWAMessageFromContent`

Untuk kontrol penuh atas struktur proto:

```js
import { generateWAMessageFromContent, prepareWAMessageMedia, proto } from 'hiura-baileys';

const media = await prepareWAMessageMedia(
    { image: { url: 'https://...' } },
    { upload: sock.waUploadToServer }
);

const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: { text: 'Isi pesan' },
        footer: { text: 'Footer' },
        header: {
            title: 'Judul',
            hasMediaAttachment: true,
            ...media
        },
        nativeFlowMessage: {
            buttons: [
                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'OK', id: 'ok' }) },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: 'Link', url: 'https://...' }) },
            ]
        }
    })
}, { userJid: sock.user.id, quoted: m });

await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

---

## Shop, Collection, Cards

```js
// shop storefront
await sock.sendMessage(jid, {
    shop: { surface: 1, id: 'SHOP_ID' },
    text: 'Kunjungi toko',
    title: 'Toko Kami',
    footer: 'Tersedia sekarang'
});
// atau gaya lama: shop: 1, id: 'SHOP_ID'

// collection
await sock.sendMessage(jid, {
    collection: {
        bizJid: '628111@s.whatsapp.net',
        id: 'COLLECTION_ID',
        version: 1
    },
    text: 'Koleksi terbaru',
    title: 'Koleksi',
    footer: 'Cek sekarang'
});

// cards (shorthand via sendMessage)
await sock.sendMessage(jid, {
    cards: [
        {
            title: 'Produk A',
            body: 'Harga: Rp 100.000',
            footer: 'footer',
            image: { url: 'https://...' },
            buttons: [
                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Beli', id: 'beli_a' }) }
            ]
        },
        {
            title: 'Produk B',
            body: 'Harga: Rp 150.000',
            image: { url: 'https://...' },
            buttons: [
                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Beli', id: 'beli_b' }) }
            ]
        }
    ],
    text: 'Pilih produk:',
    footer: 'footer'
});
```

---

## Carousel (raw)

Untuk carousel dengan media tiap card, gunakan `generateWAMessageFromContent`:

```js
import { generateWAMessageFromContent, prepareWAMessageMedia, proto } from 'hiura-baileys';

async function makeCard(imageUrl, bodyText, buttons) {
    const media = await prepareWAMessageMedia(
        { image: { url: imageUrl } },
        { upload: sock.waUploadToServer }
    );
    return proto.Message.InteractiveMessage.create({
        body: { text: bodyText },
        footer: { text: '' },
        header: { title: '', hasMediaAttachment: true, ...media },
        nativeFlowMessage: { buttons }
    });
}

const cards = await Promise.all([
    makeCard('https://.../a.jpg', 'Produk A\nRp 100.000', [
        { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Beli A', id: 'beli_a' }) },
        { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: 'Detail', url: 'https://...', merchant_url: 'https://...' }) }
    ]),
    makeCard('https://.../b.jpg', 'Produk B\nRp 150.000', [
        { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Beli B', id: 'beli_b' }) }
    ]),
]);

const msg = generateWAMessageFromContent(jid, {
    interactiveMessage: proto.Message.InteractiveMessage.create({
        body: { text: 'Pilih produk:' },
        footer: { text: 'footer' },
        header: { title: '', hasMediaAttachment: false },
        carouselMessage: {
            cards,
            messageVersion: 1,
            carouselCardType: 1
        }
    })
}, { userJid: sock.user.id, quoted: m });

await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

---

## Interaktif — handleInteractive (via Hiura Engine)

Untuk kasus sendMessage yang butuh media + buttons tapi format lebih ringkas:

```js
// Hiura Engine otomatis mendeteksi tipe dan meng-handle upload
await sock.sendMessage(jid, {
    interactiveMessage: {
        title: 'Judul Header',
        footer: 'Footer',
        image: { url: 'https://...' },    // atau video/document
        buttons: [
            { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'A', id: 'a' }) }
        ],
        contextInfo: {
            mentionedJid: ['628111@s.whatsapp.net']
        },
        externalAdReply: {
            title: 'Judul Ad',
            body: 'Body Ad',
            mediaUrl: 'https://...',
            sourceUrl: 'https://...'
        }
    }
}, { quoted: m });
```

---

## Rich Messages (Hiura Engine)

Semua fungsi di bawah ini tersedia langsung di objek `sock`:

### Tabel

```js
// tabel sederhana
await sock.sendTable(
    jid,
    'Judul Tabel',
    ['Kolom A', 'Kolom B', 'Kolom C'],
    [
        ['data 1', 'data 2', 'data 3'],
        ['data 4', 'data 5', 'data 6'],
    ],
    m,       // quoted (opsional)
    {}       // options
);

// tabel v2 (format objek)
await sock.sendTableV2(
    jid,
    {
        title: 'Judul',
        headers: ['A', 'B'],
        rows: [['1', '2'], ['3', '4']],
        footer: 'footer opsional'
    },
    m,
    {}
);
```

### List

```js
await sock.sendList(
    jid,
    'Judul List',
    ['item pertama', 'item kedua', 'item ketiga'],
    m,
    {}
);
```

### Code Block

```js
// code block v1
await sock.sendCodeBlock(
    jid,
    {
        language: 'javascript',  // js, python, cpp, go, rust, lua, css, html, bash, dll.
        code: 'console.log("hello world")'
    },
    m,
    {}
);

// code block v2 (dengan judul)
await sock.sendCodeBlockV2(
    jid,
    {
        language: 'python',
        title: 'Contoh Python',
        code: 'print("hello world")'
    },
    m,
    {}
);
```

### Link

```js
// link v1
await sock.sendLink(
    jid,
    'Teks pesan',
    [
        {
            url: 'https://github.com',
            title: 'GitHub',
            description: 'Deskripsi link'
        }
    ],
    m,
    {}
);

// link v2
await sock.sendLinkV2(jid, 'Teks', links, m, {});
```

### Latex

```js
// latex teks (render sisi WA)
await sock.sendLatex(
    jid,
    m,
    { formula: 'E = mc^2', caption: 'Rumus Einstein' }
);

// latex sebagai gambar (butuh render function)
await sock.sendLatexImage(
    jid,
    m,
    { formula: '\\int_0^\\infty e^{-x} dx = 1', caption: 'Integral' },
    renderLatexToPng,   // fungsi custom untuk render latex → PNG buffer
    sock.waUploadToServer
);

// latex inline image
await sock.sendLatexInlineImage(jid, m, options, renderFn, uploadFn);
```

### Rich Message (gabungan)

```js
await sock.sendRichMessage(
    jid,
    [
        { type: 'text', text: 'Intro teks' },
        { type: 'code', language: 'js', code: 'const x = 1 + 1;' },
        { type: 'list', title: 'Daftar', items: ['a', 'b', 'c'] },
        { type: 'table', title: 'Data', headers: ['K', 'V'], rows: [['key', 'val']] },
        { type: 'link', text: 'Info', links: [{ url: 'https://...', title: 'Judul' }] }
    ],
    m,
    {}
);
```

### Unified Response

Untuk reply ke bot response message:

```js
const captured = await sock.captureUnifiedResponse(jid, m);
await sock.sendUnifiedResponse(jid, m, captured);
```

### Link Preview

```js
await sock.sendPreview(jid, {
    text: 'Deskripsi',
    url: 'https://github.com',
    title: 'Judul',
    description: 'Deskripsi preview',
    image: 'https://.../preview.jpg',  // atau Buffer
    matchedText: 'https://github.com'
}, { quoted: m });
```

---

## Group Story / Status Grup

```js
// kirim status ke grup tertentu
await sock.swgc(groupJid, { text: 'Status grup!' });
await sock.swgc(groupJid, { image: { url: 'https://...' }, caption: 'Status' });

// shorthand untuk sendStatusWhatsApp
await sock.sendStatusMention({ text: 'Status!' }, [groupJid, userJid]);
```

---

## Status / Story WA

```js
// kirim ke semua kontak
await sock.sendStatusWhatsApp({ text: 'Status!' });
await sock.sendStatusWhatsApp({ image: { url: 'https://...' }, caption: 'Caption' });

// kirim ke kontak/grup spesifik
await sock.sendStatusWhatsApp(
    { text: 'Khusus untuk group ini!' },
    ['628111@s.whatsapp.net', groupJid]
);

// alias
await sock.sendStatusMention({ text: 'halo' }, jids);
```

---

## Ephemeral / Disappearing Messages

```js
// aktifkan disappearing di chat/grup
await sock.sendMessage(jid, {
    disappearingMessagesInChat: true
    // atau: 86400, 604800, 2592000 (durasi detik)
});

// nonaktifkan
await sock.sendMessage(jid, { disappearingMessagesInChat: false });

// cek durasi ephemeral di grup
const expiration = await sock.getEphemeralGroup(groupJid);
// return: 0 | 86400 | 604800 | 2592000

// sendMessage otomatis ikut ephemeral setting grup
// tidak perlu set ephemeralExpiration manual
```

---

## Group Management

```js
// metadata
const meta = await sock.groupMetadata(jid);

// buat grup
const { id } = await sock.groupCreate('Nama Grup', [
    '628111@s.whatsapp.net',
    '628222@s.whatsapp.net'
]);

// kelola peserta
await sock.groupParticipantsUpdate(jid, ['628111@s.whatsapp.net'], 'add');
await sock.groupParticipantsUpdate(jid, ['628111@s.whatsapp.net'], 'remove');
await sock.groupParticipantsUpdate(jid, ['628111@s.whatsapp.net'], 'promote');
await sock.groupParticipantsUpdate(jid, ['628111@s.whatsapp.net'], 'demote');

// update info grup
await sock.groupUpdateSubject(jid, 'Nama Baru');
await sock.groupUpdateDescription(jid, 'Deskripsi baru');

// setting grup
await sock.groupSettingUpdate(jid, 'announcement');  // hanya admin bisa kirim
await sock.groupSettingUpdate(jid, 'not_announcement');
await sock.groupSettingUpdate(jid, 'locked');         // hanya admin edit info
await sock.groupSettingUpdate(jid, 'unlocked');

// ephemeral grup
await sock.groupToggleEphemeral(jid, 86400);   // aktifkan
await sock.groupToggleEphemeral(jid, 0);       // nonaktifkan

// invite
const code = await sock.groupInviteCode(jid);
await sock.groupAcceptInvite(code);
await sock.groupRevokeInvite(jid);

// foto profil grup
await sock.updateProfilePicture(jid, readFileSync('./foto.jpg'));
await sock.removeProfilePicture(jid);

// keluar
await sock.groupLeave(jid);
```

---

## Newsletter (Saluran)

```js
// info saluran
const info = await sock.getNewsletterInfo('jid@newsletter');
const infoByInvite = await sock.getNewsletterInfoFromInvite('https://whatsapp.com/channel/...');

// buat saluran baru
const nl = await sock.createNewsletter({
    name: 'Nama Saluran',
    description: 'Deskripsi saluran',
    picture: readFileSync('./foto.jpg')  // opsional
});

// kelola
await sock.followNewsletter('jid@newsletter');
await sock.unfollowNewsletter('jid@newsletter');
await sock.muteNewsletter('jid@newsletter', true);
await sock.updateNewsletterMetadata('jid@newsletter', { name: 'Nama Baru', description: 'Desc baru' });

// kirim ke saluran
await sock.sendMessage('jid@newsletter', { text: 'Post pertama' });
await sock.sendMessage('jid@newsletter', { image: { url: 'https://...' }, caption: 'Foto' });

// react ke post saluran
await sock.newsletterReactMessage('jid@newsletter', serverId, '👍');
```

---

## JID Utilities

```js
import {
    jidNormalizedUser,
    jidDecode,
    jidEncode,
    normalizeMentionJid,
    resolveJid,
    resolveJids,
    areJidsSameUser,
    isJidGroup,
    isJidBroadcast,
    isJidNewsletter,
    isJidStatusBroadcast,
    isJidBot,
    isJidMetaAI,
    isJidUser,
    isLidUser,
    isPnUser
} from 'hiura-baileys';

jidNormalizedUser('628111@s.whatsapp.net:0')   // '628111@s.whatsapp.net'
jidDecode('628111@s.whatsapp.net')              // { user: '628111', server: 's.whatsapp.net' }
jidEncode('628111', 's.whatsapp.net')           // '628111@s.whatsapp.net'
normalizeMentionJid('628111@lid')               // '628111@s.whatsapp.net'
resolveJid('6281234567890')                     // '6281234567890@s.whatsapp.net'
resolveJids(['628111', '628222'])               // ['628111@s.whatsapp.net', '628222@s.whatsapp.net']
areJidsSameUser('628111@s.whatsapp.net', '628111@lid')  // true
isJidGroup('120363000@g.us')                    // true
isJidNewsletter('123@newsletter')               // true
isLidUser('628111@lid')                         // true
```

---

## Decrypt Handler

Fungsi untuk decrypt pesan terenkripsi. Semua sudah diintegrasikan otomatis di `processMessage` — tidak perlu setup tambahan. Event berikut otomatis di-emit:

- `decryptEventEdit` → emit `messages.update`
- `decryptComment` → emit `messages.upsert`
- `decryptReaction` → emit `messages.upsert`

Kalau butuh decrypt manual:

```js
import {
    decryptPollVote,
    decryptEventResponse,
    decryptEventEdit,
    decryptComment,
    decryptReaction
} from 'hiura-baileys';

// poll vote
const vote = decryptPollVote(
    { encPayload, encIv },
    { pollCreatorJid, pollMsgId, pollEncKey, voterJid }
);

// event response
const response = decryptEventResponse(
    { encPayload, encIv },
    { eventCreatorJid, eventMsgId, eventEncKey, responderJid }
);

// event edit (v1.5.0+)
const edit = decryptEventEdit(
    { encPayload, encIv },
    { eventCreatorJid, eventMsgId, eventEncKey, responderJid }
);

// comment (v1.5.0+)
const comment = decryptComment(
    { encPayload, encIv },
    { commentCreatorJid, commentMsgId, commentEncKey, commentJid }
);

// reaction (v1.5.0+)
const reaction = decryptReaction(
    { encPayload, encIv },
    { reactionCreatorJid, reactionMsgId, reactionEncKey, reactionJid }
);
```

---

## In-Memory Store

```js
import { makeInMemoryStore } from 'hiura-baileys';
import pino from 'pino';

const store = makeInMemoryStore({ logger: pino({ level: 'silent' }) });

// baca/tulis ke file
store.readFromFile('./data/store.json');
setInterval(() => store.writeToFile('./data/store.json'), 10_000);

const sock = makeWASocket({
    auth: state,
    getMessage: async (key) => store.loadMessage(key.remoteJid, key.id)?.message,
    cachedGroupMetadata: async (jid) => store.groupMetadata[jid]
});

store.bind(sock.ev);

// akses data
store.chats                          // semua chat
store.messages['jid@g.us'].array    // semua pesan di jid tertentu
store.contacts                       // semua kontak
store.groupMetadata                  // metadata grup yang sudah di-fetch
store.loadMessage(jid, id)           // cari pesan by id
```

---

## Auth State

```js
import {
    useMultiFileAuthState,
    useSingleFileAuthState,
    useMongoFileAuthState,
    makeCacheableSignalKeyStore,
    addTransactionCapability,
    initAuthCreds
} from 'hiura-baileys';

// default — simpan ke folder
const { state, saveCreds } = await useMultiFileAuthState('./sessions');

// simpan ke satu file json
const { state, saveCreds } = await useSingleFileAuthState('./session.json');

// MongoDB
const { state, saveCreds } = await useMongoFileAuthState(mongoCollection);

// dengan cache (performa lebih baik)
const sock = makeWASocket({
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger)
    }
});
```

---

## Menangani Pesan Masuk

```js
sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const m of messages) {
        if (!m.message) continue;
        if (m.key.fromMe) continue;   // skip pesan sendiri

        const jid = m.key.remoteJid;
        const sender = m.key.participant || jid;    // participant untuk grup

        // ambil isi teks
        const text = m.message?.conversation
            || m.message?.extendedTextMessage?.text
            || m.message?.imageMessage?.caption
            || m.message?.videoMessage?.caption
            || '';

        // cek quoted
        const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const quotedKey = {
            id: m.message?.extendedTextMessage?.contextInfo?.stanzaId,
            remoteJid: m.message?.extendedTextMessage?.contextInfo?.remoteJid || jid,
            participant: m.message?.extendedTextMessage?.contextInfo?.participant
        };

        // download media
        if (m.message?.imageMessage) {
            const buffer = await downloadMediaMessage(m, 'buffer', {});
        }
    }
});

// update status pesan (read receipt dll.)
sock.ev.on('messages.update', (updates) => {
    for (const { key, update } of updates) {
        console.log(key, update);
    }
});

// reaction
sock.ev.on('messages.reaction', (reactions) => {
    for (const { key, reaction } of reactions) {
        console.log(key, reaction.text);
    }
});

// poll update
sock.ev.on('messages.upsert', ({ messages }) => {
    for (const m of messages) {
        if (m.message?.pollUpdateMessage) {
            // handle poll vote
        }
    }
});
```

---

## Tipografi & contextInfo

```js
// bold
await sock.sendMessage(jid, { text: '*teks bold*' });

// italic
await sock.sendMessage(jid, { text: '_teks italic_' });

// strikethrough
await sock.sendMessage(jid, { text: '~teks coret~' });

// monospace
await sock.sendMessage(jid, { text: '`kode`' });

// pesan dengan externalAdReply (banner iklan style)
await sock.sendMessage(jid, {
    text: 'Teks utama',
    contextInfo: {
        externalAdReply: {
            title: 'Judul Banner',
            body: 'Deskripsi',
            mediaType: 1,
            thumbnailUrl: 'https://.../thumb.jpg',
            sourceUrl: 'https://...',
            mediaUrl: 'https://...',
            showAdAttribution: false,
            renderLargerThumbnail: true
        }
    }
});

// forward message dengan skor
await sock.sendMessage(jid, {
    forward: m,
    force: true  // paksa forward walaupun sudah pernah diforward
});
```

---

## DisconnectReason

```js
import { DisconnectReason } from 'hiura-baileys';

// semua nilai
DisconnectReason.connectionClosed       // 428
DisconnectReason.connectionLost         // 408
DisconnectReason.connectionReplaced     // 440
DisconnectReason.timedOut              // 408
DisconnectReason.loggedOut             // 401
DisconnectReason.badSession            // 500
DisconnectReason.connectionError       // 500
DisconnectReason.multideviceMismatch   // 411
DisconnectReason.forbidden             // 403
DisconnectReason.unavailableService    // 503
DisconnectReason.restartRequired       // 515

// contoh penggunaan
sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
        const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) start();
        else console.log('Session expired, perlu scan ulang');
    }
});
```

---

## Browsers

```js
import { Browsers } from 'hiura-baileys';

// preset browser yang tersedia
Browsers.ubuntu('Chrome')
Browsers.macOS('Desktop')
Browsers.windows('Edge')
Browsers.baileys('Desktop')    // default
Browsers.appropriate('Chrome')

// pakai di config
const sock = makeWASocket({
    browser: Browsers.ubuntu('Chrome'),
    ...
});
```

---

## FAQ

**Button/interactive tidak muncul di grup**

Tambahkan `additionalNodes` saat `relayMessage`:

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

**Mention LID tidak jalan di grup**

```js
import { normalizeMentionJid } from 'hiura-baileys';

const fixedJid = normalizeMentionJid(lidJid);
await sock.sendMessage(groupJid, {
    text: `@${fixedJid.split('@')[0]} halo`,
    mentions: [fixedJid]
});
```

**Session logout terus**

- Pastikan `sock.ev.on('creds.update', saveCreds)` terpasang
- Jangan jalankan dua instance dengan folder session yang sama
- Hapus folder session lalu scan ulang: `rm -rf ./sessions`

**CJS `require()` hasilnya undefined**

Pastikan pakai `await` sebelum akses konstanta enum pertama kali, atau gunakan `require('hiura-baileys').ready.then(...)`. Paling gampang: `await useMultiFileAuthState()` sudah cukup untuk memastikan semua siap.

**Error `sharp` saat sendMessage album/stickerPack**

Install sharp: `npm install sharp`

---

## Changelog

### v1.5.0
- Port `decryptEventEdit`, `decryptComment`, `decryptReaction` dan handler otomatisnya di processMessage
- Tambah `meLid = creds.me?.lid` di processMessage
- Quoted message: `quotedType = EXPLICIT` + `threadId VIEW_REPLIES` di grup
- Fix shop API dual style: `{ shop: { surface, id } }` dan `{ shop: surface, id }` keduanya support
- TypeScript declarations lengkap untuk semua tipe button/interactive
- CJS wrapper diperbarui: 183 → 317 exports (DisconnectReason, Browsers, dan semua utils sekarang tersedia di CJS)

### v1.4.0
- Fix `isJidNewsletter` error pada lazy-load `waUploadToServer`
- Fix carousel crash `upload is not a function`
- Fix `ptvMessage` return type
- Tambah `normalizeMentionJid`, `resolveJid`, `resolveJids`
- Tambah `getEphemeralGroup` dan auto ephemeral detect di sendMessage
- Konversi `hiura-advanced.js` ke ESM proper

### v1.2.1
- Hiura Engine: handleInteractive, handleInteractiveButtons, handleAlbum, handlePayment, handleProduct, handleEvent, handleGroupStory
- Rich messages: sendTable, sendTableV2, sendCodeBlock, sendCodeBlockV2, sendLatex, sendLatexImage, sendLink, sendLinkV2, sendRichMessage, sendUnifiedResponse, sendPreview
- Full source maps

### v1.0.0
- Base dari blckrose-baileys
- Full LID + JID support
- Semua tipe interactive button (native flow)
- Pairing code, carousel, album
- ESM + CJS dual support

---

## Lisensi

2026 Nimzz

Proyek ini tidak berafiliasi dengan WhatsApp Inc. atau Meta Platforms.
