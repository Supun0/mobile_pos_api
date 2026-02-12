const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a name'],
        trim:true
    },
    address:{
        type:String,
        required:[true,'Please add an address']
    },
    sallary:{
        type:Number,
        required:[true,'Please add a sallary'],
        min:0
    }
}, {timestamps:true});

module.exports = mongoose.model('Customer',customerSchema);