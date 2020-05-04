const keys = require('../config/keys');
const stripe = require('stripe')(keys.STRIPE_SECRET_KEY);

module.exports = (app) => {
    app.get('/payment/config', (req, res) => {
        res.send({
            publicKey: keys.STRIPE_PUBLISHABLE_KEY
        })
    })

    app.post('/payment/create-checkout-session', async (req, res) => {
        const domainUrl = keys.DOMAIN;
        const imagesArr = [];
        imagesArr.push(req.body.photoUrl);
        console.log(req.body.price);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    name: req.body.productName,
                    images: imagesArr,
                    amount: req.body.price,
                    currency: 'nzd',
                    quantity: 1
                }
            ],
            success_url: `${domainUrl}/success.html?session_id=`,
            cancel_url: `${domainUrl}/canceled.html`
        });

        res.send({
            sessionId: session.id
        });
    })

}