const mongoose = require('mongoose');

const cachedResponseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        response: {
            type: JSON,
            required: true
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now(),
            expires: '1h' // set expiry date for all cached responses to 1 hour
        }
    }
);

const CachedResponse = mongoose.model('CachedResponse', cachedResponseSchema);

module.exports = CachedResponse;