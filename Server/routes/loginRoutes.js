const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const Joi = require('joi');
const nodemailer = require('nodemailer');
// const LocalStrategy = require('passport-local').Strategy;

const User = require('../classModels/User');
const rateLimit = require("express-rate-limit");

const signinLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 2, // start blocking after 5 requests
    message:
      "Too many accounts created from this IP, please try again after an hour"
});


const schema = Joi.object().keys({
    // Minimum eight characters, at least one uppercase letter, 
    // one lowercase letter, one number and one special character:
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    passwordConfirm: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    token: Joi.string().optional()
});

const emailFormatChecking = (value) => {
    return value && /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
}

const validation = (data) => {
    let errors = {};

    if(data.email === '') errors.email = "Email address cannot be empty";
    if(data.email) {
        if(!emailFormatChecking(data.email)) errors.email = 'Email format incorrectly';
    }
    if(data.password === '') errors.password = "Password cannot be empty";
    if(data.passwordConfirm === '') errors.passwordConfirm = "Password Confirmation cannot be empty";
    
    const isValid = Object.keys(errors).length === 0;

    return { errors, isValid };
}

module.exports = (app, db) => {
    app.post('/api/login', signinLimiter, (req, res) => {
    // app.post('/api/login', (req, res) => {
        // console.log("req.body: ", req.body)
        const { errors, isValid } = validation(req.body);
        if(isValid) {

            User.find({ email: req.body.email })
                .exec()
                .then(user => {
                    if(user.length < 1) {
                        console.log("user.length < 1")
                        return res.status(401).json({
                            errors: { global : 'There is no user attached with this email address'}
                        })
                    } else {
                        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                            if(err) {
                                console.log("bcrypt error")
        
                                return res.status(401).json({
                                    errors: { global: 'Incorrect password, please try again' }
                                });
                            }

                            if(result) {
                                if(user[0].isAdmin) {
                                    const token = jwt.sign({
                                            email: user[0].email,
                                            userId: user[0]._id
                                        }, 
                                        // process.env.JWT_KEY,
                                        keys.JWT_KEY,
                                        {
                                            expiresIn: "1h"
                                        }
                                    );
        
                                    return res.status(200).json({
                                        message: 'Admin Auth Successful',
                                        token: token,
                                        Administrator: user[0].isAdmin,
                                        user
                                    })
                                }

                                if(user[0].isArtist) {
                                    const token = jwt.sign({
                                            email: user[0].email,
                                            userId: user[0]._id
                                        }, 
                                        // process.env.JWT_KEY,
                                        keys.JWT_KEY,
                                        {
                                            expiresIn: "1h"
                                        }
                                    );
        
                                    return res.status(200).json({
                                        message: 'Artist Auth Successful',
                                        token: token,
                                        Artist: user[0].isArtist,
                                        user
                                    })
                                }
                                
                                const token = jwt.sign({
                                        email: user[0].email,
                                        userId: user[0]._id
                                    }, 
                                    keys.JWT_KEY,
                                    {
                                        expiresIn: "1h"
                                    }
                                );
        
                                return res.status(200).json({
                                    message: 'Auth Successful',
                                    token: token,
        
                                })

                            } else {
                                return res.status(401).json({
                                    errors: { global: 'Incorrect password, please try again' }
                                });
                            }
                        })
                    }
                })
                .catch(err => {
                    console.log("err: ", err);
                    res.status(500).json({
                        errors: { global: err }
                    });
                }) 

        } else {
            console.log("errors: ", errors )
            return res.status(400).json({ errors })
        }
    });

    app.post('/api/passwd_forgot', (req, res, next) => {
        // console.log("red.body: ", req.body)

        const { errors, isValid } = validation(req.body);
        if(isValid) {

            if(req.body.email === keys.CATHY_EMAIL) {
                if(req.body.secret_code === keys.ADMIN_SECRET_CODE) {
    
                    User.findOne({ email: req.body.email.trim().toLowerCase() })
                        .exec()
                        .then(user => {
                            if(!user) {
                                return res.status(401).json({
                                    // message: 'Mail not found, user does not exist'
                                    errors : 'Mail not found, user does not exist'
                                });
                            }
    
                            const token = jwt.sign({
                                email: user.email,
                                userId: user._id
                            },
                            keys.JWT_KEY,
                                {
                                    expiresIn: 60 * 30 // 30 minutes
                                }  
                            );
            
                            user.resetPasswordToken = token;
                            user.resetPasswordExpires = Date.now() + 1800000; // 30 minutes
    
                            try {
                                user.save()
                                    .then(result => {
                                        // console.log("result: " + result);
                                        res.status(200).json({
                                            message: 'Sucessful, you can close this window and please check your email',
                                            token: token
                                        })
                                    })
                            }
                            catch (err) {
                                console.log("err in 422: ", err)
                                return res.status(422).json({
                                    errors : { global: err }
                                })
                            }
    
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
                            var mailOptions = {
                                // to: user.email,
                                to: 'chch6597@colorado.edu',
                                from: keys.EMAIL_FROM,
                                subject: 'Re: For Mother nature Password Reset',
                                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                keys.HTTP_NAME + req.headers.host + '/recover/passwd_reset/' + token + '\n\n' +
                                'If you did not request this, please ignore this email and your password will remain unchanged.\n',
                            };
            
                            smtpTransport.sendMail(mailOptions, (err, info) => {
                                if (err) {
                                    return console.log('err: ', err)
                                }
                                else {
                                    // console.log('Message sent: %s', JSON.stringify(info, null, 4));
                                    // console.log('Message URL: %s', nodemailer.getTestMessageUrl(info))
                                    done(err, 'done');
                                }
                            });
    
                        })
                        .catch(err => {
                            console.log("err: ", err);
                            res.status(500).json({
                                error: err
                            })
                        })
                } else {
                    return res.status(500).json({
                        // message: 'Mail not found, user does not exist'
                        errors : { global: 'Incorrectly secret code' }
                    });
                }
    
            } else {
                // Normal user
                // findOne and find slightly different
                User.findOne({ email: req.body.email.trim().toLowerCase() })
                    .exec()
                    .then(user => {
                        if(!user) {
                            return res.status(401).json({
                                // message: 'Mail not found, user does not exist'
                                errors : { global: 'Mail not found, user does not exist'}
                            });
                        }
                        // console.log("user: ", user)
                        const token = jwt.sign({
                            email: user.email,
                            userId: user._id
                        },
                        keys.JWT_KEY,
                            {
                                expiresIn: 60 * 30 // 30 minutes
                            }  
                        );
        
                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 1800000; // 30 minutes
        
                        try {
                            user.save()
                                .then(result => {
                                    // console.log("result: " + result);
                                    res.status(200).json({
                                        message: 'Sucessful, please go check your email',
                                        token: token
                                    })
                                })
                        }
                        catch (err) {
                            console.log("err in 422: ", err)
                            return res.status(422).json({
                                errors : { global: err }
                            })
                        }
        
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
                        var mailOptions = {
                            // to: user.email,
                            to: 'chch6597@colorado.edu',
                            from: keys.EMAIL_FROM,
                            subject: 'Re: For Mother nature Password Reset',
                            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                            keys.HTTP_NAME + req.headers.host + '/recover/passwd_reset/' + token + '\n\n' +
                            'If you did not request this, please ignore this email and your password will remain unchanged.\n',
                        };
        
                        smtpTransport.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                return console.log('err: ', err)
                            }
                            else {
                                // console.log('Message sent: %s', JSON.stringify(info, null, 4));
                                // console.log('Message URL: %s', nodemailer.getTestMessageUrl(info))
                                done(err, 'done');
                            }
                        });
                    }
                )
                .catch(err => {
                    console.log("err in 500: ", err);
                    res.status(500).json({
                        // error: err
                        errors : { global: err }
                    })
                })
            }

        } else {
            console.log("errors: ", errors )
            return res.status(400).json({ errors })
        }
    });

    // first login
    app.post('/api/user/first-login/:token', (req, res) => {
        // console.log("req.body: ", req.body)
        // console.log("req.params: ", req.params)

        const { password, passwordConfirm } = req.body;
        if(password !== passwordConfirm) {
            return res.status(400).json({ errors: { global: 'Password mismatch' }})
        } else {
            const result = Joi.validate(req.body, schema);

            if(result.error) {
                console.log("error result 1: ", result.error);
                // return res.status(401).send({ error: result.error.details });
                return res.status(401).json({ errors: { global: 'Password should be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'} });
            } else {
                // first time
                bcrypt.hash(password, 12, (error, hash) => {
                    db.collection('users').findOneAndUpdate(
                        { resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }},
                        { $set: {
                            password: hash,
                            resetPasswordToken: undefined,
                            resetPasswordExpires: undefined
                            }
                        },
                        { returnOriginal: false }, // This is important
                        (err, user) => {
                            // console.log('user in here: ', user)
                            if(err) {
                                return res.status(500).json({ error: { global: err } });
                            } else {
                                // console.log("user: ", user)
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
                                var mailOptions = {
                                    // to: user.email,
                                    to: 'chch6597@colorado.edu',
                                    from: keys.EMAIL_FROM,
                                    subject: 'Re: Successfully changed your password',
                                    text: 'Hello, ' + user.value.firstname + ' ' + user.value.lastname + '\n\n' +
                                        'This is a confirmation that the password for your account ' + user.value.email + ' for ForMotherNature has just been changed.\n' +
                                        'Please do not reply directly this email.\n'
                                };
                
                                smtpTransport.sendMail(mailOptions, (err, info) => {
                                    if (err) {
                                        console.log('err: ', err)
                                        return res.status(500).json({ errors: err})
                                    }
                                    else {                
                                        // res.status(200).json({ user: user.value })
                                        res.status(200).json({ message: 'Successful changed your password' })
                                        done(err, 'done');
                                    }
                                });

                            }
                        }
                    )
                
                    if(error) {
                        res.status(400).json({
                            errors: error
                        })
                    }
                })
            }
        }
    });

    // Password reset
    app.post('/api/passwd_reset/:token', signinLimiter, function(req, res) {
        const { password, passwordConfirm } = req.body;
        // console.log("req.params.token: ", req.params.token)

        // console.log("req.body: ", req.body)
        // console.log("req.params: ", req.params)

        const { errors, isValid } = validation(req.body);
        if(isValid) {

            if(password === passwordConfirm) {
                const result = Joi.validate( req.body, schema );
    
                if(result.error) {
                    // console.log("error result 1: ", result.error);
                    return res.status(401).json({ errors: { global: 'Password should be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'} });
                } else {
    
                    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }})
                        .exec()
                        .then(user => {
                            // console.log("user: ", user)
                            if(!user) {
                                return res.status(400).json({ errors: { global: 'No such user with the email' }})
                            } else {
    
                                bcrypt.compare(password, user.password, (err, result) => {
                                    if(err) {
                                        console.log("err in bcrypt compare in pw reset: ", err)
                                    }
                                    // console.log("result: ", result)
                                    if(result) {
                                        return res.status(400).json({ errors: { global: 'Your password is too similar with previous one' }})
                                    } else {
    
                                        bcrypt.hash(password, 12, (error, hash) => {
    
                                            if(user.password === hash) {
                                                return res.status(401).json({ errors: { global: 'Your password is too similar with previous one. Try again!' }})
                                            }
            
                                            user.password = hash;
                                            user.resetPasswordToken = undefined;
                                            user.resetPasswordExpires = undefined;
            
                                            try{
                                                user.save()
                                            }
                                            catch(error) {
                                                return res.status(400).json({ errors: { global: 'User saving wrong' }})
                                            }
                                            
                                            if(error) {
                                                console.log("error: ", error)
                                            }
                                        })
            
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
                                        var mailOptions = {
                                            // to: user.email,
                                            to: 'chch6597@colorado.edu',
                                            from: keys.EMAIL_FROM,
                                            subject: 'Re: Successfully changed your password',
                                            text: 'Hello, ' + user.firstname + ' ' + user.lastname + '\n\n' +
                                                'This is a confirmation that the password for your account ' + user.email + ' for ForMotherNature has just been changed.\n' +
                                                'You can login with your new password by clicking the following link.\n\n' +
                                                keys.HTTP_NAME + req.headers.host + '/user/login' + '\n\n' +
                                                'Please do not reply directly this email.\n'
                                        };
                        
                                        smtpTransport.sendMail(mailOptions, (err, info) => {
                                            if (err) {
                                                console.log('err: ', err)
                                                return res.status(500).json({ errors: err})
                                            }
                                            else {                
            
                                                res.status(200).json({ user: user })
                                                // res.status(200).json({ message: 'Successful changed your password' })
                                                done(err, 'done');
                                            }
                                        });
    
    
                                    }
                                })
    
                            }
                        })
    
                }
    
            } else {
                return res.status(401).json({
                    // return res.status(401).json({ errors: { global: 'Your password is too similar with previous one' }})
                    error: { global: 'Password Mismatch'},
                })
            }

        } else {
            console.log("errors in inValid: ", errors )
            return res.status(400).json({ errors })
        }
    });
    
    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
};

// bcrypt.hash(password, 12, (error, hash) => {
//     db.collection('users').findOneAndUpdate(
//         { resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }},
//         { $set: {
//             password: hash,
//             resetPasswordToken: undefined,
//             resetPasswordExpires: undefined
//             }
//         },
//         { returnOriginal: false }, // This is important
//         (err, user) => {
//             // console.log('user in here: ', user)
//             if(err) {
//                 return res.status(500).json({ error: { global: err } });
//             } else {
//                 // console.log("user: ", user)
//                 const smtpTransport = nodemailer.createTransport({
//                     service: 'Gmail', 
//                     auth: {
//                         type: 'OAuth2',
//                         user: 'chch6597@colorado.edu', // This should be the email addr with the enable API
//                         clientId: keys.GOOGLE_EMAIL_CLIENT_ID,
//                         clientSecret: keys.GOOGLE_EMAIL_CLIENT_SECRET,
//                         refreshToken: keys.GOOGLE_EMAIL_REFRESH_TOKEN,
//                         accessToken: keys.GOOGLE_EMAIL_ACCESS_TOKEN,
//                     },
//                 });
//                 var mailOptions = {
//                     // to: user.email,
//                     to: 'chch6597@colorado.edu',
//                     from: keys.EMAIL_FROM,
//                     subject: 'Re: Successfully changed your password',
//                     text: 'Hello, ' + user.value.firstname + ' ' + user.value.lastname + '\n\n' +
//                         'This is a confirmation that the password for your account ' + user.value.email + ' for ForMotherNature has just been changed.\n' +
//                         'Please do not reply directly this email.\n'
//                 };

//                 smtpTransport.sendMail(mailOptions, (err, info) => {
//                     if (err) {
//                         console.log('err: ', err)
//                         return res.status(500).json({ errors: err})
//                     }
//                     else {
//                         // console.log('Message sent: %s', JSON.stringify(info, null, 4));
//                         // console.log('Message URL: %s', nodemailer.getTestMessageUrl(info))

//                         // res.status(200).json({ user: user.value })
//                         res.status(200).json({ user: 'Successful changed your password' })
//                         done(err, 'done');
//                     }
//                 });
//             }
//         }
//     )

//     if(error) {
//         res.status(400).json({
//             errors: error
//         })
//     }

// })


// "start": "node index.js",