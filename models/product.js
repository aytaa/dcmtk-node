const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    label: {
        type: String,
        required: [false, 'ürün ismi girmelisiniz'],
        minlength: [5, 'ürün ismi için minimum 5 karakter girmelisiniz.'],
        maxlength: [255, 'ürün ismi için maksimum 255 karakter girmelisiniz.'],
        lowercase: false,
        trim: true
    },
    price: {
        type: Number,
        required: false,
        min: 0,
        max: 10000,
        get: value => Math.round(value), //10.2 => 10 10.8=> 11
        set: value => Math.round(value)  // 10.2 => 10 10.8=>11
    },
    barcode: {
        type: String,
        required: false
    },
    special_code: {
        type: String,
        required: false
    },
    brand: {
        type: String,
        required: false
    },
    metaDescription: {
        type: String,
        required: false
    },
    buyingPrice: {
        type: Number,
        required: false
    },
    details: {
        type: String,
        minlength: 1
    },
    simpleDetail: {
        type: String,
        minlength: 1
    },
    stockCode: {
        type: String,
        required: false
    },
    stockType: {
        type: String,
        required: false
    },
    color: {
        type: String,
        required: false
    },
    stockAmount: {
        type: String,
        required: false
    },
    currency: {
        type: String,
        required: false
    },
    price3: {
        type: Number,
        required: false
    },
    categoryTree: {
        type: String,
        required: false
    },
    tax: {
        type: String,
        required: false
    },
    imageUrl: String,
    picture1Path: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    tags: { 
        type: Array,
        validate: {
            validator: function (value) {
                return value && value.length > 0;
            },
            message: 'ürün için en az bir etiket giriniz'
        }
    },
    isActive: {
        type : Boolean,
        default : true
    },
});
 

module.exports = mongoose.model('Product', productSchema);