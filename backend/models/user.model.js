const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: { type: String },
    email: { type: String },
    password: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiresAt: { type: Date },
    createdOn: { type: Date, default: new Date().getTime() },
 });

module.exports = mongoose.model('User', userSchema);