module.exports = {
    success: (res, data, status = 200) => {
        const responseData = !!data
            ? { success: true, data: data }
            : { success: true };
        if (res) {
            res.status(status);
            return res.json(responseData);
        }
        return data;
    },
    error: (res, e) => {
        if (typeof e === 'string') {
            e = new Error(e);
        }
        console.error('Error: ', e);
        if (!res) {
            return e;
        }
        let errors = [];
        if (Array.isArray(e) && e.length > 0) {
            errors = e.map(error => {
                return {
                    code: error.message,
                    message: res.__(error.message) !== error.message ? res.__(error.message) : res.__('TECHNICAL_EXCEPTION')
                };
            });
        } else {
            errors = [
                {
                    code: e.message,
                    message: res.__(e.message) !== e.message ? res.__(e.message) : res.__('TECHNICAL_EXCEPTION')
                }
            ]
        }

        if (e.errors) {
            for (const errorKey in e.errors) {
                const errorMessage = res.__(e.errors[errorKey].message) !== e.errors[errorKey].message ? res.__(e.errors[errorKey].message) : res.__('TECHNICAL_EXCEPTION');
                errors.push({
                    code: e.errors[errorKey].message,
                    message: errorMessage
                });
            }
        }

        return res.json({
            success: false,
            errors
        });
    }
};
