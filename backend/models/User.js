const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const generateRandomString = (length = 6) => {
    return Math.random().toString(20).substr(2, length);
}

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "admin"]
    },
    sex: {
        type: String,
        required: true,
        enum: ["male", "female"]
    },
    balance: {
        type: Number,
        required: false,
        default: 0
    },
    email: {
        type: String,
        required: true,
    },
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    password_temp: {
        type: String
    },
    nfc_id: {
        type: String,
        sparse: true,
        unique: true
    },
    chat_id: {
        type: String
    }
});

userSchema.statics.signup = async function (first_name, last_name, sex, email, password, role = "user") {
    if (!first_name || !last_name || !role || !sex  || !email || !password) {
        throw Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
        throw Error("Email is not valid");
    }
    if (role != "user") {
        throw Error("Role is not correct");
    }
    if (sex != "male" && sex != "female") {
        throw Error("Sex is not correct");
    }

    const exists = await this.findOne({ login: email });

    if (exists) {
        throw Error("Email already in use");
    }

    const hash = await bcrypt.hash(password, 10);

    return await this.create({
        first_name,
        last_name,
        role,
        sex,
        email,
        login: email,
        password: hash,
        password_temp: password,
        balance: 0
    });
}

userSchema.statics.login = async function(login, password) {
    if (!login || !password) {
        throw Error("All fields must be filled");
    }

    const user = await this.findOne({ login });

    if (!user) {
        throw Error("Incorrect email");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error("Incorrect password");
    }
    
    return user;
}

userSchema.statics.updateBalance = async function() {
    const userList = await this.updateMany({ balance: { $gte: 0 } }, { balance: 500 });
    return userList;
}

userSchema.statics.transferUsers = async function(users) {
    const result = await Promise.all(users.map(async (user) => {
        const parts = user.email.split('@');
        const login = parts[0] + "_" + generateRandomString(4);

        const generatePassword = generateRandomString(8);
        
        const password = await bcrypt.hash(generatePassword, 10);

        return {
            first_name: user.first_name,
            last_name: user.last_name,
            role: "user",
            sex: user.gender.toLowerCase(),
            balance: 0,
            email: user.email,
            login,
            password,
            password_temp: generatePassword,
            chat_id: user.chat_id
        };
    }));
    const transfer = await this.insertMany(result);
    return transfer;
}

module.exports = mongoose.model("User", userSchema);