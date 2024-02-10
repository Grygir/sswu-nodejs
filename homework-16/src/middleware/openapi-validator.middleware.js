import validator from 'express-openapi-validator';

export default validator.middleware({
    apiSpec: './swagger.json',
    validateResponses: {
        onError: (error, body) => {
            console.debug(error);
            console.debug(body);
        },
    }
})
