const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


const reviewSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    stockCount: {
        type: Number,
        required: true
    },
    mostBuy: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    },
    reviews: [reviewSchema]
}, {
    timestamps: true
});

//create model using Schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;