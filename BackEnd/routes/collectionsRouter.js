const express = require("express");
const router = express.Router();
const collections = require("../controllers/CollectionsController");

router.get("/popularinwoman", collections.popularinwoman);
router.get("/", collections.newcollections);

module.exports = router;
