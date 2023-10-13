const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.GMAIL, // generated ethereal user
        pass: process.env.GMAIL_PASSWORD  // generated ethereal password
    }
});

let sendMail = (emailTemplate) => {
    transporter.sendMail(emailTemplate, (err, info) => {
        if(err) {
            console.log(err)
        }else{
            console.log('Email sent: ', info.response)
        }
    })
}

module.exports = {sendMail};