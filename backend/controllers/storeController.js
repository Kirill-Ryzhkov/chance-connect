const Store = require("../models/Store");
const StoreFields = require("../models/StoreFields");

const createItemStore = async (req, res) => {
    const { name, slug, type, price } = req.body;
    const image = req.file ? req.file.path : null;

    try {
        if (!image) {
            throw new Error("Image is required");
        }
        
        const result = await Store.createItem(name, slug, image, type, price);
        res.status(200).json({ result });

    } catch (error) {
        res.status(401).json({error: error.message});
    }
}

const searchMultipleItemsStore = async (req, res) => {
    const search = req.body.search;

    try {
        const items = await Store.find(search);
        res.status(200).json({ items });
    } catch (error) {
        res.status(401).json({error: error.message});
    }
}

const getOneItemStore = async (req, res) => {
    const { type, slug } = req.params;
    try {
        const [item, fields] = await Promise.all([
            Store.findOne({ slug }).select('name image type price'),
            StoreFields.find({ type }).select('field_name type field_options')
        ]);
        res.status(200).json({ item, fields });
    } catch (error) {
        res.status(401).json({error: error.message});
    }
}

const createFieldStore = async (req, res) => {
    const { field_name, field_options, type, add_price } = req.body;
    try {
        const result = await StoreFields.createField(field_name, field_options, type, add_price);
        res.status(200).json({ result });
    } catch (error) {
        res.status(401).json({error: error.message});
    }
}

const searchMultipleFieldsStore = async (req, res) => {
    const search = req.body.search;
    try {
        const fields = await StoreFields.find(search);
        res.status(200).json({ fields });
    } catch (error) {
        res.status(401).json({error: error.message});
    }
}

const searchSingleFieldStore = async (req, res) => {
    const search = req.body.search;
    try {
        const field = await StoreFields.findOne(search);
        res.status(200).json({ field });
    } catch (error) {
        res.status(401).json({error: error.message});
    }
}

const getFieldStoreList = async (req, res) => {
    const { type } = req.params;
    try {
        const fields = await StoreFields.find({ type }).select('field_name -_id');
        const fieldNames = fields.map(field => field.field_name);
        res.status(200).json({ fields: fieldNames });
    } catch (error) {
        res.status(401).json({error: error.message});
    }
}

module.exports = {
    createItemStore,
    searchMultipleItemsStore,
    getOneItemStore,
    createFieldStore,
    searchMultipleFieldsStore,
    searchSingleFieldStore,
    getFieldStoreList
};