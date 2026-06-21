exports.ok = (data = {}) => ({ code: 0, message: 'ok', data })
exports.fail = (code, message) => ({ code, message, data: null })
