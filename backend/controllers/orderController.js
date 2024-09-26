require('dotenv').config();
const Order = require("../models/Order");
const User = require("../models/User");
const sendTelegramMessage = require("../services/sendMessage");

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_LIVE_KEY);

const receiveOrdersCommon = async () => {
    return await Order.find({paid: true}, {_id: 1, id_number: 1, name: 1, complete: 1, updatedAt: 1}).sort({updatedAt: 1});
}

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
            await sendTelegramMessage(`Your order has been created\nNumber of your order is ${newOrder.id_number}`, user.chat_id);
        } else {
            const newBalance = Math.abs(user.balance - 50);
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
        const orders = await receiveOrdersCommon();
        res.status(200).json({ orders })
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const completeOrder = async (req, res) => {
    const { order_id } = req.body;

    try {
        const completeOrder = await Order.findOneAndUpdate({_id: order_id}, {complete: true});
        const userObj = await User.findById(completeOrder.user_id);
        await sendTelegramMessage(`Your order ${completeOrder.id_number} complete`, userObj.chat_id);
        const orders = await receiveOrdersCommon();
        res.status(200).json({ orders });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const clearHistoryOrders = async (req, res) => {
    try {
        const result = await Order.deleteMany({complete: true});
        const orders = await receiveOrdersCommon();
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
        const userObj = await User.findById(order.user_id);
        await sendTelegramMessage(`Your order has been created\nNumber of your order is ${order.id_number}`, userObj.chat_id);
        res.status(200).json({ result: order, success: true });

    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    createOrder,
    getOrders,
    completeOrder,
    clearHistoryOrders,
    paymentOrder
};