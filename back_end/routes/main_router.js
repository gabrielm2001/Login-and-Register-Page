const express = require('express')

const main_controller = require('../controlers/main_controler')

const router = express.Router()

router.get('/', main_controller.render_main)
router.post('/register', main_controller.register)
router.post('/login', main_controller.login)

module.exports = router



