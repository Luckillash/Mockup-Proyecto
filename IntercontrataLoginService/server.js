// El paquete dotenv siempre debe estar en el nivel superior.
require('dotenv').config({path: './config.env'})

const express = require('express')

const connectDB = require('./config/db')

// El manejador de errores siempre debe ser el último middleware
const errorHanlder = require('./middleware/error')

connectDB()

const app = express()

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();

});

app.use(express.json()) // Nos permite obtener la data del body de la request.

app.use('/api/auth', require('./routes/auth')) // Si la ruta apunta a /api/auth, usará /routes/auth

app.use('/api/private', require('./routes/private')) // Si la ruta apunta a /api/private, usará /routes/auth

app.use(errorHanlder) // En caso de que exista un error, ejecutará este error handler.

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

process.on("unhandledRejection", (err, promise) => {
    console.log(`Logged Error: ${err}`)
    server.close(() => process.exit(1))
})
