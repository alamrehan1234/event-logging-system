const crypto = require('crypto');

const generateHash = (logData) => {
    const logString = JSON.stringify(logData);
    return crypto.createHash('sha256').update(logString).digest('hex');
};

module.exports = generateHash;
