const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    historyVoucherTopup: {
        gameName: {
            type: String,
            require: [true, "Game Name is required"],
        },
        category: {
            type: String,
            require: [true, "Category is required"],
        },
        thumbnail: {
            type: String,
        },
        coinName: {
            type: String,
            require: [true, "Coin Name is required"],
        },
        coinQuantity: {
            type: String,
            require: [true, "Coin Quantity is required"],
        },
        price: {
            type: Number,
        },
    },
    historyPayment: {
        name: {
            type: String,
            require: [true, "Name is required"],
        },
        type: {
            type: String,
            require: [true, "Jenis Pembayaran is required"],
        },
        bankName: {
            type: String,
            require: [true, "Bank Name is required"],
        },
        noRekening: {
            type: String,
            require: [true, "No Rekening is required"],
        },
    },
    name: {
        type: String,
        require: [true, "Name is required"],
        maxLength: [225, "Name cannot more than 225 characters"],
        minLength: [3, "Name cannot less than 3 characters"],
    },
    accountUser: {
        type: String,
        require: [true, "Name is required"],
        maxLength: [225, "Name cannot more than 225 characters"],
        minLength: [3, "Name cannot less than 3 characters"],
    },
    tax: {
        type: Number,
        default: 0
    },
    value: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },
    historyUser: {
        name: {
            type: String,
            require: [true, "Name is required"],
        },
        phoneNumber: {
            type: Number,
            require: [true, "Phone Number is required"],
            maxLength: [13, "Phone Number cannot more than 13 characters"],
            minLength: [9, "Phone Number cannot less than 9 characters"],
        }
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

module.exports = mongoose.model('Transaction', transactionSchema);