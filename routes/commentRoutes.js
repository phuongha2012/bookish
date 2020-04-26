const mongoose = require('mongoose');

const Comment = require('../models/comment.js');

module.exports = (app) => {

    // Add a comment to post
    app.post('/comments/add', (req, res) => {
        let comment = new Comment({
                                _id : new mongoose.Types.ObjectId,
                                productId: mongoose.Types.ObjectId(req.body.productId),
                                postedOn: new Date(),
                                content: req.body.content,
                                commenter: {
                                    memberId: req.body.memberId,
                                    memberUsername: req.body.memberUsername,
                                    memberPhotoUrl: req.body.memberPhotoUrl
                                }                     
        })

        console.log(comment);
    
        comment.save()
                .then(result => res.send(result))
                .catch(err => res.send(err))
    })

    // Add comment reply to a comment
    app.patch('/comments/:id/reply', (req, res) => {
        let id = req.params.id;

        let reply = {
                    content: req.body.content,
                    postedOn: new Date(),
                    replier: {
                        memberId: req.body.memberId,
                        memberUsername: req.body.memberUsername,
                        memberPhotoUrl: req.body.memberPhotoUrl
                    }           
        }

        Comment.findByIdAndUpdate(id, { $push: { replies: reply} })
                .then(result => res.send(result))
                .catch(err => res.send("Error in posting reply"));
    })
    
}