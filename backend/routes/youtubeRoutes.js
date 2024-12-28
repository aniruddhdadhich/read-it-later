const express = require("express");
const axios = require("axios");
const Youtube = require("../models/Youtube");
const router = express.Router();
require("dotenv").config();

const YOUTUBE_API_KEY = process.env.YT_API_KEY;

// Fetch metadata from YouTube API
const fetchYouTubeMetadata = async (url) => {
  try {
    const videoIdMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (!videoIdMatch) {
      throw new Error("Invalid YouTube URL format");
    }
 
    const videoId = videoIdMatch[1];
  
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${YOUTUBE_API_KEY}`;
    const response = await axios.get(apiUrl);
    

    if (response.data.items.length === 0) {
      throw new Error("Video not found or access denied");
    }

    const video = response.data.items[0].snippet;
    console.log(response.data.items[0].snippet)

    return {
      url,
      videoId,
      title: video.title,
      thumbnail: video.thumbnails.standard.url,
      channelTitle: video.channelTitle,
      publishedAt: video.publishedAt,
    };
  } catch (err) {
    console.error("Failed to fetch YouTube metadata:", err.message);
    return null;
  }
};

// POST: Save a new YouTube video URL
router.post("/save", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Validate URL format
    const isValidUrl = /^(https:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}$/.test(url);
    if (!isValidUrl) {
      return res.status(400).json({ error: "Invalid YouTube URL format" });
    }

    // Check for duplicate
    const existingVideo = await Youtube.findOne({ "metadata.url": url });
    if (existingVideo) {
      return res.status(409).json({ error: "URL already exists" });
    }

    // Fetch metadata
    const metadata = await fetchYouTubeMetadata(url);
    if (!metadata) {
      return res.status(404).json({ error: "Unable to fetch metadata. Please check the URL." });
    }

    const newVideo = new Youtube({ metadata });
    await newVideo.save();

    res.status(201).json(newVideo);
  } catch (err) {
    res.status(500).json({ error: "Failed to save video" });
  }
});

// GET: Fetch all YouTube videos
router.get("/", async (req, res) => {
  try {
    const videos = await Youtube.find();
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// DELETE: Remove a YouTube video by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVideo = await Youtube.findByIdAndDelete(id);
    if (!deletedVideo) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.status(200).json({ message: "Video deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete video" });
  }
});

module.exports = router;
