const express = require("express");
const router = express.Router();
const updateController = require("../controllers/UpdateController");

router.put("/email", updateController.updateEmail);
router.put("/address", updateController.updateAddress);
module.exports = router;
