const mongoose = require('mongoose')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const crypto = require('crypto')

const UserSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: [true, "Por favor ingrese un nombre"]
    },

    apellido: {
        type: String,
        required: [true, "Por favor ingrese un apellido"]
    },

    nombreCompleto: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: [true, "Por favor ingrese un email"],
        unique: true,
        match: [
            /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/ ,
            "Porfavor ingrese un mail válido"
        ]
    },

    password: {
        type: String,
        required: [true, "Por favor ingrese una contraseña"],
        minlength: 10,
        match: [
            /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/  ,
            "La contraseña debe tener 1 minúscula, 1 mayúscula, 1 número, 1 caracter especial y tener un largo total de 10 letras"
        ],
        select: false, // Cada vez que se realice una query con find() o findOne(), evita que este campo aparezca en los resultados.
        
    },

    resetPasswordToken: String,
    
    resetPasswordExpire: Date,

    activationToken: String,

    activated: {
        type: Boolean,
        default: false
    }

})

// Se ejecutará antes de que se guarde la información.
// Es importante declarar funciones con "function".
UserSchema.pre("save", async function (next) {

    // Si la contraseña no cambió, no la volverá a encriptar.
    if(!this.isModified("password")) next()

    // A mayor el número, más seguro el encriptado.
    const salt = await bcrypt.genSalt(10);

    // El campo password recibirá la contraseña encriptada.
    this.password = await bcrypt.hash(this.password, salt)

    next()

})

UserSchema.methods.matchPasswords = async function(password) {

    return await bcrypt.compare(password, this.password)

}

UserSchema.methods.getSignedToken = function() {

    return jwt.sign(
        { id: this._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRE }
    )

}

UserSchema.methods.getResetPasswordToken = function() {

    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Vence en 10 minutos

    return resetToken
    
}

UserSchema.methods.getActivationToken = function() {

    const activationToken = crypto.randomBytes(21).toString("hex");

    this.activationToken = crypto.createHash("sha256").update(activationToken).digest("hex");

    return activationToken
    
}

const User = mongoose.model("User", UserSchema)

module.exports = User