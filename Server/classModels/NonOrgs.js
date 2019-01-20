
const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.set('useCreateIndex', true);

const orgsSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    public_id: {
        type: String,
        required: true
    },
    filePathNode: {
        type: String,
        default: null
    },
    org_name: {
        type: String,
        required: true
    },
    org_description: {
        type: String,
        required: true
    },
    org_web_address: {
        type: String
    },
    orgImagePath: {
        type: String
    },
    orgImageAlt: {
        type: String
    },
    createdDate: {
        type: String
    }
});

const NonOrgs = module.exports = mongoose.model('nonProf_orgs', orgsSchema);