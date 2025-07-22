'use client'
import React, { createContext, useState } from 'react'

export const VideoContext = createContext({
  videoFile: null,
  setVideoFile: () => {},
  videoURL: '',         
  setVideoURL: () => {},
  metadata: { title: '', description: '', tags: '' },
  setMetadata: () => {},
})

export function VideoProvider({ children }) {
  const [videoFile, setVideoFile] = useState(null)
  const [videoURL, setVideoURL] = useState('')
  const [metadata, setMetadata] = useState({ title: '', description: '', tags: '' })

  return (
    <VideoContext.Provider value={{ videoFile, setVideoFile, videoURL, setVideoURL, metadata, setMetadata }}>
      {children}
    </VideoContext.Provider>
  )
}
