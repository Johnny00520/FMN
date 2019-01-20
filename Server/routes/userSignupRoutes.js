const Joi = require('joi');
const User = require('../classModels/User');
const emailTemplate = require('../services/emailTemplate');
const request = require('request');
const keys = require('../config/keys');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const fs = require('fs');

//////////////////////////////////////////////////////////////////
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, files, cb) => {
        cb(null, './routes/signupUsers/');
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
const validation = (data) => {
    let errors = {};

    if(data.firstname === '') errors.firstname = "First name cannot be empty";
    if(data.lastname === '') errors.lastname = "Last name cannot be empty";
    if(data.email === '') errors.email = "Email address cannot be empty";
    if(data.contributorSelection === '') errors.contributorSelection = "Contributor cannot be empty";
    if(data.notes === '') errors.notes = "Notes cannot be empty";
    if(data.recaptcha === undefined || data.recaptcha === '' || data.recaptcha === null ) errors.recaptcha = "Recaptcha connot be empty"

    const isValid = Object.keys(errors).length === 0;

    return { errors, isValid };
}

const schema = Joi.object().keys({
    firstname: Joi.string().min(1).required(),
    lastname: Joi.string().min(1).required(),
    contributorSelection: Joi.required(),
    // Minimum eight characters, at least one uppercase letter, 
    // one lowercase letter, one number and one special character:
    // password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    // passwordConfirm: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    websiteAddress: Joi.string().allow('').optional(),
    facebook: Joi.string().allow('').optional(),
    otherLink1: Joi.string().allow('').optional(),
    otherLink2: Joi.string().allow('').optional(),
    otherLink3: Joi.string().allow('').optional(),
    pleage1: Joi.allow('').optional(),
    pleage1Percent: Joi.allow('').optional(),
    pleage2: Joi.allow('').optional(),
    pleage2Percent: Joi.allow('').optional(),
    recaptcha: Joi.required(),
    recaptcha: Joi.optional(),
    selectedFile: Joi.required(),
    phoneNum: Joi.required(),
    // phoneNum: Joi.allow('').optional(),
    notes: Joi.string().min(1).required(),
    email: Joi.string().email({ minDomainAtoms: 2}).required().regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
});

module.exports = (app, db) => {
    app.post('/api/signup', upload.single('file'), async (req, res, next) => {
        // console.log("req.body.userData: ", req.body.userData)
        const userData = JSON.parse(req.body.userData);
        const { errors, isValid } = validation(userData);

        if(isValid) {
            const {
                firstname,
                lastname,
                email,
                contributorSelection,
                notes,
                recaptcha,
                websiteAddress,
                otherLink1,
                otherLink2,
                otherLink3,
                facebook,
                pleage1,
                pleage1Percent,
                pleage2,
                pleage2Percent,
                phoneNum
            } = userData;

            const secreyKey = keys.RECAPTCHA_SECRET_KEY;
            const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=
                    ${secreyKey}&response=${recaptcha}&remoteip=
                    ${req.connection.remoteAddress}`;

            request(verifyURL, (err, response, body) => {
                body = JSON.parse(body);
                // console.log("body: ", body)
    
                if(!body.success) {
                    return res.status(400).json({ 
                        errors: { global: err }
                    });
                }
            });

            User.find({ email: email.toLowerCase().trim() })
                .exec()
                .then(user => {
                    if(user.length >= 1) {
                        return res.status(409).json({ errors: { global: 'This email has been enrolled' }})
                    } else {
                        const result = Joi.validate(userData, schema);

                        if(result.error) {
                            return res.status(401).json({ errors: { global : result.error.details } });
                        } else {

                            db.collection('pendingUsers').insertOne({
                                _id: new mongoose.Types.ObjectId(),
                                firstname,
                                lastname,
                                email,
                                contributorSelection,
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
                                phoneNum
                            }, (err, result) => {
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
                                        from: email,
                                        // to: 'cathy@formothernature.com',  // Cathy's email
                                        to: 'chch6597@colorado.edu',
                                        subject: firstname + ' ' + lastname + ' wants to join the FMN',
                                        attachments: [{
                                            filename: firstname + '' + lastname + '.jpg',
                                            path: __dirname + '/signupUsers/' + req.file.filename,
                                        }],
                                        html: emailTemplate(
                                            firstname.toLowerCase().trim(),
                                            lastname.toLowerCase().trim(), 
                                            contributorSelection, 
                                            websiteAddress.toLowerCase().trim(),
                                            facebook.toLowerCase().trim(),
                                            email.toLowerCase().trim(),
                                            notes, 
                                            otherLink1.toLowerCase().trim(),
                                            otherLink2.toLowerCase().trim(),
                                            otherLink3.toLowerCase().trim(),
                                            pleage1,
                                            pleage1Percent,
                                            pleage2,
                                            pleage2Percent,
                                            phoneNum
                                        )
                                    };
        
                                    smtpTransport.sendMail(mailOptions, (err, success) => {
                                        if (err) {
                                            return res.status(500).json({ errors: { global: 'Something went wrong' }});
                                        }
                                        else {
        
                                            try{
                                                fs.unlinkSync(req.file.path)
                                            }
                                            catch(err) {
                                                console.log(err)
                                            }
                                            // console.log("Result: ", result.ops[0])
                                            res.json({ 
                                                success: { success },
                                                result: result.ops[0]
                                            })
                                        }
                                    })

                                }

                            });
                        }
                    }
                })
                .catch(error => console.log("error: ", error))
        } else {
            console.log("errors: ", errors )
            return res.status(400).json({ errors: errors })
        }

    });

    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
}