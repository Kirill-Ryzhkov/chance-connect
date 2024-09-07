// declare dependencies
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const postgres = require("../config/transfer");

function generateString(length) {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

// create jwt token
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const signupUser = async (req, res) => {
    const { first_name, last_name, sex, email, password } = req.body;

    try {
        const user = await User.signup(first_name, last_name, sex, email, password);
        const token = createToken(user._id);

        await User.findOneAndUpdate({ email });

        res.status(200).json({email, token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

const signinUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({email, token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

const transferUsers = async (req, res) => {
    try {
        const result = await postgres.query('SELECT * FROM retreat_user WHERE camp_id=6 AND email IS NOT NULL;');
        const insert = await User.transferUsers(result.rows);
        res.status(200).json(insert);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getTokenByNFC = async(req, res) => {
    const { nfc_id } = req.body;

    try {
        const user = await User.findOne({ nfc_id });
        if (user == null) {
            res.status(400).json({ error: "user not found" });
            return;
        }
        const authToken = createToken(user._id);
        res.status(200).json({ email: user.email, authToken });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const addNFCIdToUser = async (req, res) => {
    const user_id = req.body.user_id;
    const nfc_id = req.body.nfc_id;

    try {
        const user = await User.findById({_id: user_id});
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.nfc_id !== nfc_id) {
            await User.findOneAndUpdate({ nfc_id }, { nfc_id: generateString(6) });

            user.nfc_id = nfc_id;
            await user.save();

        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    signupUser,
    signinUser,
    transferUsers,
    getTokenByNFC,
    addNFCIdToUser
};