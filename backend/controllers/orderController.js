const Order = require("../models/Order");
const User = require("../models/User");

const createOrder = async (req, res) => {
    const { name } = req.body;

    try {

        const user = await User.findOne({_id: req.user._id});
        let newOrder;
        
        if (user.balance >= 500) {
            newOrder = await Order.createOrder(name, req.user._id);
            user.balance -= 500;
            user.save();
        } else {
            //stripe stuff

            newOrder = 'nothing';
        }
        res.status(200).json({newOrder});
    } catch (error) {
        res.status(401).json({error: error.message});
    }
}

module.exports = {
    createOrder
};