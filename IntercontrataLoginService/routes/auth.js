const express = require('express')

const router = express.Router()

const { register, login, forgotpassword, resetpassword, validateuser } = require('../controllers/auth')

// Si accede esta ruta y ejecuta un post, correrá el controlador 'register'
router.route("/register").post(register)

router.route("/login").post(login)

router.route("/forgotpassword").post(forgotpassword)

router.route("/resetpassword/:resetToken").put(resetpassword)

router.route("/validateuser/:activationToken").put(validateuser)

// router.post("register", () => {}) Forma alternativa.

module.exports = router