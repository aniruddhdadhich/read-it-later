const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    metadata: {
      title: { type: String },
      image: { type: String },
      url: { type: String },
      author :{type: String}
    },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "links" }
);

module.exports = mongoose.model("Link", LinkSchema);
