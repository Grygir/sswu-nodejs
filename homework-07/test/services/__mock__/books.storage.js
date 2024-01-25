import fs from "fs/promises";
import config from "../../../src/config/server.config.js";

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
    // No changes in data storage
}

export {getFileContent, setFileContent}
