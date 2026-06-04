import chalk from 'chalk';
import gradient from 'gradient-string';

const _g = gradient(['#a855f7', '#6366f1', '#06b6d4']);
const _hiura = {
    line  : chalk.hex('#6366f1')('═'.repeat(60)),
    logo  : _g.multiline([
        '  _  _ _  _   _ ___   _   ',
        ' | || | || | | | _ \\ /_\\  ',
        ' | __ | || |_| |   // _ \\ ',
        ' |_||_|_| \\___/|_|_/_/ \\_\\',
    ].join('\n')),
    name  : chalk.bold.hex('#a855f7')('  ⬡  HIURA BAILEYS  ') + chalk.hex('#6366f1')('v1.1.0'),
    by    : chalk.hex('#06b6d4')('  ◈  By       : ') + chalk.bold.white('Nimzz') + chalk.dim(' · github.com/Nimzz-pemboy'),
    repo  : chalk.hex('#06b6d4')('  ◈  GitHub   : ') + chalk.bold.cyan('github.com/Nimzz-pemboy/hiura-baileys'),
    feat  : chalk.hex('#f59e0b')('  ✦  Added    : ') + chalk.white('Hiura Engine, RichMessages, Album, Latex, SourceMaps'),
    thanks: chalk.hex('#10b981')('  ✦  Thanks for using Hiura Baileys! Keep building~ 🚀'),
};
console.log('\n' + _hiura.line);
console.log(_hiura.logo);
console.log(_hiura.line);
console.log(_hiura.name);
console.log(_hiura.by);
console.log(_hiura.repo);
console.log(_hiura.feat);
console.log(_hiura.line);
console.log(_hiura.thanks);
console.log(_hiura.line + '\n');

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
export { Hiura } from './Socket/hiura.js';
export * from './Utils/rich-messages.js';
export { makeWASocket };
export default makeWASocket;
//# sourceMappingURL=index.js.map
