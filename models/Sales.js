const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SalesSchema = new Schema({
    level: {
        type: String,
        required: true
    },
    commission: {
        type: Number,
        required: true
    }
})

const Sales = mongoose.model('sales', SalesSchema)
module.exports = Sales