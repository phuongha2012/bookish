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
        const { id, productName, price, photoUrl } = req.body
        const imagesArr = [];
        imagesArr.push(photoUrl);

        

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    name: productName,
                    images: imagesArr,
                    amount: price,
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