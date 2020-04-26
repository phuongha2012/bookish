const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    _id : Schema.Types.ObjectId,
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    postedOn: Date,
    content: String,
    commenter: {
        memberId: {
            type: Schema.Types.ObjectId,
            ref: 'Member'
        },
        memberUsername: String,
        memberPhotoUrl: String
    },
    replies: [
        {
            content: String,
            postedOn: Date,
            replier: {
                memberId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Member'
                },
                memberUsername: String,
                memberPhotoUrl: String
            },
        }
    ]
});

module.exports = mongoose.model('Comment', commentSchema);