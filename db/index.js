const mongoose = require('mongoose');
const {urlDb} = require('../config');

mongoose.connect(urlDb, {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

module.exports = db;    