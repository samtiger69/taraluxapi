var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

function isNull(parameter) {
    if (typeof (parameter) === 'undefined') {
        return true;
    }
    return false;
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'samtiger.verify@gmail.com',
        pass: '*********'
    }
});

// send email
router.post('/send', (req, res, next) => {
    var reqBody = req.body;
    if (isNull(reqBody) || isNull(reqBody.From) || isNull(reqBody.Subject) || isNull(reqBody.Text)) {

    } else {
        var mailOptions = {
            from: 'samtiger.verify@gmail.com',
            to: 'samtiger.verify@gmail.com',
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.json(error)
            } else {
                res.json('Email sent: ' + info.response);
            }
        });
    }
});


module.exports = router;