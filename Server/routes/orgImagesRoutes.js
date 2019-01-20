const keys = require('../config/keys');
const nonOrgs = require('../classModels/NonOrgs');
const mongoose = require('mongoose');
const fs = require('fs');

//////////////////////////////////////////////////////////////////
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, files, cb) => {
        cb(null, './routes/orgsUploads/');
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
   
    if(data.org_name === '') errors.org_name = 'Cannot be empty';
    if(data.org_description === '') errors.org_description = 'Cannot be empty';
    if(data.org_web_address === '') errors.org_web_address = 'Cannot be empty';
    const isValid = Object.keys(errors).length === 0;

    return { errors, isValid };
}
//////////////////////////////////////////////////////////////////


module.exports = (app, db) => {

    app.get('/api/nonProfOrgs', (req, res) => {
        db.collection('nonProf_orgs').find({}).toArray((err, nonOrgs) => {
            res.json({ nonOrgs })
        });
    });

    app.get('/api/nonProfOrgs/:_id', (req, res) => {
        db.collection('nonProf_orgs').findOne({ _id: new mongoose.Types.ObjectId(req.params._id)}, (err, nonOrg) => {
            res.json({ nonOrg });
        })
    });

    app.put('/api/nonProfOrgs/:_id', upload.single('file'), (req, res) => {
        // console.log("req.file: ", req.file)
        // console.log("req.body: ", req.body)
        // console.log("req.params: ", req.params)

        const orgData = JSON.parse(req.body.orgData);
        
        if(req.file) {
            // handle with picture
            const {
                org_name,
                org_description,
                org_web_address
            } = orgData;

            const { errors, isValid } = validate(orgData)

            if(isValid) {

                let upload_image = () => {
                    new Promise((resolve, reject) => {
                        cloudinary.uploader.upload(__dirname + '/orgsUploads/' + req.file.filename, (result, error) => {
    
                            if (error) reject(error)
                            else resolve(result);
                        }
                        , {
                            folder: `/organization/${org_name}`
                        })
    
                    })
                    .then(result => {
                        // console.log("result: ", result)
                        db.collection('nonProf_orgs').findOne({ _id: new mongoose.Types.ObjectId(req.params._id) })
                            .then(org => {
                                // console.log("org in findOne: ", org)
                                if(org.filePathNode !== null) {
                                    try {
                                        //remove file
                                        fs.unlinkSync(req.file.path)
                                        
                                    } catch(err) {
                                        console.error(err)
                                    }
                                }
    
                                cloudinary.uploader.destroy(org.public_id, (result, err) => {
                                    // console.log("result in cloudinary destroy: ", result)
                                    if(err) {
                                        return res.status(500).json({ error: { global: err } });
                                    } 
                                });
    
                                db.collection('nonProf_orgs').findOneAndUpdate(
                                    { _id: new mongoose.Types.ObjectId(req.params._id) },
                                    { $set: {
                                        org_name,
                                        org_description,
                                        org_web_address,
                                        public_id: result.public_id,
                                        filePathNode: req.file.path,
                                        orgImagePath: result.secure_url,
                                        orgImageAlt: org_name
                                        }
                                    },
                                    { returnOriginal: false }, // This is important
                                    (err, result) => {
                                        // console.log("result in findOneAndUpdate: ", result)
                                        if(err) {
                                            return res.status(500).json({ error: { global: err } });
                                        } else {
                                            res.status(200).json({ nonOrg: result.value })
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
            // with no picture
            const { errors, isValid } = validate(orgData)
    
            if(isValid) {

                const {
                    org_name,
                    org_description,
                    org_web_address
                } = orgData;

                db.collection('nonProf_orgs').findOneAndUpdate(
                    { _id: new mongoose.Types.ObjectId(req.params._id) },
                    { $set: {
                        org_name,
                        org_description,
                        org_web_address,
                        },
                    },
                    { returnOriginal: false }, // This is important
                    ( err, result ) => {
                        // console.log("result in db.collection: ", result)
                        if(err) {
                            return res.status(500).json({ error: { global: err } });
                        }

                        // console.log("result: ", result.value)
                        res.status(200).json({
                            nonOrg: result.value
                        })
                    }
                )

    
            } else {
                res.status(400).json({ errors })
            }
        }
    });

    app.post('/api/nonProfOrgs', upload.single('file'), async (req, res) => {
        // console.log("req.file: ", req.file)
        // console.log("req.body: ", req.body)

        if(req.file) {
            const orgData = JSON.parse(req.body.orgData)
            const { errors, isValid } = validate(orgData)
    
            if(isValid) {
    
                const {
                    org_name,
                    org_description,
                    org_web_address
                } = orgData;

                let upload_image = () => {

                    new Promise((resolve, reject) => {
                        cloudinary.uploader.upload(__dirname + '/orgsUploads/' + req.file.filename, (result, error) => {
    
                            if (error) reject(error)
                            else resolve(result);
                        }
                        , {
                            folder: `/organization/${org_name}`
                        })
                    })
                    .then(result => {
                        // console.log("Result: ", result)

                        db.collection('nonProf_orgs').insertOne({
                            _id: new mongoose.Types.ObjectId(),
                            public_id: result.public_id,
                            filePathNode: req.file.path,
                            org_name, 
                            org_description,
                            org_web_address: org_web_address,
                            orgImagePath: result.secure_url,
                            orgImageAlt: org_name,
                            createdDate: new Date(Date.now()).toLocaleString()

                        }, (err, DBresult) => {
                            if(err) {
                                res.status(500).json({ errors: { global: 'Something went wrong' }});
                            } else {

                                res.status(200).json({ nonOrg: DBresult.ops[0] });

                                try{
                                    fs.unlinkSync(req.file.path)
                                }
                                catch(err) {
                                    console.log(err)
                                }
                            }
                        })
                    })
                    .catch(error => console.log("error: ", error))
                }
                upload_image()

            } else {
                res.status(400).json({ errors })
            }

        } else {
            const orgData = JSON.parse(req.body.orgData)
            const { errors, isValid } = validate(orgData)

            if(isValid) {

                const {
                    org_name,
                    org_description,
                    org_web_address,
                } = orgData;

                db.collection('nonProf_orgs').insertOne({
                    org_name, 
                    org_description,
                    org_web_address: org_web_address,
                    selectedFile: null,
                    orgImageAlt: org_name,
                    createdDate: new Date(Date.now()).toLocaleString()

                }, (err, DBresult) => {
                    if(err) {
                        res.status(500).json({ errors: { global: 'Something went wrong' }});
                    } else {
                        res.status(200).json({ nonOrg: DBresult.ops[0] });
                    }
                })

            } else {
                res.status(400).json({ errors })
            }
        }

    });

    app.delete('/api/nonProfOrgs/:_id', (req, res) => {
        db.collection('nonProf_orgs').findOneAndDelete({ _id: new mongoose.Types.ObjectId(req.params._id)}, (err, org) => {
            if(err) {
                res.status(400).json({ errors })
            } else {
    
                cloudinary.uploader.destroy(org.value.public_id, (result, err) => {
                    // console.log("result in cloudinary destroy: ", result)
                    if(err) {
                        return res.status(500).json({ error: { global: err } });
                    }
                });

                res.json({ org });
            }
        })
    });

    app.get('', (req, res) => {
        db.collection('nonProf_orgs').findOne({ _id: new mongoose.Types.ObjectId(req.params._id)}, (err, org) => {
            res.json({ org });
        })
    });
}