const User = require("../models/User");

const isAdminRole = async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (user.role != 'admin') {
        return res.status(403).json({ mssg: "You are not an admin" });
    }
    next();
}
module.exports = isAdminRole;