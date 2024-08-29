const mongoose = require('mongoose');
const { createToken } = require('../services/auth');
const {createHmac, randomBytes} = require('crypto');

const UserSchema = mongoose.Schema({
    FullName: {
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
        required: true
    },

    salt: {
        type: String,
    },

    ProfileImageUrl: {
        type: String,
        default: '/images/OIP.jpeg',
    },

    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    }
}, {timestamps: true});

UserSchema.pre('save', function (next){
    const user = this;

    if(!user.isModified('password')) return;

    const salt = randomBytes(16).toString();
    const HashPassword = createHmac('sha256', salt)
    .update(user.password)
    .digest('hex')

    this.salt = salt;
    this.password = HashPassword;

    next();
});

UserSchema.static('matchPassword', async function (email,password){
    const user = await this.findOne({email});
    if(!user){throw new Error('user not found')}

    const salt = user.salt;
    const HashPassword = user.password;

    const SigninHash = createHmac('sha256', salt)
    .update(password)
    .digest('hex');

    if(SigninHash !== HashPassword){throw new Error("incorrect password")}

    const token = createToken(user);

    return token;
})

const User = mongoose.model("user", UserSchema);

module.exports=User;