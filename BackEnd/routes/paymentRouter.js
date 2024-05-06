const express = require('express')
const router = express.Router()

const paymentController = require('../controllers/PaymentController')
router.get("/config",paymentController.config)
router.post("/cash",paymentController.cash)

module.exports  = router