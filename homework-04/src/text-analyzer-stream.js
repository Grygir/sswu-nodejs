import stream from 'stream';
import {StringDecoder} from 'string_decoder';

/**
 * Collects statistics from stream of sentences
 */
class TextAnalyzerStream extends stream.Writable {
    DEFAULT_ENCODING = 'utf8';

    constructor(opts = {}) {
        super(opts);
        const {encoding = this.DEFAULT_ENCODING} = opts;
        this._decoder = new StringDecoder(encoding);
        this._remnant = '';
        this._stats = {
            characters: 0,
            words: 0,
            whiteSpaces: 0
        };
    }

    _write(chunk, encoding, cb) {
        let text;
        this._remnant += this._decoder.write(chunk);
        const lastSpaceIndex = this._remnant.lastIndexOf(' ');
        if (lastSpaceIndex !== -1) {
            text = this._remnant.slice(0, lastSpaceIndex);
            this._remnant = this._remnant.slice(lastSpaceIndex);
        } else {
            text = this._remnant;
            this._remnant = '';
        }
        this._gatherStatistic(text);
        cb();
    }

    _gatherStatistic(text) {
        this._stats.characters += text.length;
        const parts = text.split(/\s/);
        this._stats.words += parts.filter(part => part && part.match(/[\u0400-\u04ff\w]/)).length;
        this._stats.whiteSpaces += parts.length - 1;
    }

    _final(cb) {
        this._gatherStatistic(this._remnant);
        this._remnant = '';
        cb();
    }

    getStats() {
        return Object.assign({}, this._stats);
    }
}

export default TextAnalyzerStream;
