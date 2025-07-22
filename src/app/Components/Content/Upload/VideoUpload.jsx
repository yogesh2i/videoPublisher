'use client'
import { VideoContext } from '@/providers/VideoContext'
import Link from 'next/link'
import React, { useContext, useRef, useState } from 'react'

export default function VideoUpload() {
   const { setVideoFile, setVideoURL, videoFile, videoURL } = useContext(VideoContext);
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVideoFile(file)
      setVideoURL(URL.createObjectURL(file))
      setUploadProgress(0)
      uploadFile(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      setVideoFile(file)
      setVideoURL(URL.createObjectURL(file))
      setUploadProgress(0)
      uploadFile(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  // Simulate upload with progress
  const uploadFile = (file) => {
    setIsUploading(true)
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setIsUploading(false)
      }
    }, 200)
  }

return (
    <section id="upload-section" className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Your Video</h2>
        <p className="text-gray-600 mb-6">Drag & drop your video file here, or click to select.</p>

        <div
            className="flex items-center justify-center w-full"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <label
                htmlFor="video-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition duration-200"
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-12 h-12 mb-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p className="mb-2 text-sm text-blue-600"><span className="font-semibold">Click to browse</span> or drag and drop</p>
                    <p className="text-xs text-blue-500">MP4, MOV, AVI, etc. (Max 1GB)</p>
                </div>
                <input
                    id="video-upload"
                    type="file"
                    className="hidden"
                    accept="video/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
            </label>
        </div>

        {videoFile && (
            <p id="file-name" className="mt-4 text-sm text-gray-600 text-center italic">
                Selected file: {videoFile.name}
            </p>
        )}

        {isUploading && (
            <p id="upload-progress" className="mt-2 text-sm text-blue-600 text-center font-medium">
                Uploading: {uploadProgress}%
            </p>
        )}

        {videoURL && !isUploading && (
            <div id="video-preview-container" className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Video Preview:</h3>
                <video
                    id="video-preview"
                    controls
                    className="w-full max-h-96 rounded-lg shadow-md bg-black border border-gray-300"
                    src={videoURL}
                ></video>
                <div className="flex justify-end">
                    <Link href={"/content/generate-metadata"} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                        Generate Metadata
                    </Link>
                </div>
            </div>
        )}
    </section>
)
}
