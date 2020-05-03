const keys = require('../config/keys');
const stripe = require('stripe')(keys.STRIPE_SECRET_KEY);

module.exports = (app) => {
    app.get('/config', (req, res) => {
        res.send({
            publicKey: keys.STRIPE_PUBLISHABLE_KEY
        })
    })
}