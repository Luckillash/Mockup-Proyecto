const express = require('express')

const router = express.Router()

const { userslist } = require('../controllers/dataServiceSPO')

router.route("/userslist").get(userslist)

module.exports = router