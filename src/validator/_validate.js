const Ajv = require('ajv');
const ajv = new Ajv({
    // allErrors: true
});

/**
 * json schema校验
 * @param {Object} schema
 * @param {Object} data
 * @returns {ajv.ErrorObject}
 */
function validate(schema, data = {}) {
    const valid = ajv.validate(schema, data);
    if (!valid) {
        return ajv.errors[0];
    }
}

module.exports = validate;
