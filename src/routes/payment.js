const { Router } = require('express')
const router = Router()
const paypal = require('paypal-rest-sdk')

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'PayPal_ClientID',
    'client_secret': 'PayPal_ClientSecret'
})

router.get('/', async (req, res) => {
    res.send('Hello World!')
})

router.post('/pay', async (req, res) => {
    try {
        var myPayment = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:4000/success",
                "cancel_url": "http://localhost:4000/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": req.body.name,
                        "sku": "item",
                        "price": req.body.price,
                        "currency": "USD",
                        "quantity": req.body.quantity,
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": req.body.total
                },
                "description": "This is the payment description."
            }]
        }
        
        paypal.payment.create(myPayment, async (error, payment) => {
            if (error) {
                throw error;
            } else {
                console.log("Create Payment Response");
                //console.log(payment);
                for (var index = 0; index < payment.links.length; index++) {
                    //Redirect user to this endpoint for redirect url
                    if (payment.links[index].rel === 'approval_url') {
                        res.redirect(payment.links[index].href)
                    }
                }
            }
        })
    } catch (error) {
        res.status(500).send('Something went wrong')
    }
})

router.post('/success', async (req, res) => {
    try {
        const paymentId = req.query.paymentId
        const payerId = req.query.PayerID
        const executePaymentJson = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": req.body.total
                }
            }]
        } 
    
        paypal.payment.execute(paymentId, executePaymentJson,  (error, payment) => {
            if (error) {
                //console.log(error.response);
                throw error;
            } else {
                //console.log("Get Payment Response")
                console.log(JSON.stringify(payment))
                res.status(200).send('Successful')
            }
        })
    } catch (error) {
        res.status(500).send('Something went wrong')
    }
})

router.get('/cancel', async (req, res) => {
    res.send('Cancelled')
})

module.exports = router