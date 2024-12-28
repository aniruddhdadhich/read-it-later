const mongoose = require("mongoose");

const YoutubeSchema = new mongoose.Schema(
  {
    metadata: {
      url: { type: String, required: true, unique: true },
      videoId: { type: String, required: true },
      title: { type: String },
      thumbnail: {type: String},
      channelTitle: { type: String },
      publishedAt: { type: Date },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "youtubeVideos" }
);

module.exports = mongoose.model("Youtube", YoutubeSchema);
