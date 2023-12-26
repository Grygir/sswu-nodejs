import {$} from 'execa';
import {describe, it} from 'node:test';
import assert from 'node:assert';

describe('CLI valid expression', () => {
    it('add', async () => {
        const {stdout} = await $`node ./cli.js 42 + 0.5 + -27`;
        assert.strictEqual(stdout,'15.5');
    });

    it('sub', async () => {
        const {stdout} = await $`node ./cli.js 3.14 - 27 - 9.8`;
        assert.strictEqual(stdout,'-33.66');
    });

    it('mul', async () => {
        const {stdout} = await $`node ./cli.js 3 * 3 * 2`;
        assert.strictEqual(stdout,'18');
    });

    it('div', async () => {
        const {stdout} = await $`node ./cli.js 18 / 3`;
        assert.strictEqual(stdout,'6');
    });
});

describe('CLI literal expression', () => {
    it('add', async () => {
        const {stdout} = await $`node ./cli.js 42 add 0.5 add -27`;
        assert.strictEqual(stdout,'15.5');
    });

    it('sub', async () => {
        const {stdout} = await $`node ./cli.js 3.14 sub 27 sub 9.8`;
        assert.strictEqual(stdout,'-33.66');
    });

    it('mul', async () => {
        const {stdout} = await $`node ./cli.js 3 mul 3 mul 2`;
        assert.strictEqual(stdout,'18');
    });

    it('div', async () => {
        const {stdout} = await $`node ./cli.js 18 div 3`;
        assert.strictEqual(stdout,'6');
    });
});

describe('CLI error', () => {
    it('number of args can not be even', async () => {
        await assert.rejects($`node ./cli.js 42 + 0.5 +`, ({stderr}) => {
            assert.match(stderr, /can not be even/);
            return true;
        });
    });

    it('single type of operation', async () => {
        await assert.rejects($`node ./cli.js 42 + 0.5 / -27`, ({stderr}) => {
            assert.match(stderr, /single type of operation/);
            return true;
        });
    });

    it('Not supported operation', async () => {
        await assert.rejects($`node ./cli.js 12 & 3`, ({stderr}) => {
            assert.match(stderr, /operation "&" is not supported/i);
            return true;
        });
    });
});
