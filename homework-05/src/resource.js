import path from 'path';

const SCRIPTS = ['html', 'js', 'css'];

class Resource {
    /**
     *
     * @param data
     * @param {string} data.basename - the last portion of a path.
     * @param {string} data.pathname - full path of resource in file system.
     * @param {string} data.rootDir - full path to root directory.
     * @param {Stats} data.stat - provides information about a file.
     */
    constructor(data) {
        this._data = data;
    }

    get name() {
        return this._data.basename;
    }

    get link() {
        return '/' + path.relative(this._data.rootDir, this._data.pathname);
    }

    get extname() {
        return path.extname(this._data.basename);
    }

    get isDirectory() {
        return this._data.stat.isDirectory();
    }

    get isFile() {
        return this._data.stat.isFile();
    }

    get isScript() {
        return SCRIPTS.indexOf(this.extname.substring(1)) !== -1;
    }
}

export default Resource;
