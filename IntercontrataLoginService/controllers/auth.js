const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto')

exports.register = async (req, res, next) => {

    // Obtener data de la request gracias a express.json()
    const { nombre, apellido, email, password } = req.body

    const nombreCompleto = nombre + " " + apellido

    try {

        // Creará un usuario con la data desestructurada del body, la contraseña es encriptada.
        const user = await User.create({ nombre, apellido, nombreCompleto, email, password })

        const activationToken = user.getActivationToken();

        const activationUrl = `http://localhost:3000/passwordReset/${activationToken}`;

        const message = `
        <h1>Te haz registrado</h1>
        <p>Por favor ingresa a este link para activar tu cuenta</p>
        <a href=${activationUrl} clicktracking=off>${activationUrl}</a>
        `
        
        try {

            await sendEmail({
                to: email,
                subject: "Activa tu cuenta | TRU",
                text: message
            });

            res.status(200).json({ success: true, data: "Correo de activación enviado"})
            
        } catch (error) {

            return next(new ErrorResponse("El email no pudo ser enviado", 500))
            
        }
        
    } catch (error) {

        next(error)

    }

}

exports.validateuser = async (req, res, next) => {

    // traer user y editar activation token y activaded.
    const activationToken = crypto.createHash("sha256").update(req.params.activationToken).digest("hex");

    try {

        const user = await User.findOne({activationToken});

        if(!user) return next(new ErrorResponse("No se pudo activar la cuenta", 404))

        user.activated = true;

        user.activationToken = undefined;

        res.status(200).json({ success: true, data: "Cuenta activada"})
        
    } catch (error) {
        
        next(error)

    }

}

exports.login = async (req, res, next) => {

    const { email, password } = req.body

    if ( !email || !password ) return next(new ErrorResponse("Por favor ingrese sus credenciales", 400))

    try {

        const user = await User.findOne({ email }).select("+password")

        if ( !user ) return next(new ErrorResponse("Credenciales incorrectas", 401))

        const isMatch = await user.matchPasswords(password) // True or false

        if ( !isMatch ) return next(new ErrorResponse("Credenciales incorrectas", 401))

        else sendToken(user, 200, res)
    
    } catch (error) {

        res.status(500).json({ success: false, error: error.message })
        
    }
}

exports.forgotpassword = async (req, res, next) => {

    const { email } = req.body;

    try {

        const user = await User.findOne({email});

        if(!user) return next(new ErrorResponse("El email no pudo ser enviado", 404))
        
        const resetToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl = `http://localhost:3000/passwordReset/${resetToken}`;

        const message = `
        <h1>Haz solicitado recuperar tu contraseña</h1>
        <p>Por favor ingresa a este link e ingresa una nueva contraseña para tu usuario</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `

        try {

            await sendEmail({
                to: user.email,
                subject: "Recuperar contraseña | TRU",
                text: message
            });

            res.status(200).json({ success: true, data: "Email enviado"})
            
        } catch (error) {

            user.resetPasswordToken = undefined;

            user.resetPasswordExpire = undefined;

            await user.save();

            return next(new ErrorResponse("El email no pudo ser enviado", 500))
            
        }
        
    } catch (error) {

        next(error)
        
    }
}

exports.resetpassword = async (req, res, next) => {

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

    try {

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() } // La fecha actual es mayor que la definida en el token de expiración
        })

        if(!user) return next(new ErrorResponse("Invalid Reset Token", 400));

        user.password = req.body.password;

        user.resetPasswordToken = undefined;

        user.resetPasswordExpire = undefined;

        await user.save();
    
        res.status(201).json({ success: true, data: "Password Reset Sucess"});
        
    } catch (error) {

        next(error)
        
    }

}

const sendToken = (user, statusCode, res) => {

    const token = user.getSignedToken()

    res.status(statusCode).json({ success: true, token })

}

