const express = require('express')
const app = express()

const path = require('path')

const main_router = require('./routes/main_router')
require('dotenv').config()

// ******Configuração da engine "Ejs" *
app.set('view engine', 'ejs')
app.use(express.static('public'))
// ************************************


// ***************Criada a rota do Main encamihando para a rota desejada*
app.use('/main', main_router)
// **********************************************************************


app.listen(process.env.PORT,()=>{
    console.log('Server on fore!!!!')
})




