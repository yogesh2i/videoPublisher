'use client'
import React, { useContext, useState } from 'react'
import { VideoContext } from '@/providers/VideoContext'
import Link from 'next/link'

export default function GenerateMetadata() {
  const { videoFile, metadata, setMetadata } = useContext(VideoContext)
  const [context, setContext] = useState('')
  const [title, setTitle] = useState(metadata.title || '')
  const [description, setDescription] = useState(metadata.description || '')
  const [tags, setTags] = useState(metadata.tags || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Initial Gemini API call with video file
  const generateMetadata = async () => {
    if (!videoFile) {
      setError('No video file found.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('video', videoFile)
      formData.append('context', context)

      const res = await fetch('/api/generate-metadata', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to generate metadata')
      }

      const data = await res.json()
      setTitle(data.title || '')
      setDescription(data.description || '')
      setTags(data.tags || '')
      setMetadata({ title: data.title || '', description: data.description || '', tags: data.tags || '' })
    } catch (err) {
      setError('Failed to generate metadata. ' + (err?.message || ''))
    }
    setLoading(false)
  }

  // Refine a single field (title/description/tags)
  const refineField = async (slug, value) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/generate-metadata/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, context }),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to refine')
      }
      const data = await res.json()
      if (slug === 'title') {
        setTitle(data.title || '')
        setMetadata(prev => ({ ...prev, title: data.title || '' }))
      } else if (slug === 'description') {
        setDescription(data.description || '')
        setMetadata(prev => ({ ...prev, description: data.description || '' }))
      } else if (slug === 'tags') {
        setTags(data.tags || '')
        setMetadata(prev => ({ ...prev, tags: data.tags || '' }))
      }
    } catch (err) {
      setError('Failed to refine. ' + (err?.message || ''))
    }
    setLoading(false)
  }

  return (
    <section id="metadata-section" className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">AI-Generated Metadata</h2>
      <p className="text-gray-600 mb-6">Our AI will generate a title, description, and tags. Review and edit as needed.</p>
      <div className="mb-6">
        <label htmlFor="video-context" className="block text-lg font-medium text-gray-700">
          Context (optional)
        </label>
        <textarea
          id="video-context"
          rows="3"
          value={context}
          onChange={e => setContext(e.target.value)}
          placeholder="Add any extra context or notes about your video (optional)..."
          className="block w-full bg-gray-50 text-gray-800 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm custom-scrollbar"
        />
        <p className="text-xs text-gray-500 mt-1">This helps AI generate better metadata, but is optional.</p>
      </div>
      <button
        onClick={generateMetadata}
        disabled={loading}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
      >
        {loading ? "Generating..." : "Generate Metadata"}
      </button>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="video-title" className="block text-lg font-medium text-gray-700">Video Title</label>
            <button
              id="generate-title-btn"
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              onClick={() => refineField('title', title)}
              disabled={loading}
              type="button"
            >
              Regenerate
            </button>
          </div>
          <input
            type="text"
            id="video-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="A captivating title for your video..."
            className="block w-full bg-gray-50 text-gray-800 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="video-description" className="block text-lg font-medium text-gray-700">Video Description</label>
            <button
              id="generate-description-btn"
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              onClick={() => refineField('description', description)}
              disabled={loading}
              type="button"
            >
              Regenerate
            </button>
          </div>
          <textarea
            id="video-description"
            rows="8"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="A detailed and engaging description of your video content..."
            className="block w-full bg-gray-50 text-gray-800 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm custom-scrollbar"
          ></textarea>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="video-tags" className="block text-lg font-medium text-gray-700">Video Tags</label>
            <button
              id="generate-tags-btn"
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              onClick={() => refineField('tags', tags)}
              disabled={loading}
              type="button"
            >
              Regenerate
            </button>
          </div>
          <input
            type="text"
            id="video-tags"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="tag1, tag2, tag3, ..."
            className="block w-full bg-gray-50 text-gray-800 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Separate tags with commas.</p>
        </div>
        <div className="flex justify-end">
                    <Link href={"/content/publish"} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                        Publish
                    </Link>
                </div>
      </div>
    </section>
  )
}