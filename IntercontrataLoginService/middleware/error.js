const ErrorResponse = require('../utils/errorResponse');

const errorHanlder = (err, req, res, next) => {

    let error = { ...err }

    error.message = err.message

    // console.log(err, error);

    if(err.code === 11000) { // Duplicate Key Error (Moongose)
        const message = `No se pudo generar el registro`;
        error = new ErrorResponse(message, 400);
    }

    if(err.name === "ValidationError") { 
        const message = Object.values(err.errors).map((val) => val.message);
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error"
    })

}

module.exports = errorHanlder