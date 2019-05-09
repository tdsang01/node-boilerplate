import { omit } from 'lodash';

export default class BaseModelClass {
    static async _getAll(params) {
        params = Object.assign(
            {
                where: null,
                limit: 1000,
                skip: 0,
                sort: { createdAt: -1 },
                select: null,
                isLean: true,
                populate: ''
            },
            params
        );
        return await this
            .find(params.where)
            .limit(params.limit)
            .skip(params.skip)
            .sort(params.sort)
            .select(params.select)
            .lean(params.isLean)
            .populate(params.populate);
    }

    static async _getOne(params) {
        params = Object.assign(
            {
                where: null,
                select: null,
                populate: '',
                sort: { createdAt: -1 },
                isLean: true
            },
            params
        );
        return await this
            .findOne(params.where)
            .select(params.select)
            .populate(params.populate)
            .sort(params.sort)
            .lean(params.isLean);
    }

    static async _create(data, options) {
        const omits = getOmits(this.REMOVE_FIELDS, options);
        data = omit(data, omits);
        return await this.create(data);
    }

    static async _update(data, options) {
        const omits = getOmits(this.REMOVE_FIELDS, options);
        data.set = omit(data.set, omits);
        if (!data.where) {
            throw new Error('MISSING_CONDITION')
        }
        data.where.deletedAt = null;
        const result = await this.updateOne(data.where, { $set: data.set }, data.options);
        if (result.nModified === 0) {
            throw new Error('ACTION_FAILED');
        }
        return result;
    }

    static async _softDelete(data) {
        if (!data.where) {
            throw new Error('MISSING_CONDITION')
        }
        data.where.deletedAt = null;
        const result = await this.updateOne(data.where, { $set: { deletedAt: new Date() }});
        if (result.nModified === 0) {
            throw new Error('DELETE_FAILED');
        }
        return result;
    }

    static async _delete(data) {
        return await this.deleteOne(data.where);
    }

    static async _createOrUpdate(data) {
        const result = await this.findOne(data.where);
        if (!result) {
            return this.create(data.create ? data.create : data.where);
        } else {
            return this.updateOne(data.where, data.update);
        }
    }
}

function getOmits(defaultOmits, options) {
    let removeFields = [];
    if (options && options.removeFields) {
        removeFields = options.removeFields;
    }
    let results = defaultOmits || removeFields;
    if (Array.isArray(defaultOmits)) {
        results = defaultOmits.concat(removeFields);
    }
    return results;
}
