
const mongoose = require('mongoose');
const { Schema } = mongoose;
// const RecipientSchema = require('./Recipient');
mongoose.set('useCreateIndex', true);

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true
    },
    TaskDone: {
        type: Boolean,
        default: false
    }
});

const Tasks = module.exports = mongoose.model('tasks', userSchema);
