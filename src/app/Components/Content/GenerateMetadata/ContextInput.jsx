'use client'
export default function ContextInput({ context, setContext }) {
    return (
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
            <p className="text-xs text-gray-500 mt-1">
                This helps AI generate better metadata, but is optional.
            </p>
        </div>
    )
}