'use strict';

import Passport from 'passport';

export default class AuthMiddleware {

    static isAuth (req, res, next) {
        return Passport.authenticate('jwt', { session: false }, (err, user, info) => {
            req.user = user;
            return next(AuthMiddleware.handleError(err, info));
        })(req, res, next);
    }

    static isOptionalAuth (req, res, next) {
        return Passport.authenticate('jwt', { session: false }, (err, user, info) => {
            req.user = user;
            return next();
        })(req, res, next);
    }

    static handleError (err, info) {
        if (err) {
            return err;
        }
        if (info) {
            return info;
        }
    }
}
