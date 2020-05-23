const express = require("express")
const dotenv = require("dotenv");
const connectDatabase = require('./helpers/database/connectDatabase')
const routers = require('./routers')
const customErrorHandler = require('./middlewares/errors/customErrorHandler')
const path = require('path')

const app = express();
// express middleware
app.use(express.json())

// Environment Configure
dotenv.config({
    path: "config/env/config.env"
})
const PORT = process.env.PORT;

// Mongo Connection
connectDatabase()

// Routers Middleware
app.use('/api', routers)

// Error Handler
app.use(customErrorHandler)

// Static Files
app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => {
    console.log(`listen express${PORT} : ${process.env.NODE_ENV}`)
})