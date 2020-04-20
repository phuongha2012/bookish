const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentReplySchema = new mongoose.Schema({
    _id : Schema.Types.ObjectId,
    parent_id: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    postByID: {
        type: Schema.Types.ObjectId,
        ref: 'Member'
    },
    postByUsername: String,
    posted: Date,
    text: String
});

module.exports = mongoose.model('CommentReply', commentReplySchema);