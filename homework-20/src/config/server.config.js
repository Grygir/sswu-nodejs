export default {
    PORT: process.env.PORT || 8080,
    PASSWORD_HASH_ROUNDS: process.env.PASSWORD_HASH_ROUNDS || 10,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'some_access_secret',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'some_refresh_secret',
    RECOMMENDATIONS_HOST: process.env.RECOMMENDATIONS_HOST || 'localhost',
    RECOMMENDATIONS_PORT: process.env.RECOMMENDATIONS_PORT || 8080,
};
