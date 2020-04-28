const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
    } else {
    cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 500
    },
    fileFilter: fileFilter
});

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
                                email: req.body.email,
                                address: {
                                    street: req.body.street,
                                    suburb: req.body.suburb,
                                    city: req.body.city,
                                    zip: req.body.zip
                                }
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

    // Add a product to member's watchlist
    app.patch('/members/:id/watchlist/add/', (req, res) => {
        const _memberId = req.params.id;

        let productId = req.body.productId;

        Member.findByIdAndUpdate(_memberId, { $push: { watchlist: productId }})
                .then(result => res.send(result))
                .catch(err => res.send("Error adding product to watchlist: " + err))
    })

    // Remove a product from member's watchlist
    app.patch('/members/:id/watchlist/remove/', (req, res) => {
        const _memberId = req.params.id;

        let productId = req.body.productId;

        Member.findByIdAndUpdate(_memberId, { $pull: { watchlist: productId }})
                .then(result => res.send('result'))
                .catch(err => res.send("Error removing product to watchlist: " + err))
    })

    // Change profile photo
    app.patch('/members/:id/photo/update/', upload.single('profilePhoto'), (req, res, next) => {
        const _memberId = req.params.id;

        let newPhoto = req.file ? req.file.path : req.body.profilePhotoUrl;

        let updatedInfo = { photoUrl: newPhoto };

        Member.findByIdAndUpdate(_memberId, 
                                            { $set: updatedInfo },
                                            { useFindAndModify: false, upsert: true, new: true },
                                            ( err, result ) => {
                                                                if (err) res.send(err);
                                                                res.send(result);
                                            })
                .catch(err => console.log(err));
    })

}