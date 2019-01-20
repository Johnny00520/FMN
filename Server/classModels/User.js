// Using js to create classes/collections that contains records in Mongo
const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.set('useCreateIndex', true);

const userSchema = new Schema({
    // _id: {
    //     type: String,
    //     max: 24,
    //     min: 12
    // },
    _id: mongoose.Schema.Types.ObjectId,
    public_ids: {
        type: Array,
        default: null
    },
    displayName: {
        type: String
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    contributor: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    _user: {
        // ref: is refering to the User who signup
        type: Schema.Types.ObjectId, ref: 'User'
    },
    createdDate: {
        type: Date,
        default: new Date(Date.now()).toLocaleString('en-US', {timeZone: 'America/Denver'})
    },
    notes: {
        type: String
    },
    isAdmin: {
        type: Boolean, 
        default: false
    },
    isArtist: {
        type: Boolean,
        default: false
    },
    websiteAddress: {
        type: String
    },
    otherLink1: {
        type: String
    },
    otherLink2: {
        type: String
    },
    otherLink3: {
        type: String
    },
    facebook: {
        type: String
    },
    pleage1: {
        type: String
    },
    pleage2: {
        type: String
    },
    pleage1Percent: {
        type: String
    },
    pleage2Percent: {
        type: String
    },
    userImagaPath: {
        type: String,
        default: null
    },
    userImagaPathAlt: {
        type: String,
        default: null
    },
    artWorkImagesPath: {
        type: Array,
        default: null
    },
    filePathNode :{
        type: Array,
        default: null
    },
});

// Create a actual user class/collection with unique googleID, and load into Mongo
module.exports = mongoose.model('users', userSchema);