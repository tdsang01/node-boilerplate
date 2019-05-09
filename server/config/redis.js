import dotEnv from 'dotenv';
dotEnv.config();

module.exports = {
    production: {
        host: 'localhost',
        port: 6379,
        auth_pass: process.env.REDIS_AUTH_PASS
    },
    development: {
        host: 'localhost',
        port: 6379,
        auth_pass: ''
    }

};
