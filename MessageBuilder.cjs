'use strict';
/**
 * hiura-baileys MessageBuilder — CJS wrapper
 * By Nimzz · github.com/Nimzz-pemboy
 */

let _mod = null;
let _loadPromise = null;

function _load() {
    if (_loadPromise) return _loadPromise;
    _loadPromise = import('./lib/MessageBuilder.js').then(mod => { _mod = mod; }).catch(e => { throw e; });
    return _loadPromise;
}

const _wrap = (name) => function(...args) {
    if (!_mod) throw new Error('[hiura-baileys] MessageBuilder belum siap, gunakan await');
    return new _mod[name](...args);
};

const handler = {
    get(_, key) {
        if (_mod && key in _mod) return _mod[key];
        if (['Button','ButtonV2','Carousel','AIRich','VERSION'].includes(key)) {
            if (_mod) return _mod[key];
            _load();
            return undefined;
        }
        return undefined;
    }
};

_load();
module.exports = new Proxy({}, handler);
