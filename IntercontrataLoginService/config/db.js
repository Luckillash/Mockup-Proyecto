const mongoose = require('mongoose')

const connectDB = async () => {

    await mongoose.connect(process.env.MONGO_URI, {

        // userNewUrlParse: true,  // Deprecado, True por defecto.
        // useCreateIndex: true,   // Deprecado, True por defecto.
        useUnifiedTopology: true,  // True por defecto.
        // useFindAndModify: true, // Deprecado, False por defecto.

    })

    console.log("MongoDB connected");

}

const disconnectDB = mongoose.disconnect() // Utilizar cuando se cierre la app.


module.exports = connectDB