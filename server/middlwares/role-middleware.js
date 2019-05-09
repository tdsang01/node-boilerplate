import { Roles } from '../config';

export default class RoleMiddleware {
    static isValidRole (role) {
        return (req, res, next) => {
            const roleUser = Roles[req.user.role];
            const roleCheck = Roles[role];
            if (roleUser && roleCheck && roleUser >= roleCheck) {
                return next ? next() : true;
            }
            return next ? next(new Error('PERMISSION_DENIED')) : false;
        }
    }
}
