const mongoose = require('mongoose');

const blacklistSchema = mongoose.Schema({
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true }
});

const blacklistModel = mongoose.model('Blacklist', blacklistSchema);

module.exports = {
    blacklistModel
};
