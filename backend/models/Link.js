const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema(
    {
        metadata: {
            url: { type: String, required: true, unique:true },
            title: { type: String },
            image: { type: String },
            author: { type: String },
            date: {type: Date},
            publisher: {type:String},
            description: {type:String},
            logo: { type: String },
        },
        createdAt: { type: Date, default: Date.now },
    },
    { collection: "links" }
);

module.exports = mongoose.model("Link", LinkSchema);
