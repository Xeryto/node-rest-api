const mongoose = require('mongoose');

const cachedReponseSchema = new mongoose.Schema(
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
            expires: '1h'
        }
    }
);

const CachedResponse = mongoose.model('CachedReponse', cachedReponseSchema);

module.exports = CachedResponse;