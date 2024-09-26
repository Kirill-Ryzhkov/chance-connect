const Event = require("../models/Event");

const createEvent = async (req, res) => {
    const { name } = req.body;
     
    try {
        const result = await Event.createEvent(name);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const toggleCafeEvent = async (req, res) => {
    const name = req.params.name;
     
    try {
        const event = await Event.findOne({name});

        if (event) {
            event.open = !event.open;
            await event.save();
        } else {
            throw Error("The event not exists");
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const statusCafe = async (req, res) => {
    const name = req.params.name;
     
    try {
        const event = await Event.findOne({name});
        
        res.status(200).json({status: event});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    createEvent,
    toggleCafeEvent,
    statusCafe
}