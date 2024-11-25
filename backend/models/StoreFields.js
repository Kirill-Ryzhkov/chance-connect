const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const storeFieldsSchema = new Schema({
    field_name: {
        type: String,
        required: true,
        index: true
    },
    field_options: {
        type: [String],
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["cafe", "merch"],
        index: true
    },
    add_price: {
        type: Number
    }
}, {
    timestamps: true
});

storeFieldsSchema.statics.createField = async function (field_name, field_options, type, add_price = 0) {
    if (!field_name || !field_options || !type) {
        throw Error ("All fields must be filled"); 
    }

    return await this.create({
        field_name,
        field_options,
        type,
        add_price
    });
}

module.exports = mongoose.model("StoreFields", storeFieldsSchema);