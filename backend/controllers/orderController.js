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
            type = "order";
        } else {
            const newBalance = Math.abs(user.balance - 500);
            user.balance = 0;
            newOrder = await stripe.paymentIntents.create({
                amount: newBalance,
                currency: 'usd',
                payment_method_types: ['cashapp']
            });
            await Order.createOrder(name, req.user._id, false, newOrder.id);
            type = "payment";
        }
        await user.save();
        res.status(200).json({
            type,
            result: newOrder
        });
    } catch (error) {
        res.status(401).json({error: error.message});
    }
}

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({paid: true}, {_id: 1, id_number: 1, name: 1, complete: 1, updatedAt: 1}).sort({updatedAt: 1});
        res.status(200).json({ orders })
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const completeOrder = async (req, res) => {
    const { order_id } = req.body;

    try {
        await Order.findOneAndUpdate({_id: order_id}, {complete: true});
        const orders = await Order.find({paid: true}, {_id: 1, id_number: 1, name: 1, complete: 1, updatedAt: 1}).sort({updatedAt: 1});
        res.status(200).json({ orders });
    } catch (error) {
        res.status(400).json({error: error.message});
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
    getOrders,
    completeOrder,
    paymentOrder
};