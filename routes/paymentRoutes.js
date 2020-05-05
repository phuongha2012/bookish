const keys = require('../config/keys');
const stripe = require('stripe')(keys.STRIPE_SECRET_KEY);

module.exports = (app) => {
    app.get('/payment/config', (req, res) => {
        res.send({
            publicKey: keys.STRIPE_PUBLISHABLE_KEY
        })
    })

    // Fetch the Checkout Session to display the JSON result on the success page
    app.get('/payment/checkout-session', async (req, res) => {
        const { sessionId } = req.query;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        res.send(session);
    });

    app.post('/payment/create-checkout-session', async (req, res) => {
        const domainUrl = keys.DOMAIN;
        const { productId, productName, price, photoUrl, customerEmail, seller } = req.body
        const imagesArr = [];
        imagesArr.push(photoUrl);       

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            client_reference_id: productId,
            customer_email: customerEmail,
            line_items: [
                {
                    name: productName,
                    description: seller,
                    images: imagesArr,
                    amount: price,
                    currency: 'nzd',
                    quantity: 1
                }
            ],
            success_url: `${domainUrl}/paymentSuccess.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domainUrl}/paymentCancelled.html`
        });

        res.send({
            sessionId: session.id
        });
    })

}