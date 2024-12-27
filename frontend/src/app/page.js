"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { DeleteIcon } from "./deleteIcon";
import Link from "next/link";

export default function Home() {
  const [url, setUrl] = useState("");
  const [articles, setArticles] = useState([]);
  const [error, setError] =  useState("")


  const BASE_URL = "http://localhost:3001"

  // Fetch articles on page load
  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await axios.get(`${BASE_URL}/api/links`);
        setArticles(response.data);
      } catch (err) {
        console.error("Failed to fetch articles:", err.message);
      }
    }
    fetchArticles();
  }, []);

  // Handle URL submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return alert("Please enter a valid URL");

    try {
      setError("")
      const response = await axios.post(`${BASE_URL}/api/links/save`, { url });
      setArticles((prev) => [...prev, response.data]);
      setUrl(""); // Reset the input field
    } catch (err) {
      if (err.response?.status === 409) {
        // Handle duplicate URL error
        setError("This URL has already been added to your catalog.");
      } else if (err.response?.status === 400) {
        // Handle invalid URL error
        setError("Invalid URL. Please provide a valid URL.");
      } else {
        // Handle other errors
        setError("An error occurred while saving the URL. Please try again.");
      }
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      console.log("Deleting article with ID:", id);
      await axios.delete(`${BASE_URL}/api/links/${id}`)
      console.log("Article deleted. Fetching updated list...");
      const response = await axios.get(`${BASE_URL}/api/links`);
      setArticles(response.data);
    } catch (error) {
      console.error("Failed to delete the article:", err.message);
    }
  }
  return (
    <div className="min-h-screen p-6 bg-gray-100">


      {/* Input Section */}
      <div className="bg-white shadow-md p-6 rounded-md max-w-xl mx-auto mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="url" className="text-lg font-semibold mb-2 text-red-900">
            Enter Article URL
          </label>
          <div className="flex flex-col ">
            <div className="flex gap-4 ">
            <input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 border focus:outline-none border-red-900 text-red-800 placeholder-red-950 rounded-md p-2 mb-4"
              required
            />
            <button
              type="submit"
              className="flex-none bg-red-800 hover:bg-red-900 text-white py-1 h-10 px-4 rounded-md"
            >
              Submit
            </button>
            </div>
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          </div>
        </form>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-5 gap-4">
        {articles.map((article) => (
          <div key={article._id} className="bg-white shadow-lg rounded-lg h-80 overflow-hidden">
            {/* Link wrapping the image and title */}
            <Link
              href={article.metadata.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-72"
            >
              {article.metadata?.image && (
                <img
                  src={article.metadata.image}
                  alt={article.metadata.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4 flex flex-col gap-2 justify-between">
                <h3 className="font-semibold text-sm text-red-900">
                  {article.metadata.title}
                </h3>
              </div>
            </Link>
            {/* Delete Icon outside the link */}
            <div className="p-4 flex justify-between items-center h-8">
              <p className="text-xs text-black">{article.metadata?.publisher}</p>
              <DeleteIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(article._id);
                }}
                color="#991b1b"
                style={{ cursor: "pointer", zIndex: "100" }}
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}