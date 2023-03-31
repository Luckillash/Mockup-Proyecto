require("dotenv").config();

const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// Redirección de requests
app.use("/api/private", require("./routes/dataService"));

// Error Handler
app.use((err, req, res, next) => {

    console.log(err.stack);

    console.log(err.name);

    console.log(err.code);

    res.status(500).json({message: "Pal ñackson"});

})

const PORT = process.env.PORT = 3000;

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))