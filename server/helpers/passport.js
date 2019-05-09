import PassportJwt from 'passport-jwt';
import { jwtCredentials } from '../config';
import { User } from '../models';

const JwtStrategy = PassportJwt.Strategy;
const { ExtractJwt } = PassportJwt;
const jwtOptions = {
    secretOrKey: jwtCredentials.publicKey,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer')
};

const jwt = async (payload, done) => {
    try {
        const user = await User._getOne({
            where: {
                _id: payload.user._id
            },
            select: '_id role changePasswordAt'
        });
        if (!user) {
            return done(new Error('USERNAME_OR_PASSWORD_INCORRECT'), false);
        }
        if (user.changePasswordAt && new Date(user.changePasswordAt).toString() !== new Date(payload.user.changePasswordAt).toString()) {
            return done(new Error('AUTHENTICATION_FAILED'), false);
        }
        return done(null, user);
    } catch (e) {
        return done(e, false);
    }
};

module.exports = {
    jwt: new JwtStrategy(jwtOptions, jwt),
};

