const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const Member = require('../models/member.js');

module.exports = (app) => {
    
    // Register a member
    app.post('/members/add', (req,res) => {

        //checking if member is found in the db already
        Member.findOne({ username:req.body.username }, (err, result)=> {
            if (result){
                res.send('Members name is already taken. Please choose another name');
            } else {
                const hash = bcryptjs.hashSync(req.body.password); 
                const member = new Member({
                                            _id : new mongoose.Types.ObjectId,
                                            username : req.body.username,
                                            email : req.body.email,
                                            password : hash,
                                            about : req.body.about,
                                            photoUrl: req.body.photoUrl,
                                            address: req.body.address,
                                            card : req.body.card
                                        });
        
                member.save()
                        .then(result => res.send(result))
                        .catch(err => res.send(err));
            }
        });
    });
  
    // Get all members
    app.get('/members', (req,res) => {
        Member.find().then(result => {
        res.send(result);
        });
    });
  
    // Login a member
    app.post('/members/login', (req,res) => {
        Member.findOne({username:req.body.username},(err,memberResult) => {
        if (memberResult){
            if (bcryptjs.compareSync(req.body.password, memberResult.password)){
            res.send(memberResult);
            } else {
            res.send('Not Authorized');
            }
        } else {
            res.send('Member not found. Please register!');
        }
        });
    });

    // Update a member info
    app.patch('/members/:id/update', (req, res) => {
        const _id = req.params.id;
        const updatedMember = {
                                username: req.body.username,
                                email: req.body.email,
                                about: req.body.about,
                                photoUrl: req.body.photoUrl,
                                address: req.body.address,
                                card : req.body.card
        }

        Member.findByIdAndUpdate(_id, 
                                    { $set: updatedMember }, 
                                    { useFindAndModify: false, upsert: true, new: true },
                                    ( err, result ) => {
                                                        if (err) res.send(err);
                                                        res.send(result);
                                    })
                .catch(err => console.log(err));
    })

    // Find and return a user's account information
    app.get('/members/:id', (req, res) => {
        let _memberId = req.params.id;

        Member.findById(_memberId, 
                        (err, result) => { res.send(result); })
    })

}