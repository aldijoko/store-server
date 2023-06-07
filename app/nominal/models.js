const mongoose = require('mongoose');
const nominalSchema = new mongoose.Schema({
    coinQuantity: {
        type: Number,
        default: 0,
    },
    coinName: {
        type: String,
        require: [true, "Coin Name is required"],
    },
    price: {
        type: Number,
        default: 0,
    }
}, { timestamps: true })

module.exports = mongoose.model('Nominal', nominalSchema);