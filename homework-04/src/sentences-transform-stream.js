import stream from "stream";
import {StringDecoder} from "string_decoder";

/**
 * Transforms default chunks to chunks by sentences
 */
class SentencesTransformStream extends stream.Transform {
    DEFAULT_ENCODING = 'utf8';

    constructor(opts = {}) {
        super(opts);
        const {encoding = this.DEFAULT_ENCODING} = opts;
        this._decoder = new StringDecoder(encoding);
        this._remnant = '';
    }

    _write(chunk, encoding, cb) {
        this._remnant += this._decoder.write(chunk);
        const sentences = this._remnant.split(/(?<=\.\s)/g);
        this._remnant = sentences.pop();
        sentences.forEach(sentence => this.push(sentence));
        cb();
    }
}

export default SentencesTransformStream;
