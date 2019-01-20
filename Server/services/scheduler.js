const cron = require('node-cron');
const nodemailer = require('nodemailer');
const keys = require('../config/keys');
const emailPendingUsersTemplate = require('../services/emailPendingUsers');


module.exports = (app, db) => {
    cron.schedule('* * * * * *', () => {
    // cron.schedule('7 * * * Sun', () => {

        db.collection('pendingUsers').find({}).toArray((err, pendingUsers) => {
            if(err) {
                console.log("err in scheduler of pendingUsers: ", user)
            } else {
                if(pendingUsers.length !== 0) {

                    console.log("pendingUsers: ", pendingUsers)
                    console.log("pendingUsers.length: ", pendingUsers.length)

                    const smtpTransport = nodemailer.createTransport({
                        service: 'Gmail', 
                        auth: {
                            type: 'OAuth2',
                            user: 'chch6597@colorado.edu', // This should be the email addr with the enable API
                            clientId: keys.GOOGLE_EMAIL_CLIENT_ID,
                            clientSecret: keys.GOOGLE_EMAIL_CLIENT_SECRET,
                            refreshToken: keys.GOOGLE_EMAIL_REFRESH_TOKEN,
                            accessToken: keys.GOOGLE_EMAIL_ACCESS_TOKEN,
                        },
                    });
    
                    const mailOptions = {
                        // from: email,
                        from: 'chch6597@colorado.edu',
                        // to: 'cathy@formothernature.com',  // Cathy's email
                        to: 'chch6597@colorado.edu',
                        subject: 'Pending users to add',
                        // text: pendingUsers.map(pendingUser ),
                        html: emailPendingUsersTemplate(
                            pendingUsers
                        )
                    };
    
                    smtpTransport.sendMail(mailOptions, (err, success) => {
                        if (err) {
                            console.log("err: ", err)
                            // return res.status(500).json({ errors: { global: 'Something went wrong' }});
                        }
                        else {
                            res.json({ success })
                            console.log("send")
                        }
                    })

                } else {

                    console.log("pendingUsers: ", pendingUsers)
                    console.log("pendingUsers.length: ", pendingUsers.length)
    
                    const smtpTransport = nodemailer.createTransport({
                        service: 'Gmail', 
                        auth: {
                            type: 'OAuth2',
                            user: 'chch6597@colorado.edu', // This should be the email addr with the enable API
                            clientId: keys.GOOGLE_EMAIL_CLIENT_ID,
                            clientSecret: keys.GOOGLE_EMAIL_CLIENT_SECRET,
                            refreshToken: keys.GOOGLE_EMAIL_REFRESH_TOKEN,
                            accessToken: keys.GOOGLE_EMAIL_ACCESS_TOKEN,
                        },
                    });
    
                    const mailOptions = {
                        // from: email,
                        from: 'chch6597@colorado.edu',
                        // to: 'cathy@formothernature.com',  // Cathy's email
                        to: 'chch6597@colorado.edu',
                        subject: 'For Mother Nature: you have no pending user',
                        text: 'This email is to inform you that there is no pending user to add.'
                    };
    
                    smtpTransport.sendMail(mailOptions, (err, success) => {
                        if (err) {
                            console.log("err: ", err)
                            // return res.status(500).json({ errors: { global: 'Something went wrong' }});
                        }
                    })
                }

            }
        })


    }, {
        scheduled: true,
        timezone: "America/Denver"
    });
}
