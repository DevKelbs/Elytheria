const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characterSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    race: {
        type: String,
        required: true,
    },
    // Add any other character attributes as needed
});

module.exports = mongoose.model('characters', characterSchema);
