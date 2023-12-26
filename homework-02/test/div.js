import {describe, it} from 'node:test';
import assert from 'node:assert';
import div from '../lib/div.js'

describe('Subtraction', () => {
    it('invalid arguments', () => {
        assert.throws(() => div());
        assert.throws(() => div(2));
        assert.throws(() => div(null, 2));
        assert.throws(() => div('2', 2));
        assert.throws(() => div(Number.NaN, 2));
    });

    it('division by zero', () => {
        assert.throws(() => div(2, 0));
    });

    it('valid number arguments', () => {
        assert.strictEqual(div(2, 2), 1);
        assert.strictEqual(div(2, -2, 0.125), -8);
        assert.strictEqual(div(2, 4, 2), .25);
        assert.strictEqual(div(6.282, 2), 3.141);
    });

    it('corner case with infinite numbers', () => {
        assert.strictEqual(div(Infinity, Infinity), NaN);
        assert.strictEqual(div(Infinity, -Infinity), NaN);
    });
});
