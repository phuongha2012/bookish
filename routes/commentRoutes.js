module.exports = (app) => {

    // Add a comment to post
    app.post('/addComment', (req, res) => {
        let comment = new Comment({
                                _id : new mongoose.Types.ObjectId,
                                portfolioID: req.body.portfolioID,
                                postByID: mongoose.Types.ObjectId(req.body.postByID),
                                postByUsername: req.body.postByUsername,
                                posted: req.body.postDate,
                                text: req.body.content
        })
    
        comment.save()
                .then(result => res.send(result))
                .catch(err => res.send(err))
    })
    
}