'use strict';
import Mongoose from './init-mongoose';
import Util from 'util';

module.exports = {
    connect: async (db) => {
        await await Mongoose.connect(db.URL, {
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 500, // Reconnect every 500ms
            poolSize: 10, // Maintain up to 10 socket connections
            // If not connected, return errors immediately rather than waiting for reconnect
            bufferMaxEntries: 0,
            connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            useNewUrlParser: true,
            useCreateIndex: true
        });
        Mongoose.connection.on('error', () => {
            throw new Error(`Unable to connect to database.`);
        });
        if (db.IS_DEBUG) {
            const debug = require('debug')('express-mongoose-es6-rest-api:index');
            Mongoose.set('debug', (collectionName, method, query, doc) => {
                debug(`${collectionName}.${method}`, Util.inspect(query, false, 20), doc);
            });
        }
    }
};
