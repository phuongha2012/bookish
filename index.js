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
const Product = require('./models/product.js');

const PORT = process.env.PORT || 3000;

// CONNECT TO DATABASE WITH MONGOOSE
const mongodbURI = `mongodb+srv://${keys.MONGO_USER}:${keys.MONGO_PASSWORD}@${keys.MONGO_CLUSTER_NAME}-559tn.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(mongodbURI, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('Connected to DB'))
        .catch(err => {
              console.log(`DBConnectionError: ${err.message}`);
        }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
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

// IMPORT ROUTES
require('./routes/memberRoutes')(app);


// List a product
app.post('/product/add', (req, res) => {
    const Product = new Product({
                                  _id : new mongoose.Types.ObjectId,
                                  title : req.body.title,
                                  description : req.body.description,
                                  image : req.body.image,
                                  category : req.body.category,
                                  price : req.body.price,
                                  memberId : req.body.memberId
    });

    Product.save()
            .then(result => res.send(result))
            .catch(err => res.send(err));
});

// Get all products
// app.get('/products', (req, res) => {
//     Product.find()
//             .then(result => res.json(result));
// });

// Delete a product
app.delete('/product/:id/delete', (req, res) => {
  const id = req.params.id;
  Product.findOne({ _id: id }, (err, result) => {
                                                  if (result) {
                                                      Product.deleteOne({ _id: id }, err => {
                                                        res.send('Product deleted');
                                                      });
                                                  } else {
                                                      res.send('Product not found');
                                                  }})
          .catch(err => res.send(err));
});

// Update a member info
app.patch('/member/:id/update', (req, res) => {
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


// Update a product
app.patch('/product/:id/update', (req, res) => {
  const _id = req.params.id;
  const updatedProject = {
                          title : req.body.title,
                          description : req.body.description,
                          image : req.body.image,
                          category : req.body.category,
                          price : req.body.price
  };

  Product.findByIdAndUpdate(_id, 
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

// Find and return a product
app.get('/product/:id', (req, res) => {
  let _projectID = req.params.id;

  Product.findById(_projectID, 
                      (err, result) => { res.send(result); })
})

// Find and return a user's account information
app.get('/member/:id', (req, res) => {
  let _memberId = req.params.accountID;

  Member.findById(_memberId, 
                  (err, result) => { res.send(result); })
})

// Find and return all projects that belong to a user
app.get('/products/:memberId', (req, res) => {
  let _memberId = req.params.memberId;

  Product.find({ memberId: _memberId },
                  (err, results) => {
                      if(results.length > 0) {
                        res.send(results);
                      } else {
                        res.send('No portfolio by this user found');
                      }
  });
});

// Return all products with corresponding sellers information
app.get('/products', async (req, res) => {
  let query = await Product.aggregate([
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
app.get('/product/:id', async (req, res) => {
  let artId = req.params.id;
  let query = await Producr.aggregate([
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
app.get('/products/filter/:minPrice/:maxPrice/:category/', async (req, res) => {
  let _minPrice = parseInt(req.params.minPrice);
  let _maxPrice = parseInt(req.params.maxPrice);
  let _category = req.params.category;
  let query;

  if(_category === "all") {
    query = await Product.aggregate([
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
    query = await Product.aggregate([
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

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
