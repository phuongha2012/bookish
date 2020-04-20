const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
  _id : Schema.Types.ObjectId,
  username : String,
  email : String,
  password : String,
  about : String,
  photoUrl: String,
  address : {
      street: String,
      city: String,
      zip: Number
  },
  card: {
      number: String,
      holder: String,
      cvc: Number
  },
  purchased: [{
      type: Schema.Types.ObjectId,
      ref: 'product'
  }],
  sold: [{
      type: Schema.Types.ObjectId,
      ref: 'product'
  }],
  watchlist: [{
      type: Schema.Types.ObjectId,
      ref: 'product'
  }]
});

module.exports = mongoose.model('Member', memberSchema);
