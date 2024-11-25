const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const storeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    image: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["cafe", "merch"],
        index: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

storeSchema.statics.createItem = async function (name, slug, image, type, price) {
    if (!name || !slug || !type || !price || !image) {
        throw Error ("All fields must be filled"); 
    }

    return await this.create({
        name,
        slug,
        image,
        type,
        price,
    });
}

module.exports = mongoose.model("Store", storeSchema);