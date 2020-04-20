const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcryptjs = require('bcryptjs');

const keys = require('./config/keys');
const Member = require('./models/member.js');
const Product = require('./models/product.js');
const Comment = require('./models/comment.js');
const CommentReply = require('./models/commentReply.js');

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
require('./routes/productRoutes')(app);
require('./routes/commentRoutes')(app);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
