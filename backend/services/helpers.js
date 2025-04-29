const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

async function hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(plainText, hash) {
    return await bcrypt.compare(plainText, hash);
}

module.exports = {
    hashPassword,
    comparePassword
};
