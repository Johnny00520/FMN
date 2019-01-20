const keys = require('../config/keys');
const User = require('../classModels/User');
const mongoose = require('mongoose');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

//////////////////////////////////////////////////////////////////
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, files, cb) => {
        cb(null, './routes/uploads/');
        // cb(null, `./routes/uploads/${req.body.givenName}`);
    },
    filename: (req, file, cb) => {
        var datetimestamp = new Date().toISOString();
        // cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        cb(null, file.fieldname + '-' + datetimestamp + '-' + file.originalname)
        // cb(null, file.filename);
    }
});

const fileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
}

const upload = multer({ 
    storage: storage, 
    limits: {
        fieldSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
//////////////////////////////////////////////////////////////////
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dqvawqnkh',
    api_key: keys.CLOUDINARY_API_KEY,
    api_secret: keys.CLOUDINARY_API_SECRET_KEY
});
//////////////////////////////////////////////////////////////////

function validate(data) {
    let errors = {};
   
    if(data.firstname === '') errors.firstname = 'Cannot be empty';
    if(data.lastname === '') errors.lastname = 'Cannot be empty';
    if(data.notes === '') errors.notes = 'Cannot be empty';

    const isValid = Object.keys(errors).length === 0;

    return { errors, isValid };
}
//////////////////////////////////////////////////////////////////

module.exports = (app, db) => {

    app.get('/api/image_panel/allAdmin', (req, res) => {
        db.collection('users').find({ isAdmin: true }).toArray((err, admins) => {
            res.json({ admins })
        });
        // db.collection('users').find({}).toArray((err, admins) => {
        //     res.json({ admins })
        // });
    })

    app.post('/api/image_panel/admin', upload.single('file'), async(req, res) => {
        // console.log("req.file: ", req.file)
        // console.log("req.body: ", req.body)

        if(req.file) {
            const userData = JSON.parse(req.body.userData)
            const { errors, isValid } = validate(userData)

            if(isValid) {

                const {
                    firstname,
                    lastname,
                    email,
                    notes,
                    websiteAddress,
                    otherLink1,
                    otherLink2,
                    otherLink3,
                    facebook,
                    pleage1,
                    pleage1Percent,
                    pleage2,
                    pleage2Percent
                } = userData;

                db.collection('users').find({ email: email.trim().toLowerCase()}).toArray((err, user) => {
                    if(err) throw err

                    if(user.length >= 1) {
                        return res.status(500).json({ errors: { global: 'This email address has been registered!' }});
                    } else {
                        const token = jwt.sign({
                            email: user.email,
                            userId: user._id
                        },
                        keys.JWT_KEY,
                            {
                                expiresIn: 60 * 30 // 30 minutes
                            }
                        );

                        let upload_image = () => {
                            new Promise((resolve, reject) => {
                                cloudinary.uploader.upload(__dirname + '/uploads/' + req.file.filename, (result, error) => {
                                    if(error) reject(error)
                                    else resolve(result)
                                }, {
                                    folder: `users/${firstname}_${lastname}`
                                })
                            })
                            .then(result => {
                                console.log("result: ", result)
                                db.collection('users').insertOne({
                                    _id: new mongoose.Types.ObjectId(),
                                    public_id: result.public_id,
                                    filePathNode: req.file.path,
                                    firstname,
                                    lastname,
                                    displayName: firstname + ' ' + lastname,
                                    email: email,
                                    isAdmin: true,
                                    userImagePath: result.secure_url,
                                    userImagePathAlt: firstname + ' ' + lastname,
                                    contributor: 'admin',
                                    notes: notes,
                                    websiteAddress: websiteAddress,
                                    otherLink1: otherLink1,
                                    otherLink2: otherLink2,
                                    otherLink3: otherLink3,
                                    facebook: facebook,
                                    pleage1: pleage1,
                                    pleage1Percent: pleage1Percent,
                                    pleage2: pleage2,
                                    pleage2Percent: pleage2Percent,
                                    resetPasswordToken: token,
                                    resetPasswordExpires: Date.now() + 1800000, // 30 minutes
                                    password: null,
                                    createdDate: new Date(Date.now()).toLocaleString('en-US', {timeZone: 'America/Denver'}),

                                }, (err, adminResult) => {
                                    if(err) {
                                        console.log("err: ", err)
                                        res.status(500).json({ errors: { global: err.errmsg }});
                                    } else {

                                        db.collection('pendingUsers').findOneAndDelete({ email: email }, (err, user) => {
                                            if(err) {
                                                return res.json({ errors: { global: err }})
                                            }
                                            console.log("user in pendingUsers: ", user)
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
    
                                        const mailOptions = {
                                            // to: user.email,
                                            to: 'chch6597@colorado.edu',
                                            // to: 'cathy@formothernature.com',
                                            from: keys.EMAIL_FROM,
                                            subject: 'Re: Finish up setting password',
                                            text: 'Dear ' + firstname + ' ' + lastname + ',\n\n' +
                                                'Thank you for joining ForMotherNature,\n\n' +
                                            'You account: \n\n' + email + '\n\n' +
                                            'Please click on the follwoing link, or paste this into your browser to complete the process: \n\n' +
                                            // production
                                            // 'https://' + req.headers.host + '/recover/passwd_reset/' + token + '\n\n',
                                            // Development
                                            // keys.HTTP_NAME + req.headers.host + '/recover/passwd_reset/' + token + '\n\n',
                                            keys.HTTP_NAME + req.headers.host + '/user/first-login/' + token + '\n\n',
                                        };
                
                                        smtpTransport.sendMail(mailOptions, (err, info) => {
                                            if (err) {
                                                console.log('err: ', err)
                                                return res.status(500).json({ errors: { global: 'something wrong' }});
                                            }
                                            else {
                                                // console.log('Message sent: %s', JSON.stringify(info, null, 4));
                                                // console.log('Message URL: %s', nodemailer.getTestMessageUrl(info))

                                                res.status(200).json({ admin: adminResult.ops[0] });
                                                try{
                                                    fs.unlinkSync(req.file.path)
                                                }
                                                catch(err) {
                                                    console.log(err)
                                                }

                                                done(err, 'done');
                                            }
                                        });

                                    }
                                })

                            })
                            .catch(error => console.log("error: ", error))
                        }
                        upload_image();

                    }
                })

            } else {
                res.status(400).json({ errors })
            }

        } else {
            const userData = JSON.parse(req.body.userData)
            const { errors, isValid } = validate(userData)

            if(isValid) {

                const {
                    firstname,
                    lastname,
                    email,
                    notes,
                    websiteAddress,
                    otherLink1,
                    otherLink2,
                    otherLink3,
                    facebook,
                    pleage1,
                    pleage1Percent,
                    pleage2,
                    pleage2Percent
                } = userData;

                db.collection('users').find({ email: email.trim().toLowerCase()}).toArray((err, user) => {
                    if(err) throw err

                    if(user.length >= 1) {
                        return res.status(500).json({ errors: { global: 'This email address has been registered!' }});
                    } else {
                        const token = jwt.sign({
                            email: user.email,
                            userId: user._id
                        },
                        keys.JWT_KEY,
                            {
                                expiresIn: 60 * 30 // 30 minutes
                            }
                        );

                        db.collection('users').insertOne({
                            _id: new mongoose.Types.ObjectId(),
                            public_id: null,
                            filePathNode: null,
                            firstname,
                            lastname,
                            displayName: firstname + ' ' + lastname,
                            email: email,
                            isAdmin: true,
                            userImagePath: null,
                            userImagePathAlt: firstname + ' ' + lastname,
                            contributor: 'admin',
                            notes: notes,
                            websiteAddress: websiteAddress,
                            otherLink1: otherLink1,
                            otherLink2: otherLink2,
                            otherLink3: otherLink3,
                            facebook: facebook,
                            pleage1: pleage1,
                            pleage1Percent: pleage1Percent,
                            pleage2: pleage2,
                            pleage2Percent: pleage2Percent,
                            resetPasswordToken: token,
                            resetPasswordExpires: Date.now() + 1800000, // 30 minutes
                            password: null,
                            createdDate: new Date(Date.now()).toLocaleString('en-US', {timeZone: 'America/Denver'}),

                        }, (err, adminResult) => {

                            db.collection('pendingUsers').findOneAndDelete({ email: email }, (err, user) => {
                                if(err) {
                                    return res.json({ errors: { global: err }})
                                }
                                console.log("user in pendingUsers: ", user)
                            });

                            if(err) {
                                console.log("err: ", err)
                                res.status(500).json({ errors: { global: err.errmsg }});
                            } else {

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
                                    // to: user.email,
                                    to: 'chch6597@colorado.edu',
                                    // to: 'cathy@formothernature.com',
                                    from: keys.EMAIL_FROM,
                                    subject: 'Re: Finish up setting password',
                                    text: 'Dear ' + firstname + ' ' + lastname + ',\n\n' +
                                        'Thank you for joining ForMotherNature,\n\n' +
                                    'You account: \n\n' + email + '\n\n' +
                                    'Please click on the follwoing link, or paste this into your browser to complete the process: \n\n' +
                                    // production
                                    // 'https://' + req.headers.host + '/recover/passwd_reset/' + token + '\n\n',
                                    // Development
                                    keys.HTTP_NAME + req.headers.host + '/user/first-login/' + token + '\n\n',
                                };
        
                                smtpTransport.sendMail(mailOptions, (err, info) => {
                                    if (err) {
                                        console.log('err: ', err)
                                        return res.status(500).json({ errors: { global: 'something wrong' }});
                                    }
                                    else {
                                        // console.log('Message sent: %s', JSON.stringify(info, null, 4));
                                        // console.log('Message URL: %s', nodemailer.getTestMessageUrl(info))

                                        res.status(200).json({ admin: adminResult.ops[0] });
                                        done(err, 'done');
                                    }
                                });
                            }
                        })

                    }
                })


            } else {
                res.status(400).json({ errors })
            }
        }
    });

    app.put('/api/image_panel/admin/:_id', upload.single('file'), async (req, res) => {
        // console.log("req.file: ", req.file)
        // console.log("req.body: ", req.body)
        // console.log("req.params: ", req.params)

        const userData = JSON.parse(req.body.userData);
        if(req.file) {

            const { errors, isValid } = validate(userData)

            if(isValid) {
                const {
                    firstname,
                    lastname,
                    email,
                    websiteAddress,
                    facebook,
                    otherLink1,
                    otherLink2,
                    otherLink3,
                    pleage1,
                    pleage1Percent,
                    pleage2,
                    pleage2Percent,
                    notes
                } = userData
    
                let upload_image = () => {
                    // let upload_res = new Promise((resolve, reject) => {
                    new Promise((resolve, reject) => {
                        cloudinary.uploader.upload(__dirname + '/uploads/' + req.file.filename, (result, error) => {
    
                            if (error) reject(error)
                            else resolve(result);
                        }
                        , {
                            folder: `/users/${firstname}_${lastname}`
                        })
                    })
                    // 'all' expects array as an argument
                    // Promise.all(upload_res)
                    .then(result => {
                        // User.find({ _id: new mongoose.Types.ObjectId(req.params._id) })
                        db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(req.params._id) })

                            // .exec()
                            .then(user => {
                                // console.log("result: ", result)
                                // console.log("user: ", user)
    
                                if(user.filePathNode !== null) {
                                    try {
                                        //remove file
                                        fs.unlinkSync(req.file.path)
                                        
                                    } catch(err) {
                                        console.error(err)
                                    }
                                }
    
                                cloudinary.uploader.destroy(user.public_id, (result, err) => {
                                    // console.log("result in cloudinary destroy: ", result)
    
                                    if(err) {
                                        return res.status(500).json({ errors: { global: err } });
                                    }
                                });
    
                                db.collection('users').findOneAndUpdate(
                                    { _id: new mongoose.Types.ObjectId(req.params._id) },
                                    { $set: {
                                        firstname,
                                        lastname,
                                        email,
                                        websiteAddress,
                                        facebook,
                                        otherLink1,
                                        otherLink2,
                                        otherLink3,
                                        pleage1,
                                        pleage1Percent,
                                        pleage2,
                                        pleage2Percent,
                                        notes,
                                        public_id: result.public_id,
                                        userImagePath: result.secure_url,
                                        userImagePathAlt: firstname + ' ' + lastname,
                                        filePathNode: req.file.path
                                        },
                                    },
                                    { returnOriginal: false }, // This is important
                                    ( err, newAdminResult ) => {
                                        // console.log("result in db.collection: ", result)
                                        if(err) {
                                            return res.status(500).json({ errors: { global: err } });
                                        } else {
                                            res.status(200).json({
                                                admin: newAdminResult.value
                                            })
                                        }
    
                                    }
                                )
                            })
                            .catch(error => console.log("error: ", error))
                    })
                    .catch(error => console.log("error: ", error))
                }
                upload_image()
    
            } else {
                res.status(400).json({ errors });
            }

        } else {

            const { errors, isValid } = validate(userData)

            if(isValid) {

                const {
                    firstname,
                    lastname,
                    email,
                    websiteAddress,
                    facebook,
                    otherLink1,
                    otherLink2,
                    otherLink3,
                    pleage1,
                    pleage1Percent,
                    pleage2,
                    pleage2Percent,
                    notes
                } = userData
                // console.log("user: ", user)
                db.collection('users').findOneAndUpdate(
                    { _id: new mongoose.Types.ObjectId(req.params._id) },
                    { $set: {
                        firstname,
                        lastname,
                        email,
                        websiteAddress,
                        facebook,
                        otherLink1,
                        otherLink2,
                        otherLink3,
                        pleage1,
                        pleage1Percent,
                        pleage2,
                        pleage2Percent,
                        notes,
                        },
                    },
                    { returnOriginal: false }, // This is important
                    ( err, newAdminResult ) => {
                        // console.log("result in db.collection: ", result)
                        if(err) {
                            return res.status(500).json({ errors: { global: err } });
                        } else {
                            res.status(200).json({
                                admin: newAdminResult.value
                            })
                        }

                    }
                )    
                
            } else {
                if(errors) {
                    res.status(400).json({ errors });
                }
            }
        }
    });

    app.delete('/api/image_panel/admin/:id', async (req, res) => {
        // console.log("req.params: ", req.params)
        db.collection('users').findOneAndDelete(
            { _id: new mongoose.Types.ObjectId(req.params.id) },
            (err, user) => {
                // console.log("user: ", user)
                cloudinary.uploader.destroy(user.value.public_id, (result, err) => {
                    // console.log("result in cloudinary destroy: ", result)
                    if(err) {
                        console.log("err in cloudinary delete: ", err)
                        return res.status(500).json({ errors: { global: err } });
                    }
                });
                if(err) {
                    console.log("err in findOneAndDelete: ", err)
                    return res.status(500).json({ errors: { global: err } });
                } else {
                    res.status(200).json({ message: 'successful' });
                }
            }
        )

        // db.collection('users').deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) }, (err, result) => {
        //     if(err) { res.status(500).json({ errors: { global: err }}); return; }

        //     res.json({});
        // })

        // User.find({ _id: new mongoose.Types.ObjectId(req.params.id) })
        //     .exec()
        //     .then( user => {
        //         // console.log("user: ", user)
        //         cloudinary.uploader.destroy(user[0].public_ids[0], (result, err) => {
        //             // console.log("result in cloudinary destroy: ", result)
        //             if(err) {
        //                 return res.status(500).json({ error: { global: err } });
        //             }
        //         });

        //         if(user[0].filePathNode[0] !== null) {
        //             try {
        //                 //remove file
        //                 fs.unlinkSync(user[0].filePathNode[0])
                        
        //             } catch(err) {
        //                 console.error(err)
        //             }
        //         }

        //         db.collection('users').findOneAndUpdate(
        //             { _id: new mongoose.Types.ObjectId(req.params.id) },
        //             { $set: {
        //                 public_ids: [null],
        //                 userImagaPath: null,
        //                 filePathNode: [null]
        //                 },
        //             },
        //             { returnOriginal: false }, // This is important
        //             ( err, result ) => {
        //                 if(err) {
        //                     return res.status(500).json({ error: { global: err } });
        //                 }
        //                 console.log("result: ", result)
        //                 res.status(200).json({
        //                     admin: result.value
        //                 })
        //             }
        //         )
        //     })
        //     .catch(error => console.log("error: ", error))

    })

    // Get specific user
    app.get('/api/image_panel/existingAdmin/:_id', (req, res) => {
        db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(req.params._id)}, (err, admin) => {
            res.json({ admin });
        })
    });
}