import validator from 'express-openapi-validator';

export default validator.middleware({
    apiSpec: './swagger.json'
})
