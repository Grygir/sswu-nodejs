import {describe, it} from 'node:test';
import assert from 'node:assert';
import add from '../lib/add.js'

describe('Addition', () => {
    it('at least two arguments', () => {
        assert.throws(() => add());
        assert.throws(() => add(2));
    });

    it('invalid arguments', () => {
        assert.throws(() => add(null, 2));
        assert.throws(() => add('2', 2));
        assert.throws(() => add(Number.NaN, 2));
    });

    it('valid number arguments', () => {
        assert.strictEqual(add(2, 2), 4);
        assert.strictEqual(add(2, -2), 0);
        assert.strictEqual(add(2, -2, -2), -2);
        assert.strictEqual(add(3.141, 9.8, -2.718), 10.223);
    });

    it('corner case with infinite numbers', () => {
        assert.strictEqual(add(Infinity, Infinity), Infinity);
        assert.strictEqual(add(Infinity, -Infinity), NaN);
    });
});
