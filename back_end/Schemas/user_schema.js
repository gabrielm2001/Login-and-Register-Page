const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    usuario: {type: String, required: true},
    senha: {type: String, required: true},
})

module.exports = userSchema



