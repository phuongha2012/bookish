const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const keys = require('./config/keys');

const Comment = require('./models/comment.js');
const Member = require('./models/member.js');
const Portfolio = require('./models/portfolio.js');

const PORT = process.env.PORT || 3000;

// CONNECT TO DATABASE WITH MONGOOSE
const mongodbURI = `mongodb+srv://${keys.MONGO_USER}:${keys.MONGO_PASSWORD}@${keys.MONGO_CLUSTER_NAME}-tvmnw.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(mongodbURI, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('DB connected'))
        .catch(err => {
              console.log(`DBConnectionError: ${err.message}`);
        }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We are connected to MongoDB');
});

// APP SET-UPS
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});
app.use(express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());


// ===================================================================================
// ============================= YANA's code starts ==================================


// Register a member
app.post('/registerMember', (req,res) => {
  //checking if member is found in the db already
  Member.findOne({username:req.body.username},(err,memberResult)=> {
    if (memberResult){
      res.send('Members name is already taken. Please choose another name');
    } else{
      const hash = bcryptjs.hashSync(req.body.password); //hash the password
      const member = new Member({
        _id : new mongoose.Types.ObjectId,
        username : req.body.username,
        email : req.body.email,
        password : hash,
        about : req.body.about,
        location : req.body.location,
        website : req.body.website
      });

      member.save().then(result => {
        // security measures
        res.send('Your account has been created, please login to activate your account');
      }).catch(err => res.send(err));
    }
  });
});

// Get all members
app.get('/allMembers', (req,res) => {
  Member.find().then(result => {
    res.send(result);
  });
});

// Login a member
app.post('/loginMember', (req,res) => {
  Member.findOne({username:req.body.username},(err,memberResult) => {
    if (memberResult){
      if (bcryptjs.compareSync(req.body.password, memberResult.password)){
        res.send(memberResult);
      } else {
        res.send('Not Authorized');
      }
    } else {
      res.send('Member not found. Please register');
    }
  });
});


// Add an artwork to portfolio
app.post('/addPortfolio', (req,res) => {
  //checking if portfolio is found in the db already
  Portfolio.findOne({title:req.body.title},(err,portfolioResult)=>{
    if (portfolioResult){
      res.send('Artwork already added');
    } else{
      const portfolio = new Portfolio({
        _id : new mongoose.Types.ObjectId,
        title : req.body.title,
        description : req.body.description,
        image : req.body.image,
        category : req.body.category,
        price : req.body.price,
        memberId : req.body.memberId
      });

      portfolio.save().then(result => {
        res.send(result);
      }).catch(err => res.send(err));
    }
  });
});

// Get all portfolios
app.get('/allPortfolios', (req,res) => {
  Portfolio.find().then(result => {
    console.log(result);
    res.json(result);
  });
});

// Delete a project
app.delete('/deletePortfolio/:id',(req,res)=>{
  const idParam = req.params.id;
  Portfolio.findOne({_id:idParam}, (err,portfolio)=>{
    if (portfolio){
      Portfolio.deleteOne({_id:idParam},err=>{
        res.send('Portfolio deleted');
      });
    } else {
      res.send('Portfolio not found');
    }
  }).catch(err => res.send(err)); //refers to mogodb id
});


// =========================== YANA's code ends  =====================================
// ===================================================================================


// ===================================================================================
// =========================== HAYLEY's code starts ==================================

// Update a member info
app.patch('/updateMember/:id', (req, res) => {
  const _id = req.params.id;
  const updatedMember = {
                          username: req.body.username,
                          email: req.body.email,
                          about: req.body.about,
                          location: req.body.location,
                          website: req.body.website
  }

  Member.findByIdAndUpdate(_id, 
                            { $set: updatedMember }, 
                            { useFindAndModify: false, upsert: true, new: true },
                            (err, result) => {
                                console.log(result);
                                res.send(result);
                            })
        .catch(err => console.log(err));
})

// Update a project
app.patch('/updatePortfolio/:id', (req, res) => {
  const _id = req.params.id;
  const updatedProject = {
                          title : req.body.title,
                          description : req.body.description,
                          image : req.body.image,
                          category : req.body.category,
                          price : req.body.price
  };

  Portfolio.findByIdAndUpdate(_id, 
                                {$set: updatedProject}, 
                                { upsert: true, new: true}, 
                                (err, result) => {
                                    res.send({
                                      _id: result._id,
                                      title: result.title,
                                      description: result.description,
                                      image: result.image,
                                      category: result.category,
                                      price: result.price,
                                      memberId: result.memberId
                                    })
            })
            .catch(err => res.send(err));
})

// Find and return a project
app.get('/findProject/:id', (req, res) => {
  let _projectID = req.params.id;

  Portfolio.findById(_projectID, 
                      (err, result) => { res.send(result); })
})

// Find and return a user's account information
app.get('/myAccountInfo/:accountID', (req, res) => {
  let _memberId = req.params.accountID;

  Member.findById(_memberId, 
                  (err, result) => { res.send(result); })
})

// Find and return all projects that belong to a user
app.get('/myPortfolios/:accountID', (req, res) => {
  let _memberId = req.params.accountID;

  Portfolio.find({ memberId: _memberId },
                  (err, results) => {
                      if(results.length > 0) {
                        res.send(results);
                      } else {
                        res.send('No portfolio by this user found');
                      }
  });
});

// Return all projects with corresponding author information
app.get('/portfoliosAndAuthors', async (req, res) => {
  let query = await Portfolio.aggregate([
                                        { $lookup: {
                                                    from: "members",
                                                    localField: "memberId",
                                                    foreignField: "_id",
                                                    as: "authorInfo"
                                        }},
                                        { $unwind: "$authorInfo" }
  ]);
  res.send(query);
});

// Return one project with corresponding author information
app.get('/portfolioWithAuthor/:id', async (req, res) => {
  let artId = req.params.id;
  let query = await Portfolio.aggregate([
                                        { $match: { _id: mongoose.Types.ObjectId(artId) }},
                                        { $lookup: {
                                                    from: "members",
                                                    localField: "memberId",
                                                    foreignField: "_id",
                                                    as: "authorInfo"
                                        }},
                                        { $unwind: "$authorInfo" },
                                        { $lookup: {
                                                    from: "comments",
                                                    localField: "_id",
                                                    foreignField: "portfolioID",
                                                    as: "comments"
                                        }}
  ]);

  res.send(query);
});

// Find and return all products that match with price and category filter
app.get('/filterPortfolios/:minPrice/:maxPrice/:category', async (req, res) => {
  let _minPrice = parseInt(req.params.minPrice);
  let _maxPrice = parseInt(req.params.maxPrice);
  let _category = req.params.category;
  let query;

  if(_category === "all") {
    query = await Portfolio.aggregate([
                                      { $match: { price: { $gt: _minPrice, $lt: _maxPrice }}},
                                      { $lookup: {
                                                  from: "members",
                                                  localField: "memberId",
                                                  foreignField: "_id",
                                                  as: "authorInfo"
                                      }},
                                      { $unwind: "$authorInfo" }
    ])
  } else {
    query = await Portfolio.aggregate([
                                      { $match: { $and: [{ category: _category }, { price: { $gt: _minPrice, $lt: _maxPrice }}]}},
                                      { $lookup: {
                                                  from: "members",
                                                  localField: "memberId",
                                                  foreignField: "_id",
                                                  as: "authorInfo"
                                      }},
                                      { $unwind: "$authorInfo" }
    ])
  }

  if(query.length > 0) {
    res.send(query);
  } else {
    res.send('Sorry, there is no artwork that matches your search!')
  }
})

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


// =========================== HAYLEY's code ends  ===================================
// ===================================================================================

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
