#!/usr/bin/env node

import {readFile} from 'fs/promises';
import fs from 'fs';
import path from 'path';
import SentencesStream from './src/sentences-stream.js'
import TextAnalyzerStream from './src/text-analyzer-stream.js'

process.on('uncaughtException', err => {
    process.stderr.write(`${err}\n`);
    process.stdout.write(`${helpMessage}\n`);
    process.exit(1);
});

const [,, command, ...args] = process.argv;

const helpMessage = `Use command to generate text:
\tnpx text-util generate <outputFile> <fileSizeThreshold> <sentencesFile>
Or command to analyze text:
\tnpx text-util analyze <sourceFile>`;

switch (command) {
    case '-h':
        console.log(helpMessage);
        break;

    case 'generate':
        const [
            outputFile = './output/text.txt',
            fileSizeThreshold = 1024 * 1024,
            sentencesFile = './defaults/sentences.txt'
        ] = args;

        let contents = '';
        try {
            contents = await readFile(path.resolve(sentencesFile), { encoding: 'utf8' });
        } catch (e) {
            throw new Error(`Cannot read "${sentencesFile}" sentences file`);
        }
        const sentencesStream = new SentencesStream({
            sentences: contents.split('\n'),
            textSizeThreshold: Number(fileSizeThreshold)
        });
        const writeStream = fs.createWriteStream(path.resolve(outputFile));
        sentencesStream.pipe(writeStream);
        sentencesStream.once('close', () => {
            console.log(`${sentencesStream.written} file size is generated`)
        });
        break;

    case 'analyze':
        const [textFile = './output/text.txt'] = args;
        const readStream = fs.createReadStream(path.resolve(textFile));
        const textAnalyzerStream = new TextAnalyzerStream();
        readStream
            .on('error', err => {
                throw new Error(`Cannot open file "${textFile}" for analysis, pleas check if the file exists and has proper permissions`);
            })
            .pipe(textAnalyzerStream)
            .on('finish', () => {
                const stats = textAnalyzerStream.getStats();
                console.log(`Words: ${stats.words},
Total characters: ${stats.characters},
White spaces: ${stats.whiteSpaces}`);
            });
        break;

    default:
        throw new Error(`Command "${command}" is not supported, use "generate" or "analyze"`);

}
