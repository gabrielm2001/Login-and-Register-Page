const mongoose = require('mongoose')
const userSchema = require('../Schemas/user_schema')

let User = mongoose.model('usuarios', userSchema)

module.exports = User