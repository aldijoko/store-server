const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');

const HASH_ROUND = 10;

const playerSchema = new mongoose.Schema({
    email: {
        type: String,
        require: [true, 'Email is required'],
    },
    name: {
        type: String,
        require: [true, 'Name is required'],
        maxLength: [225, "Name cannot more than 225 characters"],
        minLength: [3, "Name cannot less than 3 characters"],
    },
    username: {
        type: String,
        require: [true, 'Name is required'],
        maxLength: [22, "Name cannot more than 22 characters"],
        minLength: [5, "Name cannot less than 5 characters"],
    },
    password: {
        type: String,
        require: [true, 'Password is required'],
        maxLength: [25, "Name cannot more than 25 characters"],
        minLength: [8, "Name cannot less than 8 characters"],
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    },
    avatar: {
        type: String,

    },
    fileName: {
        type: String,
    },
    phoneNumber: {
        type: String,
        require: [true, 'Phone Number is required'],
        maxLength: [13, "Phone Number cannot more than 13 characters"],
        minLength: [9, "Phone Number cannot less than 9 characters"],
    },
    favorite: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
}, { timestamps: true })

playerSchema.path('email').validate(async function (value){
    try {
        const count = await this.model('Player').count({email: value});
        return !count;
    } catch (error) {
        throw error;
    }
}, attr => `${attr.value} has been registered`)

playerSchema.pre('save', function (next){
    this.password = bycrypt.hashSync(this.password, HASH_ROUND);
    next();
})

module.exports = mongoose.model('Player', playerSchema);