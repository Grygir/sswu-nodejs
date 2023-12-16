import {describe, it} from 'node:test';
import assert from 'node:assert';
import sub from '../lib/sub.js'

describe('Subtraction', () => {
    it('at least two arguments', () => {
        assert.throws(() => sub());
        assert.throws(() => sub(2));
    });

    it('invalid arguments', () => {
        assert.throws(() => sub(null, 2));
        assert.throws(() => sub('2', 2));
        assert.throws(() => sub(Number.NaN, 2));
    });

    it('valid number arguments', () => {
        assert.strictEqual(sub(2, 2), 0);
        assert.strictEqual(sub(2, -2), 4);
        assert.strictEqual(sub(2, 2, 2), -2);
        assert.strictEqual(sub(3.141, 9.8, 2.718), -9.377);
    });

    it('corner case with infinite numbers', () => {
        assert.strictEqual(sub(Infinity, Infinity), NaN);
        assert.strictEqual(sub(Infinity, -Infinity), Infinity);
    });
});
