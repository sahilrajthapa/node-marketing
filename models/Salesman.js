const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SalesmanSchema = new Schema({
    salesManId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    saleLevel: {
        type: Schema.Types.ObjectId,
        ref: 'sales'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Salesman = mongoose.model('salesmen', SalesmanSchema, 'salesmen')
module.exports = Salesman