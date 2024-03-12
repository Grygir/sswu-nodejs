import http from 'http';
import serverConfig from '../../src/config/server.config.js';

const { RECOMMENDATIONS_HOST, RECOMMENDATIONS_PORT } = serverConfig;

const restApiCall = async ({ body, ...options }) => {
    options = {
        host: RECOMMENDATIONS_HOST,
        port: RECOMMENDATIONS_PORT,
        headers: {
            'Content-Type': 'application/json',
        },
        ...options
    }

    return new Promise((resolve, reject) => {
        const req = http.request(options, res => {
            const chunks = [];
            res.on('data', data => chunks.push(data))
            res.on('end', () => {
                let resBody = Buffer.concat(chunks);
                switch(res.headers['content-type']) {
                    case 'application/json':
                        resBody = JSON.parse(resBody.toString('utf8'));
                        break;
                }
                resolve(resBody)
            })
        })
        req.on('error', reject);
        if (body) {
            req.write(body);
        }
        req.end();
    })
}

export const addAction = async (data, options) => {
    options = {
        path: `/api/actions`,
        method: 'POST',
        body: JSON.stringify(data),
        ...options
    }
    return restApiCall(options)
}
