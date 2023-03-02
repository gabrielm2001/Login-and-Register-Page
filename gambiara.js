require('dotenv').config()

const MONGOOSE_CONNECTION_URI = process.env.MONGOOSE_CONNECTION_URI
const PORT = process.env.PORT

module.exports = {MONGOOSE_CONNECTION_URI: MONGOOSE_CONNECTION_URI, PORT: PORT}