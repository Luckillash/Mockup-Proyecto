require("dotenv").config();

const express = require('express');

const app = express();

// Middleware
app.use(express.json());

const connectSPO = require('./config/sharepoint');

connectSPO.then((options, error) => {

    console.log(options)

    global.options = options

    // Redirección de requests
    app.use("/api/SPO", require("./routes/dataServiceSPO"));

    const PORT = process.env.PORT = 3000;

    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))

    // Error Handler
    app.use((err, req, res, next) => {

        console.log(err.stack);
    
        console.log(err.name);
    
        console.log(err.code);
    
        res.status(500).json({message: "Pal ñackson"});
    
    })

})

.catch((error) => console.log("Se ha producido un error:", error))


