const express = require('express')

const main_controller = require('../controlers/main_controler')

const router = express.Router()

router.get('/register', main_controller.render_main)

module.exports = router






