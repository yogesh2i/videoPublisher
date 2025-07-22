'use client'
import { VideoContext } from '@/providers/VideoContext';
import React, { useContext, useState } from 'react'

export default function Publish() {
  const { videoFile, metadata } = useContext(VideoContext);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handlePublish = async () => {
    if (!videoFile || !metadata.title || !metadata.description) {
      setError('Missing video or metadata.');
      return;
    }
    setLoading(true);
    setStatus('Publishing...');
    setError('');
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('title', metadata.title);
      formData.append('description', metadata.description);
      formData.append('tags', metadata.tags);

      const res = await fetch('/api/publish', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish video.');
      }
      setStatus(`Video published! YouTube Video ID: ${data.videoId}`);
    } catch (err) {
      setError(err.message || 'Failed to publish video.');
      setStatus('');
    }
    setLoading(false);
  };

  return (
    <section id="publish-section" className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Publish Your Video</h2>
      <p className="text-gray-600 mb-6">Your video is ready! Review the final details before publishing.</p>

      <div className="text-left mb-8 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Final Title:</h3>
          <p id="final-title-display" className="bg-gray-50 p-3 rounded-md text-gray-700 font-medium break-words">{metadata?.title}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Final Description:</h3>
          <p id="final-description-display" className="bg-gray-50 p-3 rounded-md text-gray-700 whitespace-pre-wrap break-words custom-scrollbar max-h-40 overflow-y-auto">{metadata?.description}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Final Tags:</h3>
          <p id="final-tags-display" className="bg-gray-50 p-3 rounded-md text-gray-700 break-words">{metadata?.tags}</p>
        </div>
      </div>

      <button
        id="publish-video-btn"
        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center mx-auto"
        onClick={handlePublish}
        disabled={loading}
      >
        {loading ? 'Publishing...' : 'Publish to YouTube'}
      </button>
      {status && <p id="publish-status" className="mt-6 text-sm text-green-600">{status}</p>}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
    </section>
  )
}
