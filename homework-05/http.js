import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import pug from 'pug';
import Explorer from './src/explorer.js';
import mimeType from './src/mime-type.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, './public');
const STATIC_DIR = path.resolve(__dirname, './static');
const PORT = process.env.PORT || 8080;

http.createServer(async (req, res) => {
    const {pathname, query} = url.parse(req.url, true);
    const normPathname = path.normalize(decodeURIComponent(pathname));
    let resource;

    if (normPathname.substring(0, 8) === '/static/') {
        resource = path.resolve(STATIC_DIR, normPathname.substring(8));
    } else {
        resource = path.resolve(ROOT_DIR, `.${normPathname}`);
    }

    let stats;
    try {
        stats = await fs.promises.stat(resource);
    } catch (e) {
        res.writeHead(404);
        res.end(`Not found`);
        return;
    }

    if (stats.isDirectory()) {
        const explorer = new Explorer(ROOT_DIR, resource);
        const resources = await explorer.getResources();
        const content = pug.renderFile('templates/resources.pug', {
            title: normPathname === '/' ? `[root]` : normPathname,
            resources
        });
        res.end(content);

    } else if (stats.isFile()) {
        const stream = fs.createReadStream(resource);
        stream.once('data', () => {
            if ('download' in query || stats.size > 26214400) {
                const filename = encodeURIComponent(path.basename(resource));
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            } else if ('raw' in query) {
                res.setHeader('Content-Type', 'text/plain');
            } else {
                const contentType = mimeType[path.extname(resource).substring(1)] || 'text/plain';
                res.setHeader('Content-Type', contentType);
                res.writeHead(200);
            }
        });
        stream.pipe(res);
        stream.on('error', () => {
            res.writeHead(500);
            res.end(`Cannot read from file "${resource}"`);
        });

    } else {
        res.writeHead(500);
        res.end(`Bad request`);
    }

}).listen(PORT, () => console.log(`Server is listening to port ${PORT}`));
