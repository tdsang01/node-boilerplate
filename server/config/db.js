'use strict';

import dotEnv from 'dotenv';
dotEnv.config();

const db = {
    development: {
        URL: process.env.MONGODB_URL,
    },
    test: {
        URI: '',
        IS_DEBUG: true
    },
    staging: {},
    production: {}
};

module.exports = db;

