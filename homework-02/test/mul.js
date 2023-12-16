import {describe, it} from 'node:test';
import assert from 'node:assert';
import mul from '../lib/mul.js'

describe('Multiplication', () => {
    it('at least two arguments', () => {
        assert.throws(() => mul());
        assert.throws(() => mul(2));
    });

    it('invalid arguments', () => {
        assert.throws(() => mul(null, 2));
        assert.throws(() => mul('2', 2));
        assert.throws(() => mul(Number.NaN, 2));
    });

    it('valid number arguments', () => {
        assert.strictEqual(mul(2, 2), 4);
        assert.strictEqual(mul(2, -2), -4);
        assert.strictEqual(mul(2, 2, 2), 8);
        assert.strictEqual(mul(3.141, 2), 6.282);
    });

    it('corner case with infinite numbers', () => {
        assert.strictEqual(mul(Infinity, Infinity), Infinity);
        assert.strictEqual(mul(Infinity, -Infinity), -Infinity);
    });
});
