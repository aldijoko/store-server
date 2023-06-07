const mongoose = require('mongoose');
const voucherSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Game name is required"],
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    thumbnail: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    nominals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nominal',
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    }
})

module.exports = mongoose.model('Voucher', voucherSchema);