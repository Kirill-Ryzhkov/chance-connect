const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const generateOrderNumber = (length = 6) => {
    return Math.round(Math.random() * 1000);
}

const orderSchema = new Schema({
    id_number: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
    }
}, {
    timestamps: true
});

orderSchema.statics.createOrder = async function (name, user_id) {
    if (name === '') {
        throw Error ("Order's name needed"); 
    }

    return await this.create({ 
        id_number: generateOrderNumber(),
        name,
        user_id,
        complete: false
    });
}

module.exports = mongoose.model("Order", orderSchema);