"use strict";

const chalk = require("chalk");
const { version } = require("../package.json");

// RGB gradient helper — warnain tiap karakter
function rgb(text, colors) {
    return text.split('').map((char, i) => {
        const [r, g, b] = colors[i % colors.length];
        return chalk.rgb(r, g, b)(char);
    }).join('');
}

// Palet warna RGB buat gradient
const rainbow = [
    [255, 100, 180], // pink
    [200,  80, 255], // ungu
    [100, 160, 255], // biru muda
    [ 80, 220, 255], // cyan
    [100, 255, 180], // hijau mint
    [180, 255, 100], // lime
    [255, 220,  80], // kuning
    [255, 140,  80], // oranye
];

const logo = [
    "  _  _ _  _   _ ___   _   ",
    " | || | || | | | _ \\ /_\\  ",
    " | __ | || |_| |   // _ \\ ",
    " |_||_|_| \\___/|_|_/_/ \\_\\",
];

console.log('');
logo.forEach(line => console.log(' ' + rgb(line, rainbow)));
console.log('');

const divider = rgb(' ══════════════════════════════', rainbow);

console.log(divider);
console.log(
    ' ' + rgb('◈', [[255,100,180]]) + ' ' +
    chalk.bold.white('Hiura Baileys') + ' ' +
    chalk.hex('#a0a0a0')(`v${version}`)
);
console.log(
    ' ' + rgb('◈', [[100,200,255]]) + ' ' +
    chalk.white('By ') + rgb('Nimzz', [[255,100,180],[200,80,255],[100,160,255],[80,220,255],[100,255,180]])
);
console.log(
    ' ' + rgb('◈', [[100,255,180]]) + ' ' +
    chalk.hex('#a0a0a0')('github.com/') + chalk.white('Nimzz-pemboy')
);
console.log(divider);
console.log('');
console.log(
    ' ' + rgb('♡', [[255,150,150]]) +
    chalk.hex('#d0d0d0')(' Makasih udah pake ') +
    rgb('Hiura Baileys', rainbow) +
    chalk.hex('#d0d0d0')('!')
);
console.log(
    ' ' + chalk.hex('#808080')('  Keep building, keep grinding~ 🚀')
);
console.log('');

const _hiuraUtils = require("./Utils/hiura-crypto-utils");

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeWASocket = void 0;
const Socket_1 = __importDefault(require("./Socket"));
exports.makeWASocket = Socket_1.default;
__exportStar(require("../WAProto"), exports);
__exportStar(require("./Utils"), exports);
__exportStar(require("./Types"), exports);
__exportStar(require("./Store"), exports);
__exportStar(require("./Defaults"), exports);
__exportStar(require("./WABinary"), exports);
__exportStar(require("./WAM"), exports);
__exportStar(require("./WAUSync"), exports);

exports.default = Socket_1.default;
