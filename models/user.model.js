var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* User Schema */
var userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('users', userSchema);
