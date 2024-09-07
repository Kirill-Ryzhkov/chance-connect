const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    open: {
        type: Boolean,
        requried: true,
        default: true
    }
});

eventSchema.statics.createEvent = async function (name) {
    if (await this.findOne({name})) {
        throw Error("Event already exists");
    }

    return await this.create({name});
}

module.exports = mongoose.model("Event", eventSchema);