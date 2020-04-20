const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    _id : Schema.Types.ObjectId,
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
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