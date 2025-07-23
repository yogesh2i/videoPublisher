'use client'
import React, { useContext, useState } from 'react'
import { VideoContext } from '@/providers/VideoContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import MetadataField from './MetadataField'
import ContextInput from './ContextInput'

export default function GenerateMetadataForm() {
    const { videoFile, metadata, setMetadata } = useContext(VideoContext)
    const [context, setContext] = useState('')
    const [title, setTitle] = useState(metadata.title || '')
    const [description, setDescription] = useState(metadata.description || '')
    const [tags, setTags] = useState(metadata.tags || '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter();

    // Redirect to upload page if no video file is available
    if (!videoFile) {
        router.push('/content/upload');
        return null;
    }

    // Function to generate metadata using AI
    const generateMetadata = async () => {
        if (!videoFile) {
            setError('No video file found.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            // Append video and context to formdata
            const formData = new FormData();
            formData.append('video', videoFile);
            formData.append('context', context);
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

    //Function to refine a specific field (title, description, tags)
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
        <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">AI-Generated Metadata</h2>
            <p className="text-gray-600 mb-6">Our AI will generate a title, description, and tags. Review and edit as needed.</p>
            <ContextInput context={context} setContext={setContext} />
            <button
                onClick={generateMetadata}
                disabled={loading}
                className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
                {loading ? "Generating..." : "Generate Metadata"}
            </button>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <div className="space-y-6">
                <MetadataField
                    label="Video Title"
                    value={title}
                    setValue={setTitle}
                    onRegenerate={() => refineField('title', title)}
                    loading={loading}
                    id="video-title"
                    placeholder="A captivating title for your video..."
                />
                <MetadataField
                    label="Video Description"
                    value={description}
                    setValue={setDescription}
                    onRegenerate={() => refineField('description', description)}
                    loading={loading}
                    id="video-description"
                    multiline
                    placeholder="A detailed and engaging description of your video content..."
                />
                <MetadataField
                    label="Video Tags"
                    value={tags}
                    setValue={setTags}
                    onRegenerate={() => refineField('tags', tags)}
                    loading={loading}
                    id="video-tags"
                    placeholder="tag1, tag2, tag3, ..."
                    helperText="Separate tags with commas."
                />
                <div className="flex justify-end">
                    <Link href={"/content/publish"} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                        Publish
                    </Link>
                </div>
            </div>
        </>
    )
}