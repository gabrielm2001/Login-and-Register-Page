const express = require('express')
const app = express()

require('dotenv').config()

// Configuração da configuração do MongoDb *********************************************
const mongoose = require('mongoose')

mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGOOSE_CONNECTION_URI)

let db = mongoose.connection

db.on('error', (err)=>{console.log('err')})
db.once('open', ()=>{console.log('Mongo Atlas/Compass connected')})
// ********************************************************************

app.use('/', express.urlencoded({extended: true}))

// ******Configuração da engine "Ejs" *
app.set('view engine', 'ejs')
app.set('views', './front_end/views')
app.use(express.static('./front_end/public'))
// ************************************

// ***************Criada a rota do Main encamihando para a rota desejada*
const main_router = require('./back_end/routes/main_router')

app.use('/', main_router)
// **********************************************************************

app.listen(process.env.PORT,()=>{
    console.log('Server on fire!!!!')
})




