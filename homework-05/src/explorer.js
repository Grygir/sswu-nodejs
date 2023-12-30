import fs from 'fs/promises';
import path from 'path';
import Resource from "./resource.js";

class Explorer {
    constructor(rootDir, currentDir) {
        if (currentDir.indexOf(rootDir) !== 0) {
            throw new Error('Attempt to explore file outside of root dir');
        }
        this._rootDir = rootDir;
        this._currentDir = currentDir;
    }

    async getResources() {
        const names = await fs.readdir(this._currentDir);

        if (this._currentDir !== this._rootDir) {
            names.unshift('../');
        }

        const paths = names.map(basename => path.resolve(this._currentDir, basename));
        const stats = await Promise.all(paths.map(pathname => fs.stat(pathname)));

        return names.map((basename, i) => new Resource({
            basename,
            pathname: paths[i],
            rootDir: this._rootDir,
            stat: stats[i]
        }));
    }
}
export default Explorer;
