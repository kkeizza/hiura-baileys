'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.hiuraDecrypt = exports.hiuraHash = void 0;

const crypto = require('crypto');

const _getKey = () => {
    const parts = [
        '68','69','75','72','61',       // hiura
        '2d','62','61','69','6c','65',  // -baile
        '79','73','2d','31','2e','30'   // ys-1.0
    ];
    return Buffer.concat(parts.map(h => Buffer.from(h, 'hex'))).toString('utf8');
};

const hiuraHash = (data) => {
    const h1 = crypto.createHash('sha512');
    h1.update(_getKey() + '_hiura_nimzz');
    const r1 = h1.digest();

    const h2 = crypto.createHash('sha256');
    h2.update(r1.slice(0, 32));
    const key = h2.digest();

    const h3 = crypto.createHash('md5');
    h3.update(key.toString('hex'));
    const finalKey = h3.digest();

    const iv = Buffer.from('hiura-nimzz-2025').slice(0, 16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let result = decipher.update(data, 'hex', 'utf8');
    result += decipher.final('utf8');
    return result;
};
exports.hiuraHash = hiuraHash;

const hiuraDecrypt = (data) => {
    return hiuraHash(data);
};
exports.hiuraDecrypt = hiuraDecrypt;

// Legacy aliases (supaya file lain yang masih pakai nama lama tidak error)
exports.sudahBasibasiAjaLu = hiuraHash;
exports.minimalKaloMauDecryptYangPinterDek = hiuraDecrypt;
