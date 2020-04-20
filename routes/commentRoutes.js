const mongoose = require('mongoose');

const Comment = require('../models/comment.js');

module.exports = (app) => {

    // Add a comment to post
    app.post('/comments/add', (req, res) => {
        let comment = new Comment({
                                _id : new mongoose.Types.ObjectId,
                                productId: req.body.productId,
                                memberId: mongoose.Types.ObjectId(req.body.memberId),
                                memberUsername: req.body.memberUsername,
                                postedOn: req.body.postedOn,
                                content: req.body.content
        })
    
        comment.save()
                .then(result => res.send(result))
                .catch(err => res.send(err))
    })

}