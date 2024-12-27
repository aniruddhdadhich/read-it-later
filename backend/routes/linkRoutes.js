const express = require("express");
const Link = require("../models/Link");
const router = express.Router();
const axios = require("axios");
const metascraper = require('metascraper')([
    require('metascraper-image')(),
    require('metascraper-title')(),
    require('metascraper-url')(),
    require('metascraper-author')(),
    require('metascraper-publisher')(),
    require('metascraper-date')(),
    require('metascraper-description')(),
    require('metascraper-logo')(),
])


// Fetch metadata from URL
const fetchMetadata = async (url) => {
    try {
        const { data: html, request: { res: { responseUrl } } } = await axios.get(url, { timeout: 5000 });
        const metadata = await metascraper({ html, url: responseUrl });
        return metadata;
    } catch (err) {
        console.error("Failed to fetch metadata:", err.message);
        return { title: null, image: null, url: null, author: null };
    }
};


// Save a new link
router.post("/save", async (req, res) => {
    try {
        const { url } = req.body;

        //if no url provided
        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }
        //if wrong url
        const isValidUrl = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/.test(url);
        if (!isValidUrl) {
            return res.status(400).json({ error: "Invalid URL format" });
        }
        //Avoid Duplicate URL
        const existingLink = await Link.findOne({ "metadata.url": url }); 
        if (existingLink) {
            return res.status(409).json({ error: "URL already exists" });
        }

        // Fetch metadata
        const metadata = await fetchMetadata(url);

        //If metadata couldn't be fetched - check for the title only
        if (!metadata.title) {
            return res
              .status(404)
              .json({ error: "Unable to fetch metadata. Please check the URL." });
          }
        
        const newLink = new Link({ metadata });
        await newLink.save();

        res.status(201).json(newLink);
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
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const deletedLink = await Link.findByIdAndDelete(id);
        if (!deletedLink) {
            return res.status(404).json({ error: "Link not found" })
        }
        res.status(200).json({ message: "Link deleted succesfully!" })
    } catch (error) {
        console.error("Error deleting link:", err.message);
        res.status(500).json({ error: "Failed to delete a link" });
    }
})
module.exports = router;
