var spauth = require('node-sp-auth');

// Connect to SPO
var url = process.env.SITE;

const connectSPO = spauth.getAuth(url, {

    username: process.env.USERSPO,

    password: process.env.PASSWORD,

    online: true

})

module.exports = connectSPO