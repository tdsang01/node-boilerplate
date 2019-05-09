function findMiddleware(next) {
    const filter = this.getQuery();
    if (filter.deletedAt === undefined) {
        filter.deletedAt = null;
    }
    next();
}

export default function(schema, options) {
    schema.pre('find', findMiddleware);
    schema.pre('findOne', findMiddleware);
    schema.pre('count', findMiddleware);
}
