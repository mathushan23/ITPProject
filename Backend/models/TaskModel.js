const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        photo: {
            type: String, // stores the filename or image URL
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
