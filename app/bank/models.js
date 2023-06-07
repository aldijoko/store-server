const mongoose = require('mongoose');
const bankSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Nama Pemilik is required"],
    },
    bankName: {
        type: String,
        require: [true, "Nama Bank is required"],
    },
    noRekening: {
        type: String,
        require: [true, "Nomor Rekening is required"],
    },
}, { timestamps: true })

module.exports = mongoose.model('Bank', bankSchema);