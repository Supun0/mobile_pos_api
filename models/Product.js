const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    description:{
        type:String,
        required:[true,'Please add a description'],
        trim:true
    },
    unitPrice:{
        type:Number,
        required:[true,'Please add a price'],
        min:0
    },
    qtyOnHand:{
        type:Number,
        required:[true,'Please add a qty'],
        min:0,
        default:0
    }
}, {timestamps:true});

module.exports = mongoose.model('Product',productSchema);