const mongoose = require('mongoose');
const upload = require('../middlewares/multer');

const Product = require('../models/product.js');

module.exports = (app) => {

    // List a product
    app.post('/products/add', upload.single('productPhoto'), (req, res) => {
        let imagePath = req.file ? req.file.path : req.body.productPhotoUrl;
        let shippingMethods = [];
        
        if (req.body.pickup !== undefined) { shippingMethods.push(req.body.pickup) };
        if (req.body.courier !== undefined) { shippingMethods.push(req.body.courier) };

        console.log(shippingMethods);
        console.log('seller', req.body.seller);

        const product = new Product({
                                    _id : new mongoose.Types.ObjectId,
                                    title : req.body.title,
                                    author: req.body.author,
                                    description : req.body.description,
                                    photoUrl : imagePath,
                                    category : req.body.category,
                                    price : req.body.price,
                                    condition : req.body.condition,
                                    listedCity : req.body.listedCity,
                                    format : req.body.format,
                                    shipping: shippingMethods,
                                    seller : req.body.seller
        });

        console.log(product);

        // product.save()
        //         .then(result => res.send(result))
        //         .catch(err => res.send(err));
    });

    // Delete a product
    app.delete('/products/:id/delete', (req, res) => {
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


    // Update a product
    app.patch('/products/:id/update', (req, res) => {
        const _id = req.params.id;
        const updatedProject = {
                                title : req.body.title,
                                author: req.body.author,
                                description : req.body.description,
                                photoUrl : req.body.photoUrl,
                                category : req.body.category,
                                price : req.body.price,
                                condition : req.body.condition,
                                listedCity : req.body.listedCity,
                                format : req.body.format,
                                shipping: req.body.shipping,
                                seller : req.body.seller
        };

        Product.findByIdAndUpdate(_id, 
                                        { $set: updatedProject }, 
                                        { upsert: true, new: true }, 
                                        (err, result) => {
                                                            if (err) res.send(err);
                                                            res.send({
                                                                _id: result._id,
                                                                title: result.title,
                                                                author: result.author,
                                                                description: result.description,
                                                                photoUrl: result.photoUrl,
                                                                category: result.category,
                                                                price: result.price,
                                                                condition: result.condition,
                                                                listedCity: result.listedCity,
                                                                format: result.format,
                                                                shipping: result.shipping,
                                                                seller: result.seller
                                                            })
                })
                .catch(err => res.send(err));
    })

    // Find and return all projects that belong to a user
    app.get('/products/fromseller/:memberId', (req, res) => {
        let _seller = req.params.memberId;

        Product.find({ seller: _seller },
                        (err, results) => {
                                            if(err) console.log(err);

                                            if(results.length > 0) {
                                                res.send(results);
                                            } else {
                                                res.send('No product by this user found');
                                            }
        });
    });

    // Return all products with corresponding sellers information
    app.get('/products', async (req, res) => {
        let query = await Product.aggregate([
                                                { $lookup: {
                                                            from: "members",
                                                            localField: "seller",
                                                            foreignField: "_id",
                                                            as: "sellerInfo"
                                                }},
                                                { $unwind: "$sellerInfo" }
        ]);
        res.send(query);
    });

    // Return one project with corresponding seller information
    app.get('/products/:id', async (req, res) => {
        let id = req.params.id;
        let query = await Product.aggregate([
                                                { $match: { _id: mongoose.Types.ObjectId(id) }},
                                                { $lookup: {
                                                            from: "members",
                                                            localField: "seller",
                                                            foreignField: "_id",
                                                            as: "sellerInfo"
                                                }},
                                                { $unwind: "$sellerInfo" },
                                                { $lookup: {
                                                            from: "comments",
                                                            localField: "_id",
                                                            foreignField: "productId",
                                                            as: "comments"
                                                }}
        ]);

        console.log(query.comments);

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
                                                        localField: "seller",
                                                        foreignField: "_id",
                                                        as: "sellerInfo"
                                            }},
                                            { $unwind: "$sellerInfo" }
            ])
        } else {
            query = await Product.aggregate([
                                            { $match: { $and: [{ category: _category }, { price: { $gt: _minPrice, $lt: _maxPrice }}]}},
                                            { $lookup: {
                                                        from: "members",
                                                        localField: "seller",
                                                        foreignField: "_id",
                                                        as: "sellerInfo"
                                            }},
                                            { $unwind: "$sellerInfo" }
            ])
        }

        if(query.length > 0) {
            res.send(query);
        } else {
            res.send('Sorry, there is no artwork that matches your search!')
        }
    })

}