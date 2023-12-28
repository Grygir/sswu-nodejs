import stream from "stream";

const wordsRegexp = /(?<![\u0400-\u04ff])(([\u0400-\u04ff\w]+'[\u0400-\u04ff\w]+)|([\u0400-\u04ff\w]+-[\u0400-\u04ff\w]+)|[\u0400-\u04ff\w]+)(?![\u0400-\u04ff])/g;

/**
 * Collects statistics from stream of sentences
 */
class TextAnalyzerStream extends stream.Writable {
    constructor(opts = {}) {
        super(opts);
        this._stats = {
            sentences: 0,
            words: 0,
            letters: 0,
            whiteSpaces: 0,
            characters: 0,
            noLetters: 0
        };
    }

    _write(chunk, encoding, cb) {
        const sentence = chunk.toString();
        this._stats.sentences++;
        this._stats.words += Array.from(sentence.matchAll(wordsRegexp)).length;
        this._stats.characters += sentence.length;
        this._stats.whiteSpaces += sentence.replaceAll(/\S/gm, '').length;
        this._stats.noLetters += sentence.replaceAll(/[\u0400-\u04ff\w\s]/gm, '').length;
        this._stats.letters = this._stats.characters - this._stats.whiteSpaces - this._stats.noLetters;
        cb();
    }

    getStats() {
        return Object.assign({}, this._stats);
    }
}

export default TextAnalyzerStream;
