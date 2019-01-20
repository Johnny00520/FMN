const User = require('../classModels/User');
const keys = require('../config/keys');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');

//////////////////////////////////////////////////////////////////
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, files, cb) => {
        cb(null, './routes/uploads/');
        // cb(null, `./routes/uploads/${req.body.firstname}`);
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
function isEmailValid(emailAddress) {
    return !! emailAddress.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}
function validate(data) {
    let errors = {};

    if(data.firstname === '') errors.firstname = "Cannot be empty";
    if(data.lastname === '') errors.lastname = "Cannot be empty";
    if(data.email === '') errors.email = "Cannot be empty";
    if(data.contributor === '') errors.contributor = "Cannot be empty";
    if(!isEmailValid(data.email)) errors.email = "Email is not valid";
   
    const isValid = Object.keys(errors).length === 0;

    return { errors, isValid };
}

module.exports = (app, db) => {

    app.get('/api/existingUsers', (req, res, next) => {
        db.collection('users').find({}).toArray((err, users) => {
            res.json({ users })
        });

    });

    // app.post('/api/existingUsers', upload.single('file'), (req, res) => {
    app.post('/api/existingUsers', async (req, res) => {
        // console.log("req.body: ", req.body)
        const { errors, isValid } = validate(req.body);
        if(isValid) {
            const {
                firstname,
                lastname,
                email,
                contributor,
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
            } = req.body

            db.collection('users').find({ email: email }).toArray((err, user) => {
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

                    let status, isAdmin, is;
                    if(contributor === 'admin') {
                        status = 'admin';
                        isAdmin = true;
                        isArtist = false;
                    } else {
                        status = 'artist';
                        isAdmin = false;
                        isArtist = true;
                    }
                    

                    db.collection('users').insertOne({
                        _id: new mongoose.Types.ObjectId(),
                        public_id: null,
                        filePathNode: null,
                        firstname,
                        lastname,
                        contributor: status,
                        displayName: firstname + ' ' + lastname,
                        email: email,
                        isAdmin: isAdmin,
                        isArtist: isArtist,
                        userImagePath: null,
                        userImagePathAlt: firstname + ' ' + lastname,
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

                    }, (err, Result) => {
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
                                keys.HTTP_NAME + req.headers.host + '/recover/passwd_reset/' + token + '\n\n',
                            };
    
                            smtpTransport.sendMail(mailOptions, (err, info) => {
                                if (err) {
                                    console.log('err: ', err)
                                    return res.status(500).json({ errors: { global: 'something wrong' }});
                                }
                                else {
                                    // console.log('Message sent: %s', JSON.stringify(info, null, 4));
                                    // console.log('Message URL: %s', nodemailer.getTestMessageUrl(info))

                                    res.status(200).json({ user: Result.ops[0] });
                                    done(err, 'done');
                                }
                            });
                        }
                    })

                }
            })

            // User.find({ email: email })
            //     .exec()
            //     .then(user => {
            //         if(user.length >= 1) {
            //             return res.status(500).json({ errors: { global: 'This email address has been registered!' }});
            //         } else {
            //             const token = jwt.sign({
            //                 email: user.email,
            //                 userId: user._id
            //             },
            //             keys.JWT_KEY,
            //                 {
            //                     expiresIn: 60 * 30 // 30 minutes
            //                 }
            //             );  

            //             const newUser = new User({
            //                 _id: new mongoose.Types.ObjectId(),
            //                 email: email,
            //                 contributor: contributor,
            //                 displayName: firstname,
            //                 firstname: firstname,
            //                 lastname: lastname,
            //                 notes: notes,
            //                 websiteAddress: websiteAddress,
            //                 otherLink1: otherLink1,
            //                 otherLink2: otherLink2,
            //                 otherLink3: otherLink3,
            //                 facebook: facebook,
            //                 pleage1: pleage1,
            //                 pleage1Percent: pleage1Percent,
            //                 pleage2: pleage2,
            //                 pleage2Percent: pleage2Percent,
            //                 createdDate: new Date(Date.now()).toLocaleString('en-US', {timeZone: 'America/Denver'}),
            //                 resetPasswordToken: token,
            //                 resetPasswordExpires: Date.now() + 1800000, // 30 minutes
            //                 // _user: User._user,
            //                 userImagaPath: null,
            //             });

            //             if(contributor === keys.ADMIN_STATUS_CHECK) {
            //                 newUser.isAdmin = true;
            //             }

            //             if(contributor === keys.ARTIST_STATUS_CHECK) {
            //                 newUser.isArtist = true
            //             }

            //             const smtpTransport = nodemailer.createTransport({
            //                 service: 'Gmail', 
            //                 auth: {
            //                     type: 'OAuth2',
            //                     user: 'chch6597@colorado.edu', // This should be the email addr with the enable API
            //                     clientId: keys.GOOGLE_EMAIL_CLIENT_ID,
            //                     clientSecret: keys.GOOGLE_EMAIL_CLIENT_SECRET,
            //                     refreshToken: keys.GOOGLE_EMAIL_REFRESH_TOKEN,
            //                     accessToken: keys.GOOGLE_EMAIL_ACCESS_TOKEN,
            //                 },
            //             });

            //             const mailOptions = {
            //                 // to: user.email,
            //                 to: 'chch6597@colorado.edu',
            //                 // to: 'cathy@formothernature.com',
            //                 from: keys.EMAIL_FROM,
            //                 subject: 'Re: Finish up setting password',
            //                 text: 'Dear ' + firstname + ' ' + lastname + ',\n\n' +
            //                     'Thank you for joining ForMotherNature,\n\n' +
            //                 'You account: \n\n' + email + '\n\n' +
            //                 'Please click on the follwoing link, or paste this into your browser to complete the process: \n\n' +
            //                 // production
            //                 // 'https://' + req.headers.host + '/recover/passwd_reset/' + token + '\n\n',
            //                 // Development
            //                 keys.HTTP_NAME + req.headers.host + '/recover/passwd_reset/' + token + '\n\n',
            //             };

            //             smtpTransport.sendMail(mailOptions, (err, info) => {
            //                 if (err) {
            //                     console.log('err: ', err)
            //                     return res.status(500).json({ errors: { global: 'something wrong' }});
            //                 }
            //                 else {
            //                     // console.log('Message sent: %s', JSON.stringify(info, null, 4));
            //                     // console.log('Message URL: %s', nodemailer.getTestMessageUrl(info))
            //                     done(err, 'done');
            //                 }
            //             });

            //             try {
            //                 newUser
            //                     .save()
            //                     .then(result => {
            //                         // console.log("result: " + result);
            //                         res.status(200).json({ message: 'Successful' });
            //                     })
            //             }
            //             catch(err) {
            //                 console.log("err in user route in post method: ", err);
            //                 return res.status(500).json({ errors: { global: 'Something went wrong: ' + err }});
            //             }
            //         }
            //     })

        } else {
            console.log("errors: ", errors )
            return res.status(400).json({ errors })
        }
    });

    ////////////////////////////////////////////////////////////////
    // Search Bar
    app.get(`/api/searchPeople/:data`, (req, res) => {

        const { data } = req.params
        // console.log("data: ", data);
        db.collection('users').find({
            "firstname": { $regex: new RegExp(data, "i" )}
        }).toArray((err, users) => {
            if(err) {
                res.status(500).json({ errors: { global: 'Something went wrong' }});
            } else {
                // console.log("result.ops[0]: ", result.ops[0])
                res.status(200).json({ users });
            }
        })
    });

    ////////////////////////////////////////////////////////////////
    // Sorting
    app.get(`/api/existingUsersSoryBy/:selection`, (req, res) => {
        const { selection } = req.params;
        // console.log("selection: ", selection);
        if(selection === 'aescending') {
            db.collection('users').find({}).sort('createdDate', 1).toArray((err, users) => {
                if(err) {
                    res.status(500).json({ errors: { global: 'Something went wrong' }});
                } else {
                    res.status(200).json({ users });
                }
            })
        }
        if(selection === 'descending') {
            db.collection('users').find({}).sort('createdDate', -1).toArray((err, users) => {
                if(err) {
                    res.status(500).json({ errors: { global: 'Something went wrong' }});
                } else {
                    res.status(200).json({ users });
                }
            });
        }
        // if(selection === 'active') {
        //     db.collection('users').find({ TaskDone: false }).toArray((err, users) => {
        //         if(err) {
        //             res.status(500).json({ errors: { global: 'Something went wrong' }});
        //         } else {
        //             res.status(200).json({ users });
        //         }
        //     });
        // }
        // if(selection === 'completed') {
        //     db.collection('users').find({ TaskDone: true }).toArray((err, users) => {
        //         if(err) {
        //             res.status(500).json({ errors: { global: 'Something went wrong' }});
        //         } else {
        //             res.status(200).json({ users });
        //         }
        //     });
        // }

    });

    ////////////////////////////////////////////////////////////////
    app.put('/api/existingUsers/:_id', upload.array('file', 10), async (req, res) => {
        // console.log("req.body: ", req.body)
        // console.log("req.params: ", req.params)
        if(req.files) {
            const userData = JSON.parse(req.body.userData);
            // console.log("userData: ", userData)
            const { errors, isValid } = validate(userData);

            if(isValid) {
                const {
                    firstname,
                    lastname,
                    email,
                    contributor,
                    notes,
                    websiteAddress,
                    otherLink1,
                    otherLink2,
                    otherLink3,
                    facebook,
                    pleage1,
                    pleage1Percent,
                    pleage2,
                    pleage2Percent,
                } = userData

                const files = req.files;
                let public_ids = [];
                let userImagaPath = null;
                let artWorkImagesPath = [];
                let filePathNode = [];

                let upload_image = () => {
                    let upload_res = files.map(file => new Promise((resolve, reject) => {
                        cloudinary.uploader.upload(__dirname + '/uploads/' + file.filename, (result, error) => {
                            
                            filePathNode.push(file.path);
                            if (error) reject(error)
                            else resolve(result);
                        }
                        , {
                            folder: `/users/${firstname}_${lastname}`
                        })
                    }))
                    Promise.all(upload_res)
                    .then(results => {
                        for(let i = 0; i < results.length; i++) {
                            
                            public_ids.push(results[i].public_id);

                            if(i === 0) {
                                userImagaPath = results[i].secure_url;
                            }
                            if(i >= 1) {
                                artWorkImagesPath.push(results[i].secure_url);
                            }
                        }

                        db.collection('users').findOneAndUpdate(
                            { _id: new mongoose.Types.ObjectId(req.params._id) },
                            // What infor needs to update
                            { $set: { 
                                firstname, 
                                lastname, 
                                email, 
                                contributor, 
                                notes, 
                                websiteAddress, 
                                otherLink1, 
                                otherLink2, 
                                otherLink3,
                                facebook,
                                pleage1,
                                pleage1Percent,
                                pleage2,
                                pleage2Percent,
                                public_ids,
                                userImagaPath,
                                artWorkImagesPath,
                                filePathNode,
                                userImagaPathAlt: firstname.trim() + " " + lastname.trim(),
                                } 
                            },
                            { returnOriginal: false }, // This is important
                            ( err, result ) => {
                                if(err) {
                                    return res.status(500).json({ error: { global: err } });
                                }
                                res.json({
                                    user: result.value
                                })
                            }
                        )

                    })
                    .catch(error => console.log("error: ", error))
                }
                upload_image()
            }
        } else {
            // console.log("req.body: ", req.body)
            const { errors, isValid } = validate(req.body);

            if(isValid) {
                const {
                    firstname,
                    lastname,
                    email,
                    contributor,
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
                } = req.body
    
                db.collection('users').findOneAndUpdate(
                    { _id: new mongoose.Types.ObjectId(req.params._id) },
                    // What infor needs to update
                    { $set: { 
                        firstname, 
                        lastname, 
                        email, 
                        contributor, 
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
                        } 
                    },
                    { returnOriginal: false }, // This is important
                    ( err, result ) => {
                        if(err) {
                            return res.status(500).json({ error: { global: err } });
                        }
                        res.json({
                            user: result.value
                        })
                    }
                )
    
            } else {
                res.status(400).json({ errors });
            }
        }
    })

    app.delete('/api/existingUsers/:_id', (req, res) => {
        // console.log("req.params._id: ", req.params._id);    
        if(req.params._id.length > 24) {
            console.log("_id greater than 12 hex: ")
            User.findOneAndDelete({ _id: new mongoose.Types.ObjectId(req.params._id) }, (err, user) => {
                // console.log("user in deleteOne: ", user);
                if(err) {
                    return res.status(500).json({ error: { global: err } });
                }

                res.json({ 
                    _id: req.params._id,
                    message: 'Cloud image successfully deleted'
                })
            })
        } else {
            console.log("_id less than 12 hex: ")
            User.findOneAndDelete({ _id: new mongoose.Types.ObjectId(req.params._id) }, (err, user) => {
                if(err) {
                    return res.status(500).json({ error: { global: err } });
                }
    
                let userCloudinaryPath = user.firstname + '_' + user.lastname + '/';
                cloudinary.api.delete_resources_by_prefix('users/'+ userCloudinaryPath , (result, err) => {
                    if(err) {
                        console.log("err: ", err)
                    }
                    console.log("result: ", result)
                    res.json({ 
                        _id: req.params._id,
                        message: 'Cloud image successfully deleted'
                    })
                });
    
                // if(user.filePathNode !== null) {
                //     try {
                //         for(let i = 0; i < user.filePathNode.length; i++) {
                //             fs.unlinkSync(user.filePathNode[i])
                //         }
                //         //file removed
                //     } catch(err) {
                //         console.error(err)
                //     }
                // }
                //////////////////////////////////////////////////////
                // Delete single all images inside of user
                // cloudinary.uploader.destroy(user.public_id, (result, err) => {
                //     if(err) {
                //         return res.status(500).json({ error: { global: err } });
                //     }
                // });            
                
            })
        }

    })

    // Specific user
    app.get('/api/existingUsers/:_id', (req, res) => {
        // console.log("req.params: ", req.params)
        db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(req.params._id)}, (err, user) => {
            res.json({ user });
        })
    });

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
}