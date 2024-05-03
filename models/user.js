const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // username: {
    //     type:String,
    //     requires: true,
    //     unique: true
    // },
    // password: {
    //     type: String,
    //     required: true
    // },
    admin: {
        type: Boolean,
        default: false
    }
});

//handle username and password using password (salt and hash)
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);