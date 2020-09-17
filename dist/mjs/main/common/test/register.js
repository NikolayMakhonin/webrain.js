import { assert } from './Assert';
import { describe, it, xdescribe, xit } from './Mocha';
global.assert = assert;
global.describe = describe;
global.it = it;
global.xdescribe = xdescribe;
global.xit = xit;