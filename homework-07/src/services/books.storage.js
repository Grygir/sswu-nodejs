import fs from "fs/promises";
import config from "../../src/config/server.config.js";

/**
 * @returns {Promise<{books: Book[]}>}
 */
async function getFileContent() {
    const  data = await fs.readFile(config.DATA_FILE, {encoding: 'utf8'});
    return JSON.parse(data);
}

/**
 * @param {{books: Book[]}} data
 * @returns {Promise<void>}
 */
async function setFileContent(data) {
    const content = JSON.stringify(data, null, "  ");
    await fs.writeFile(config.DATA_FILE, content, {encoding: 'utf8'});
}

export {getFileContent, setFileContent}
