const express = require("express");
const router = express.Router();
const collections = require("../controllers/CollectionsController");

router.get("/", collections.newcollections);
router.get("/popularinwoman", collections.popularinwoman);

module.exports = router;
