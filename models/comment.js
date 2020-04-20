const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    _id : Schema.Types.ObjectId,
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    memberId: {
        type: Schema.Types.ObjectId,
        ref: 'Member'
    },
    memberUsername: String,
    postedOn: Date,
    content: String,
    replies: [
        {
            content: String,
            postedOn: Date,
            memberId: {
                type: Schema.Types.ObjectId,
                ref: 'Member'
            }
        }
    ]
});

module.exports = mongoose.model('Comment', commentSchema);