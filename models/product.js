const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    _id : Schema.Types.ObjectId,
    isActive: Boolean,
    title : String,
    author: String,
    description : String,
    photoUrl : String,
    category : String,
    price : Number,
    condition: String,
    listedCity: String,
    format: String,
    shipping: [String],
    seller : {
        type : Schema.Types.ObjectId,
        ref : 'Member'
    }
});

module.exports = mongoose.model('Product', productSchema);

