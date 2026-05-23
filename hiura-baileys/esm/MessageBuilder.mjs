// hiura-baileys MessageBuilder — ESM wrapper
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { VERSION, Button, ButtonV2, Carousel, AIRich } = require('../MessageBuilder.js');

export { VERSION, Button, ButtonV2, Carousel, AIRich };
export default { VERSION, Button, ButtonV2, Carousel, AIRich };
