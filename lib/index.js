import chalk from 'chalk';
import gradient from 'gradient-string';

// ── Hiura Baileys Banner ──────────────────────────────────────────────────────
const _g = gradient(['#a855f7', '#6366f1', '#06b6d4']);
const _hiura = {
    line  : chalk.hex('#6366f1')('═'.repeat(56)),
    logo  : _g.multiline([
        '  _  _ _  _   _ ___   _   ',
        ' | || | || | | | _ \\ /_\\  ',
        ' | __ | || |_| |   // _ \\ ',
        ' |_||_|_| \\___/|_|_/_/ \\_\\',
    ].join('\n')),
    name  : chalk.bold.hex('#a855f7')('  ⬡  HIURA BAILEYS  ') + chalk.hex('#6366f1')('v1.0.0'),
    by    : chalk.hex('#06b6d4')('  ◈  By       : ') + chalk.bold.white('Nimzz') + chalk.dim(' · github.com/Nimzz-pemboy'),
    repo  : chalk.hex('#06b6d4')('  ◈  GitHub   : ') + chalk.bold.cyan('github.com/Nimzz-pemboy/hiura-baileys'),
    cr1   : chalk.dim.hex('#a78bfa')('  ♡  Base     : blckrose-baileys (Thanks @Blckrose0!)'),
    cr2   : chalk.dim.hex('#a78bfa')('  ♡  Signal   : whiskeysockets/libsignal-node'),
    cr3   : chalk.dim.hex('#a78bfa')('  ♡  Core     : @whiskeysockets/baileys'),
    thanks: chalk.hex('#10b981')('  ✦  Makasih udah pake Hiura Baileys! Keep building~ 🚀'),
};
console.log('\n' + _hiura.line);
console.log(_hiura.logo);
console.log(_hiura.line);
console.log(_hiura.name);
console.log(_hiura.by);
console.log(_hiura.repo);
console.log(_hiura.line);
console.log(_hiura.cr1);
console.log(_hiura.cr2);
console.log(_hiura.cr3);
console.log(_hiura.line);
console.log(_hiura.thanks);
console.log(_hiura.line + '\n');
// ─────────────────────────────────────────────────────────────────────────────

import makeWASocket from './Socket/index.js';
export * from '../WAProto/index.js';
export { proto } from '../WAProto/index.js';
export * from './Utils/index.js';
export * from './Types/index.js';
export * from './Defaults/index.js';
export * from './WABinary/index.js';
export * from './WAM/index.js';
export * from './WAUSync/index.js';
export * from './Store/index.js';
export { makeWASocket };
export default makeWASocket;
//# sourceMappingURL=index.js.map
