import {assert} from './Assert'
import {describe, it, xdescribe, xit} from './Mocha'

(global as any).assert = assert;
(global as any).describe = describe;
(global as any).it = it;
(global as any).xdescribe = xdescribe;
(global as any).xit = xit
