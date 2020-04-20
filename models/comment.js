// Hayley code
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    _id : Schema.Types.ObjectId,
    portfolioID: {
        type: Schema.Types.ObjectId,
        ref: 'Portfolio'
    },
    postByID: {
        type: Schema.Types.ObjectId,
        ref: 'Member'
    },
    postByUsername: String,
    posted: Date,
    text: String
});
module.exports = mongoose.model('Comment', commentSchema);
// Hayley code ends