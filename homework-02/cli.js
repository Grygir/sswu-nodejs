#!/usr/bin/env node

import * as calc from './index.js';

process.on('uncaughtException', err => {
    process.stderr.write(`${err}\n`);
    process.exit(1);
});

const [,, ...args] = process.argv;

if (args.length % 2 === 0) {
    throw new Error('Number of params and operations can not be even');
}

const [rawParams, operations] =
    args.reduce((res, args, i) => res[i%2].push(args) && res, [[], []]);

const [operation, ...restOperations] =
    operations.filter((operation, i, arr) => arr.indexOf(operation) === i);
if (restOperations.length) {
    throw new Error('Only single type of operation is supported for the moment');
}

const params = rawParams.map(Number);

switch (operation) {
    case '+':
    case 'add':
        process.stdout.write(`${calc.add(...params)}\n`);
        process.exit(0);
        break;
    case '-':
    case 'sub':
        process.stdout.write(`${calc.sub(...params)}\n`);
        process.exit(0);
        break;
    case '*':
    case 'mul':
        process.stdout.write(`${calc.mul(...params)}\n`);
        process.exit(0);
        break;
    case '/':
    case 'div':
        process.stdout.write(`${calc.div(...params)}\n`);
        process.exit(0);
        break;
    default:
        throw new Error(`Operation "${operation}" is not supported for the moment`);
}
