const mongoose = require('mongoose')
const userSchema = require('./Schemas/userSchema')

let User = mongoose.model('usuarios', userSchema)

module.exports = User