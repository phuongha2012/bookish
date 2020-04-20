// Yanas code
const mongoose = require('mongoose');  // since we are using Moongoose we have to require it

const memberSchema = new mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  username : String,
  email : String,
  password : String,
  about : String,
  location :String,
  website : String

});
module.exports = mongoose.model('Member', memberSchema);
// Yanas code ends
