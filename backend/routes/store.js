const express = require("express");
const corsHeader = require("../middleware/corsHeaders");
const uploadImage = require("../middleware/uploadImage");

const { 
    createItemStore,
    searchMultipleItemsStore,
    getOneItemStore,
    createFieldStore,
    searchMultipleFieldsStore,
    searchSingleFieldStore,
    getFieldStoreList
} = require("../controllers/storeController");

const router = express.Router();

router.use(corsHeader);

router.post("/create", uploadImage.single("image"), createItemStore);
router.post("/multiple", searchMultipleItemsStore);
router.get("/single/:type/:slug", getOneItemStore);

router.post("/field/create", createFieldStore);
router.post("/field/multiple", searchMultipleFieldsStore);
router.post("/field/single", searchSingleFieldStore);
router.get("/field/list/:type", getFieldStoreList);

module.exports = router;