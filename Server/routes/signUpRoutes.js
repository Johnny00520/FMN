// const Joi = require('joi');
// /* We will see if we need bcrypt or bcryptjs */
// // const bcrypt = require('bcrypt');
// const bcrypt = require('bcryptjs');
// const mongoose = require('mongoose');
// const User = require('../classModels/User');

// const emailTemplate = require('../services/emailTemplate');
// const request = require('request');
// const keys = require('../config/keys');
// var async = require('async');
// var nodemailer = require('nodemailer');

// const schema = Joi.object().keys({
//     firstname: Joi.string().min(1).required(),
//     lastname: Joi.string().min(1).required(),
//     // Minimum eight characters, at least one uppercase letter, 
//     // one lowercase letter, one number and one special character:
//     password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
//     passwordConfirm: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
//     status: Joi.string().min(1).required(),
//     website: Joi.string().allow('').optional(),
//     adminForCode: Joi.string().allow('').optional(),
//     recaptcha: Joi.required(),
//     notes: Joi.string().min(1).required(),
//     email: Joi.string().email({ minDomainAtoms: 2}).required().regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
// });


// module.exports = (app) => {
//     app.get('/api/signup/thanks_confirmation', (req, res) => {
//         res.send(`
//             <div style="text-align: center; margin-top: 50px;">
//                 Thank you!!!! We will get back to you ASAP!!
//             </div>
//         `);
//     });


//     app.post('/api/signup', async (req, res, next) => {

//         // recaptcha
//         if(req.body.values.recaptcha === undefined || req.body.values.recaptcha === '' || req.body.values.recaptcha === null) {
//             return res.status(400).send({ "success": false, "message": "Select recaptcha!"});
//         }

//         const secreyKey = keys.RECAPTCHA_SECRET_KEY;
//         const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=
//                     ${secreyKey}&response=${req.body.values.recaptcha}&remoteip=
//                     ${req.connection.remoteAddress}`;


//         request(verifyURL, (err, response, body) => {
//             body = JSON.parse(body);
//             // console.log("body: ", body)

//             if(body.success !== undefined && !body.success) {
//                 return res.status(400).send({ "success": false, "message": 'Failed captcha verification!'});
//                 // return res.status(400).json({ 
//                 //     message: "Failed captcha verification!!"
//                 // });
//             }
//             return res.status(200).send({ "success": true, "message": 'Captcha passed! '});
//         });


//         // find duplicate email address
//         User.find({ email: req.body.values.email.trim().toLowerCase() })
//             .exec()
//             .then(user => {
//                 if(user.length >= 1) {
//                     return res.status(409).send({
//                         message: 'This email address has been registered!',
//                         type: 'Internal'
//                     });
//                 } else {
//                     const userSignupInput = req.body.values;
//                     const result = Joi.validate( userSignupInput, schema );

//                     if(result.error) {
//                         // console.log("error result 1: ", result.error.details);
//                         return res.status(401).send({ error: result.error.details });
//                         // return res.status(401).send({ error: result.error.details[0].message });
//                     } else {
//                         const { email, password, status, website, firstname, lastname, notes, adminForCode } = req.body.values;

//                         bcrypt.hash(password, 12, (error, hash) => {
//                             if(error) {
//                                 console.log("error result 2: ", result.error);
//                                 return res.status(500).send({ error: result.error });

//                             } else {
//                                 async.waterfall([     
//                                     function(user, done) {
//                                         var smtpTransport = nodemailer.createTransport({
//                                             service: 'Gmail', 
//                                             auth: {
//                                                 type: 'OAuth2',
//                                                 user: 'chch6597@colorado.edu', // This should be the email addr with the enable API
//                                                 clientId: keys.GOOGLE_EMAIL_CLIENT_ID,
//                                                 clientSecret: keys.GOOGLE_EMAIL_CLIENT_SECRET,
//                                                 refreshToken: keys.GOOGLE_EMAIL_REFRESH_TOKEN,
//                                                 accessToken: keys.GOOGLE_EMAIL_ACCESS_TOKEN,
//                                             },
//                                         });
//                                         // console.log("email: ", email);
//                                         var mailOptions = {
//                                             from: email,
//                                             // to: 'cathy@formothernature.com',  // Cathy's email
//                                             to: 'chch6597@colorado.edu',
//                                             // to: 'raja4353@colorado.edu',
//                                             // from: keys.EMAIL_FROM,
//                                             subject: firstname + '' + lastname + ' want to join the FMN',
//                                             html: emailTemplate(firstname, lastname, notes, email, website)
//                                         };
                                    
//                                         smtpTransport.sendMail(mailOptions, (err, info) => {
//                                             if (err) {
//                                                 return console.log('err: ', err)
//                                             }
//                                             else {
//                                                 console.log('Message sent: %s', JSON.stringify(info, null, 4));
//                                                 console.log('Message URL: %s', nodemailer.getTestMessageUrl(info))
//                                                 done(err, 'done');
//                                             }
//                                         });
//                                     }
//                                 ]),
//                                 function(err) {
//                                     if (err) return next(err);
//                                     res.status(500).send( err );
//                                 };

//                                 const newUser = new User({
//                                     _id: new mongoose.Types.ObjectId(),
//                                     email: email.trim().toLowerCase(),
//                                     password: hash,
//                                     contributor: status,
//                                     displayName: firstname.trim() + " " + lastname.trim(),
//                                     givenName: firstname.trim(),
//                                     familyName: lastname.trim(),
//                                     createdDate: new Date(),
//                                     // notes: notes,
//                                     _user: User._user
//                                 });

//                                 if(adminForCode === keys.ADMIN_SECRET_CODE && status === 'superuser') {
//                                     newUser.isAdmin = true;
//                                 }

//                                 // if(status === 'Artist') {
//                                 //     newUser.isArtist = true
//                                 // }

//                                 // Save to mongo
//                                 // try {
//                                 //     newUser
//                                 //         .save()
//                                 //         .then(result => {
//                                 //             console.log("result: " + result);
//                                 //             res.status(200).send('User created!');
                                            
//                                 //         })
//                                 // }
//                                 // catch(err) {
//                                 //     res.status(422).send("save() err: " + err);
//                                 // }
//                             }
//                         })
//                     }
//                 }
//             })
//     });

    

//     app.get('/api/current_user', (req, res) => {
//         res.send(req.user);
//     });

//     app.get('/api/logout', (req, res) => {
//         req.logout();
//         res.redirect('/');
//     });
// }