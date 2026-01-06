const crypto = require("crypto");

module.exports = function hashPhone(phone) {
  return crypto
    .createHash("sha256")
    .update(phone + process.env.HASH_SALT)
    .digest("hex");
};

// console.log(hashPhone("1234567890"));