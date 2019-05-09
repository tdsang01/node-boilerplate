import Joi from 'joi';

export default class BaseValidation {
    static validatePagination() {
        return BaseValidation.validate(
            {
                query: {
                    limit: Joi.number().required().min(1).max(200).error(new Error('INVALID_LIMIT')),
                    page: Joi.number().required().min(1).max(1000).error(new Error('INVALID_PAGE'))
                }
            },
            {
                stripUnknown: true
            }
        );
    }

    static validatePaginationLastId(validateKeys = 'lastId') {
        return BaseValidation.validate(
            {
                query: {
                    [validateKeys]: Joi.string().regex(/^[a-fA-F0-9]{24}$/).error(new Error(`${validateKeys.toUpperCase()}_INVALID_MONGODB_OBJECT_ID`)),
                    limit: Joi.number().required().min(1).max(20).error(new Error('INVALID_LIMIT'))
                }
            },
            {
                stripUnknown: true
            }
        );
    }

    static validateObjectId(validateKeys = 'id') {
        const validateData = {};
        if (!Array.isArray(validateKeys)) {
            validateData[validateKeys] = Joi.string().regex(/^[a-fA-F0-9]{24}$/).error(new Error(`${validateKeys.toUpperCase()}_INVALID_MONGODB_OBJECT_ID`));
        } else {
            for (const key of validateKeys) {
                validateData[key] = Joi.string().regex(/^[a-fA-F0-9]{24}$/).error(new Error(`${validateKeys.toUpperCase()}_INVALID_MONGODB_OBJECT_ID`));
            }
        }
        return BaseValidation.validate({
            params: validateData
        });
    }

    static validate(data, options = { stripUnknown: false })  {
        return (req, res, next) => {
            const key = Object.keys(data)[0];
            Joi.validate(req[key], Joi.object().keys(data[key]).options(options), (e) => {
                if (e) {
                    return next(e);
                }
                if (key === 'query') {
                    const { limit, page } = req[key];
                    req[key].limit = !!limit ? parseInt(limit) : undefined;
                    req[key].page = !!page ? parseInt(page) : undefined;
                }
                return next();
            });
        }
    }
}

