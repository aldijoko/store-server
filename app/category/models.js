const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Name is required"],
      },
}, { timestamps: true })

module.exports = mongoose.model('Category', categorySchema);