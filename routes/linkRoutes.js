const express = require("express");
const Link = require("../models/Link");
const router = express.Router();
const axios = require("axios");
const metascraper = require("metascraper")([
  require("metascraper-title")(),
  require("metascraper-image")(),
  require("metascraper-url")(),
]);


// Fetch metadata from URL
const fetchMetadata = async (url) => {
    try {
      const { data: html, request: { res: { responseUrl } } } = await axios.get(url, { timeout: 5000 });
      const metadata = await metascraper({ html, url: responseUrl });
      return metadata;
    } catch (err) {
      console.error("Failed to fetch metadata:", err.message);
      return { title: null, heroImage: null, website: null };
    }
  };


// Save a new link
router.post("/save", async (req, res) => {
    try {
      const { url } = req.body;
  
      // Fetch metadata
      const metadata = await fetchMetadata(url);
      console.log(metadata)
      const newLink = new Link({ url, metadata });
      await newLink.save();
  
      res.status(201).json({ message: "Link saved with metadata", link: newLink });
    } catch (err) {
      res.status(500).json({ error: "Failed to save link" });
    }
  });

// Get all saved links
router.get("/", async (req, res) => {
  try {
    const links = await Link.find();
    res.status(200).json(links);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch links" });
  }
});

// delete a link
router.delete("/:id", async(req,res)=>{
    try {
        const {id} = req.params
    } catch (error) {
        res.status(500).json({ error: "Failed to delete a link" });
    }
})
module.exports = router;
