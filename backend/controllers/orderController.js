const Order = require("../models/Order");

const createOrder = async (req, res) => {
    const { name } = req.body;

    try {
        const newOrder = await Order.createOrder(name, req.user._id);
        res.status(200).json({newOrder});
    } catch (error) {
        res.status(401).json({error: error.message});
    }
}

module.exports = {
    createOrder
};