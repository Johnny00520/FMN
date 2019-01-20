const keys = require('../config/keys');
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
    if(data.email === '') errors.email = 'Cannot be empty';

    const isValid = Object.keys(errors).length === 0;

    return { errors, isValid };
}
//////////////////////////////////////////////////////////////////

function isEmpty(myObject) {
    for(var key in myObject) {
        if (myObject.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}
//////////////////////////////////////////////////////////////////

module.exports = (app, db) => {

    app.post('/api/image_panel/allArtist', upload.array('file', 10), async (req, res) => {
        // console.log("req.files: ", req.files)
        // console.log("req.body: ", req.body)

        if(req.files.length !== 0) {
            // with profile img but no artworks
            const userData = JSON.parse(req.body.userData)
            const { errors, isValid } = validate(userData)
            const emptyObj = isEmpty(userData.profileImage)

            if(isValid && emptyObj && userData.artworkImages.length === 0) {
                
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
                            let upload_res = req.files.map(file => new Promise((resolve, reject) => {
                                cloudinary.uploader.upload(__dirname + '/uploads/' + file.filename, (result, error) => {
                                    if(error) reject(error)
                                    else resolve(result)
                                },
                                {
                                    folder: `/users/${firstname}_${lastname}`
                                })
                            }))
                            Promise.all(upload_res)
                            .then(results => {
                                // console.log("results: ", results)
                                db.collection('users').insertOne({
                                    _id: new mongoose.Types.ObjectId(),
                                    public_id: [results[0].public_id],
                                    filePathNode: [req.files[0].path],
                                    firstname,
                                    lastname,
                                    displayName: firstname + ' ' + lastname,
                                    email: email,
                                    isArtist: true,

                                    userImagePath: results[0].secure_url,
                                    userImagePathAlt: firstname + ' ' + lastname,
                                    artWorkImagesPath: [],

                                    contributor: 'artist',
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


                                }, (err, artistResult) => {

                                    db.collection('pendingUsers').findOneAndDelete({ email: email }, (err, user) => {
                                        if(err) {
                                            return res.json({ errors: { global: err }})
                                        }
                                        console.log("user in pendingUsers: ", user)
                                    })

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

                                                try{
                                                    // fs.unlinkSync(req.file.path)
                                                    req.files.map(file => {
                                                        fs.unlinkSync(file.path)
                                                    })
                                                }
                                                catch(err) {
                                                    console.log(err)
                                                }
                                                res.status(200).json({ artist: artistResult.ops[0] });
                                                done(err, 'done');
                                            }
                                        });
                                    }
                                })
                            })
                            .catch(error => console.log("error: ", error))

                        }
                        upload_image()
                    }
                })

                // with artworks but no profile img
            } else if (isValid && userData.profileImage === null && userData.artworkImages.length > 0){

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
                            let upload_res = req.files.map(file => new Promise((resolve, reject) => {
                                cloudinary.uploader.upload(__dirname + '/uploads/' + file.filename, (result, error) => {
                                    if(error) reject(error)
                                    else resolve(result)
                                },
                                {
                                    folder: `/users/${firstname}_${lastname}`
                                })
                            }))
                            Promise.all(upload_res)
                            .then(results => {

                                // console.log("results: ", results)
                                let public_id = [];
                                let artWorkImagesPath = [];
                                let filePathNode = [];

                                for(let i = 0; i < results.length; i++) {
                                    public_id.push(results[i].public_id);
                                    filePathNode.push(req.files[i].path)
                                    artWorkImagesPath.push(results[i].secure_url)
                                }

                                db.collection('users').insertOne({

                                    _id: new mongoose.Types.ObjectId(),
                                    public_id: public_id,
                                    filePathNode: filePathNode,
                                    firstname,
                                    lastname,
                                    displayName: firstname + ' ' + lastname,
                                    email: email,
                                    isArtist: true,

                                    userImagePath: null,
                                    userImagePathAlt: firstname + ' ' + lastname,
                                    artWorkImagesPath: artWorkImagesPath,

                                    contributor: 'artist',
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

                                }, (err, artistResult) => {

                                    db.collection('pendingUsers').findOneAndDelete({ email: email }, (err, user) => {
                                        if(err) {
                                            return res.json({ errors: { global: err }})
                                        }
                                        console.log("user in pendingUsers: ", user)
                                    })

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

                                                try{
                                                    // fs.unlinkSync(req.file.path)
                                                    req.files.map(file => {
                                                        fs.unlinkSync(file.path)
                                                    })
                                                }
                                                catch(err) {
                                                    console.log(err)
                                                }
                                                res.status(200).json({ artist: artistResult.ops[0] });
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

            // got profile picture and artwork pictures
            } else if (isValid && userData.profileImage !== null && userData.artworkImages.length > 0) {

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
                            let upload_res = req.files.map(file => new Promise((resolve, reject) => {
                                cloudinary.uploader.upload(__dirname + '/uploads/' + file.filename, (result, error) => {
                                    if(error) reject(error)
                                    else resolve(result)
                                },
                                {
                                    folder: `/users/${firstname}_${lastname}`
                                })
                            }))
                            Promise.all(upload_res)
                            .then(results => {

                                // console.log("results: ", results)
                                let public_id = [];
                                let artWorkImagesPath = [];
                                let filePathNode = [];

                                for(let i = 0; i < results.length; i++) {
                                    public_id.push(results[i].public_id);
                                    filePathNode.push(req.files[i].path)

                                    if(i >= 1) {
                                        artWorkImagesPath.push(results[i].secure_url)
                                    }
                                }

                                db.collection('users').insertOne({

                                    _id: new mongoose.Types.ObjectId(),
                                    public_id: public_id,
                                    filePathNode: filePathNode,
                                    firstname,
                                    lastname,
                                    displayName: firstname + ' ' + lastname,
                                    email: email,
                                    isArtist: true,

                                    userImagePath: results[0].secure_url,
                                    userImagePathAlt: firstname + ' ' + lastname,
                                    artWorkImagesPath: artWorkImagesPath,

                                    contributor: 'artist',
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

                                }, (err, artistResult) => {

                                    db.collection('pendingUsers').findOneAndDelete({ email: email }, (err, user) => {
                                        if(err) {
                                            return res.json({ errors: { global: err }})
                                        }
                                        console.log("user in pendingUsers: ", user)
                                    })

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

                                                try{
                                                    // fs.unlinkSync(req.file.path)
                                                    req.files.map(file => {
                                                        fs.unlinkSync(file.path)
                                                    })
                                                }
                                                catch(err) {
                                                    console.log(err)
                                                }
                                                res.status(200).json({ artist: artistResult.ops[0] });
                                                done(err, 'done');
                                            }
                                        });

                                    }
                                })

                            })
                            .catch(error => console.log("error: ", error))

                        }
                        upload_image()

                    }
                })

            } else {
                res.status(400).json({ errors })
            }

        } else {
            // nothing at all (only text info)
            const userData = JSON.parse(req.body.userData)
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
                            public_id: [null],
                            filePathNode: null,
                            firstname,
                            lastname,
                            displayName: firstname + ' ' + lastname,
                            email: email,
                            isArtist: true,
                            userImagePath: null,
                            userImagePathAlt: null,
                            contributor: 'artist',
                            artWorkImagesPath: [null],
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
                        }, (err, artistResult) => {

                            db.collection('pendingUsers').findOneAndDelete({ email: email }, (err, user) => {
                                if(err) {
                                    return res.json({ errors: { global: err }})
                                }
                                console.log("user in pendingUsers: ", user)
                            })

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
    
                                        res.status(200).json({ artist: artistResult.ops[0] });
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

    app.put('/api/image_panel/allArtist/:_id', upload.array('file', 10), async(req, res) => {
        // console.log("req.files: ", req.files)
        // console.log("req.body: ", req.body)
        if(req.files.length !== 0) {

            // with profile img but no artworks
            const userData = JSON.parse(req.body.userData)
            const { errors, isValid } = validate(userData)
            const emptyObj = isEmpty(userData.profileImage)
            // console.log("length: ", userData.artworkImages.length)

            if(isValid && emptyObj && userData.artworkImages.length === 0) {
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
                    let upload_res = req.files.map(file => new Promise((resolve, reject) => {
                        cloudinary.uploader.upload(__dirname + '/uploads/' + file.filename, (result, error) => {
                            if(error) reject(error)
                            else resolve(result)

                            try {
                                fs.unlinkSync(file.path)
                            } catch(err) {
                                console.log("err in unlinkSync: ", err)
                            }
                        },
                        {
                            folder: `/users/${firstname}_${lastname}`
                        })
                    }))
                    Promise.all(upload_res)
                    .then(results => {
                        // console.log("results: ", results)
                        
                        db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(req.params._id) }, (errors, artist) => {
                            // console.log("artist: ", artist)
                            if(!artist) {
                                return res.status(400).json({ errors: { global: 'No artist'} })
                                
                            } else {
                                let public_id = [];
                                for(let i = 0; i < results.length; i++) {
                                    public_id.push(results[i].public_id)
                                }
                                for(let j = 1; j < artist.public_id.length; j++) {
                                    public_id.push(artist.public_id[j])
                                }

                                if(artist.public_id[0] !== null) {
                                    cloudinary.uploader.destroy(artist.public_id[0], (result, err) => {
                                        // console.log("result in remove cloudinary: ", result)
                                        if(err) {
                                            return res.status(500).json({ errors: { global: 'Something wrong to delete image'}})
                                        }
                                    })
                                }
                                
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
                                        public_id: public_id,
                                        userImagePath: results[0].secure_url,
                                        userImagePathAlt: firstname + ' ' + lastname,
                                        filePathNode: req.files[0].path
                                        },
                                    },
                                    { returnOriginal: false }, // This is important
                                    ( err, newArtistResult ) => {
                                        // console.log("result in db.collection: ", result)
                                        if(err) {
                                            return res.status(500).json({ errors: { global: err } });
                                        } else {
                                            res.status(200).json({
                                                artist: newArtistResult.value
                                            })
                                        }
                                    }
                                )
                            }
                        })                        
                    })
                    .catch(error => console.log("error: ", error))
                }
                upload_image()

            } else if (isValid && userData.profileImage === null && userData.artworkImages.length > 0) {
                // with artworks but no profile img
                console.log("hit second case")
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
                    let upload_res = req.files.map(file => new Promise((resolve, reject) => {
                        cloudinary.uploader.upload(__dirname + '/uploads/' + file.filename, (result, error) => {
                            if(error) reject(error)
                            else resolve(result)

                            try {
                                fs.unlinkSync(file.path)
                            } catch(err) {
                                console.log("err in unlinkSync: ", err)
                            }
                        },
                        {
                            folder: `/users/${firstname}_${lastname}`
                        })
                    }))
                    Promise.all(upload_res)
                    .then(results => {

                        db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(req.params._id) }, (errors, artist) => {
                            if(!artist) {
                                return res.status(400).json({ errors: { global: 'No artist'} })

                            } else {
                                // console.log("artist: ", artist)
                                // Add more images to the orginal array
                                let public_id = [];
                                let artWorkImagesPath = [];
                                let filePathNode = [];

                                for(let j = 0; j < artist.public_id.length; j++) {
                                    public_id.push(artist.public_id[j])
                                }
                                for(let i = 0; i < artist.artWorkImagesPath.length; i++) {
                                    artWorkImagesPath.push(artist.artWorkImagesPath[i]);
                                    filePathNode.push(artist.filePathNode[i]);
                                }
                                for(let i = 0; i < results.length; i++) {
                                    public_id.push(results[i].public_id)
                                    artWorkImagesPath.push(results[i].secure_url)
                                    filePathNode.push(req.files[i].path)
                                }

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
                                        public_id: public_id,
                                        // userImagePath: [0],
                                        userImagePathAlt: firstname + ' ' + lastname,
                                        artWorkImagesPath: artWorkImagesPath,
                                        filePathNode: filePathNode
                                        },
                                    },
                                    { returnOriginal: false }, // This is important
                                    ( err, newArtistResult ) => {
                                        // console.log("result in db.collection: ", result)
                                        if(err) {
                                            return res.status(500).json({ errors: { global: err } });
                                        } else {
                                            res.status(200).json({
                                                artist: newArtistResult.value
                                            })
                                        }
                                    }
                                )

                            }
                            if(errors) {
                                return res.status(500).json({ errors: { global: errors } });
                            }
                        })

                    })
                    .catch(error => console.log("error: ", error))
                }
                upload_image()

            } else if(isValid && emptyObj && userData.artworkImages.length > 0) {
                // console.log("hit Got profile image and artworkImages")
                // Got profile image and artworkImages
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
                    let upload_res = req.files.map(file => new Promise((resolve, reject) => {
                        cloudinary.uploader.upload(__dirname + '/uploads/' + file.filename, (result, error) => {
                            if(error) reject(error)
                            else resolve(result)

                            try {
                                fs.unlinkSync(file.path)
                            } catch(err) {
                                console.log("err in unlinkSync: ", err)
                            }
                        },
                        {
                            folder: `/users/${firstname}_${lastname}`
                        })
                    }))
                    Promise.all(upload_res)
                    .then(results => {
                        db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(req.params._id) }, (errors, artist) => {
                            if(!artist) {
                                return res.status(400).json({ errors: { global: 'No artist'} })
                            } else {
                                // console.log("artist: ", artist)
                                    // Add more images to the orginal array
                                    let public_id = [];
                                    let artWorkImagesPath = [];
                                    let filePathNode = [];

                                    for(let j = 0; j < artist.public_id.length; j++) {
                                        public_id.push(artist.public_id[j])
                                    }
                                    for(let i = 0; i < artist.artWorkImagesPath.length; i++) {
                                        artWorkImagesPath.push(artist.artWorkImagesPath[i]);
                                        filePathNode.push(artist.filePathNode[i]);
                                    }
                                    for(let i = 0; i < results.length; i++) {
                                        public_id.push(results[i].public_id)
                                        artWorkImagesPath.push(results[i].secure_url)
                                        filePathNode.push(req.files[i].path)
                                    }

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
                                            public_id: public_id,
                                            userImagePath: results[0].secure_url,
                                            userImagePathAlt: firstname + ' ' + lastname,
                                            artWorkImagesPath: artWorkImagesPath,
                                            filePathNode: filePathNode
                                            },
                                        },
                                        { returnOriginal: false }, // This is important
                                        ( err, newArtistResult ) => {
                                            // console.log("result in db.collection: ", result)
                                            if(err) {
                                                return res.status(500).json({ errors: { global: err } });
                                            } else {
                                                res.status(200).json({
                                                    artist: newArtistResult.value
                                                })
                                            }
                                        }
                                    )
                                if(errors) {
                                    return res.status(500).json({ errors: { global: err } });
                                }
                            }
                        })
                    })
                    .catch(error => console.log("error: ", error))
                }
                upload_image();

            } else {
                res.status(400).json({ errors: { global: "Something went wrong: contact to administrator: Doesn\'t hit any files case"} })
            }

        } else {
            // with no images
            // nothing at all (only text info)
            const userData = JSON.parse(req.body.userData)
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
                        notes
                        },
                    },
                    { returnOriginal: false }, // This is important
                    ( err, newArtistResult ) => {
                        // console.log("result in db.collection: ", result)
                        if(err) {
                            return res.status(500).json({ errors: { global: err } });
                        } else {
                            res.status(200).json({
                                artist: newArtistResult.value
                            })
                        }
                    }
                )

            } else {
                res.status(400).json({ errors })
            }
        }
    })

    // Delete artist
    app.delete('/api/image_panel/allArtist/:_id', (req, res) => {
        console.log("req.params: ", req.params)
        db.collection('users').findOneAndDelete({ _id: new mongoose.Types.ObjectId(req.params._id) }, (err, user) => {

            if(err) {
                return res.status(500).json({ error: { global: err } });
            }

            let userCloudinaryPath = user.value.firstname + '_' + user.value.lastname + '/';
            // console.log("userCloudinaryPath: ", userCloudinaryPath)

            cloudinary.api.delete_resources_by_prefix('users/'+ userCloudinaryPath , (result, err) => {
                if(err) {
                    console.log("err: ", err)
                }
                // console.log("result: ", result)
                res.json({ 
                    _id: req.params._id,
                    message: 'Cloud image successfully deleted'
                })
            });

        })
    });

    // Single image for artwork
    app.delete('/api/image_panel/artistImage/:_id', (req, res) => {

        let { url } = req.body;
        url = url.split(('/'))
        lastPartUrl = url.slice(-1)[0].replace(/\.(jpg|jpeg|png|gif)$/i, "")
        newPublic_id = [];
        newPublic_id.push(url[url.length - 3])
        newPublic_id.push(url[url.length - 2])
        newPublic_id.push(lastPartUrl)
        newPublic_id = newPublic_id.join('/')

        url = url.join('/')

        db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(req.params._id) }, (errors, artist) => {
            // console.log("artist: ", artist)
            if(errors) {
                res.status(400).json({ errors: { global: errors } })
            } else {

                let newPublic_idArray = [];
                let newArtWorkImagesPath = []

                for(let i = 0; i < artist.public_id.length; i++) {
                    if(artist.public_id[i] !== newPublic_id) {
                        newPublic_idArray.push(artist.public_id[i])
                    }
                }
                for(let i = 0; i < artist.artWorkImagesPath.length; i++) {
                    if(artist.artWorkImagesPath[i] !== url) {
                        newArtWorkImagesPath.push(artist.artWorkImagesPath[i])
                    }
                }

                if(artist.public_id !== null) {
                    cloudinary.uploader.destroy(newPublic_id, (result, err) => {
                        // console.log("result in remove cloudinary: ", result)
                        if(err) {
                            return res.status(500).json({ errors: { global: 'Something wrong to delete image'}})
                        }
                    })
                }

                db.collection('users').findOneAndUpdate(
                    { _id: new mongoose.Types.ObjectId(req.params._id) },
                    { $set: {
                        public_id: newPublic_idArray,
                        artWorkImagesPath: newArtWorkImagesPath
                        },
                    },
                    { returnOriginal: false }, // This is important
                    ( err, newArtistResult ) => {
                        // console.log("result in db.collection: ", result)
                        if(err) {
                            return res.status(500).json({ errors: { global: err } });
                        } else {
                            // console.log("newArtistResult: ", newArtistResult)
                            res.status(200).json({
                                artist: newArtistResult.value
                            })
                        }
                    }
                )
            }
        })

    })

    // Get specific artist
    app.get('/api/image_panel/allArtist/:_id', (req, res) => {
        // console.log("req.params._id: ", req.params._id);
        db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(req.params._id) }, (errors, artist) => {
            if(errors) {
                res.status(400).json({ errors })
            } else {
                res.json({ artist })
            }
        })
    })

    app.get('/api/image_panel/allArtist', (req, res) => {
        db.collection('users').find({ isArtist: true }).toArray((err, artists) => {
            res.json({ artists })
        });
    });
}