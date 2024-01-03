import stream from 'stream';
import {StringDecoder} from 'string_decoder';

/**
 * Generates stream of random sentences from provided sentences list until certain text length is reached
 */
class SentencesStream extends stream.Readable {
    TEXT_SIZE_THRESHOLD = 1048578;

    constructor(opts = {}) {
        const {sentences, textSizeThreshold, ...restOpts} = opts;
        if (!sentences || !Array.isArray(sentences) || !sentences.length) {
            throw new Error('Missing required option "sentences" or it\'s empty');
        }
        super(restOpts);
        this.sentences = sentences;
        this.textSizeThreshold = textSizeThreshold || this.TEXT_SIZE_THRESHOLD;
        this.written = 0;
    }

    _read(size) {
        if (this.written < this.textSizeThreshold) {
            const sentence = this.sentences[Math.floor(Math.random() * this.sentences.length)];
            let buffer = Buffer.from((this.written ? ' ' : '') + sentence.trim());
            const bytesLeftToWrite = this.textSizeThreshold - this.written;
            if (buffer.length > bytesLeftToWrite) {
                const decoder = new StringDecoder('utf8');
                const bufferChunk = buffer.subarray(0, bytesLeftToWrite);
                const stringChunk = decoder.write(bufferChunk);
                buffer = Buffer.from(stringChunk);
            }
            this.written += buffer.length;
            this.push(buffer);
        } else {
            this.push(null);
        }
    }
}

export default SentencesStream;
