require('dotenv').config();
const Order = require("../models/Order");
const User = require("../models/User");

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_TEST_KEY);

const createOrder = async (req, res) => {
    const { name } = req.body;

    try {

        const user = await User.findOne({_id: req.user._id});
        let newOrder;
        let type;
        
        if (user.balance >= 500) {
            newOrder = await Order.createOrder(name, req.user._id, true);
            user.balance -= 500;
            user.save();
            type = "order";
        } else {
            newOrder = await stripe.paymentIntents.create({
                amount: 500,
                currency: 'usd',
                payment_method_types: ['cashapp']
            });
            console.log(await Order.createOrder(name, req.user._id, false, newOrder.id));
            type = "payment";
        }
        res.status(200).json({
            type,
            result: newOrder
        });
    } catch (error) {
        res.status(401).json({error: error.message});
    }
}

const paymentOrder = async (req, res) => {
    const { intent_id } = req.body;

    try {

        const paymentIntent = await stripe.paymentIntents.retrieve(
            intent_id
        );

        if (paymentIntent.status != "succeeded") {
            return res.status(400).json({ message: "Payment failed", success: false });
        }
        
        const order = await Order.findOneAndUpdate({ intent_id }, { paid: true });
        res.status(200).json({ result: order, success: true });

    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    createOrder,
    paymentOrder
};