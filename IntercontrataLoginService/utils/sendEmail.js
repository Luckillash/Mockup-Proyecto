const nodemailer = require('nodemailer');

const sendEmail = (options) => {

    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.text
    }

    transporter.sendMail(mailOptions, function(error, info) {

        if(error) console.log(error);

        else console.log(info);

    })

}

// const postmark = require('postmark');

// var client = new postmark.ServerClient("3c53a673-fcc6-42c0-a8b2-7f4c85128e59");

// const sendEmail = (options) => {

//     client.sendEmail({
//       "From": process.env.EMAIL_FROM,
//       "To": options.to,
//       "Subject": options.subject,
//       "TextBody": options.text
//     });

// }


module.exports = sendEmail