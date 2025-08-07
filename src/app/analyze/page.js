"use client";
import React, { useState } from "react";
import MomentsList from "../Components/Analyze/MomentsList";

export default function Page() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  //handle url changes
  //if error occurs remove old data
  //if suceeds remove error
  const handleUrlChange = (e) => {
    if (e.target.value.length > 0) {
      setErr("");
      setUrl(e.target.value);
    } else {
      setErr("Please enter a valid YouTube URL.");
      setUrl("");
      setData([]);
    }
  };

  //function to fetch viral moments
  const handleAnalyze = async () => {
    try {
      setLoading(true);
      if (!url) {
        setErr("Please enter a YouTube video URL.");
        return;
      }
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (data.error) {
        setErr(data.error);
      } else {
        setData(data.segments);
        setErr("");
      }
    } catch (err) {
      console.error("Error analyzing video:", err);
      setErr("Failed to analyze video. Please try again later.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 p-1 sm:p-20">
      <div
        id="analytics-page"
        className="bg-white p-3 sm:p-8 rounded-lg shadow-lg border border-gray-200 text-center"
      >
        <div className="flex items-center mb-8">
          <h1 className="text-xl sm:text-3xl font-extrabold text-blue-700 mb-0 tracking-tight">
            Video Analytics: Viral Moments
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            id="youtube-url-input"
            placeholder="Paste YouTube video URL here..."
            onChange={handleUrlChange}
            value={url}
            className="flex-grow p-3 px-5 border border-gray-300 rounded-xl text-base text-gray-700 bg-gray-50 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-300"
          />
          <button
            id="analyze-video-btn"
            onClick={handleAnalyze}
            className={`px-8 py-3 bg-blue-600 text-white font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-md ${loading && "animate-pulse"}`}
            disabled = {loading}
           >
            {!loading ? "Analyze Video" : "Analyzing..."}
          </button>
        </div>

        {data.length > 0 && (
          <div id="video-content" className="">
            <h2 className="text-xl sm:text-3xl font-extrabold text-blue-700 mt-8 mb-6 tracking-tight">
              Potential Viral Moments{" "}
            </h2>
            <p className="text-gray-600 mb-6">
              These segments are identified based on simulated engagement cues
              and are ideal for short-form content.
            </p>

            <ul id="timestamps-list" className="list-none p-0 m-0">
              {data.map((i, idx) => {
                return (
                  <MomentsList
                    data={{ idx, url, item: i, setSelectedIdx, selectedIdx }}
                    key={i.start + i.end}
                  />
                );
              })}
            </ul>
          </div>
        )}
        <div id="error-message" className="text-red-600 text-center py-4">
          {err}
        </div>
      </div>
    </section>
  );
}
