const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const TaskSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        qrCode: { 
            type: String 
        },

        barcode:{
            type:String,
            required: true,
            unique:true
        }, 
        imageUrl: {
            type: String,
            default: ''
        },
        imagePublicId: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);