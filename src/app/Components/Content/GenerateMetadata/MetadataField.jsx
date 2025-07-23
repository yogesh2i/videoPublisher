'use client'
import React from 'react'

export default function MetadataField({
    label,
    value,
    setValue,
    onRegenerate,
    loading,
    id,
    placeholder,
    multiline = false,
    helperText
}) {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label htmlFor={id} className="block text-lg font-medium text-gray-700">{label}</label>
                <button
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    onClick={onRegenerate}
                    disabled={loading}
                    type="button"
                >
                    Regenerate
                </button>
            </div>
            {multiline ? (
                <textarea
                    id={id}
                    rows="8"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder={placeholder}
                    className="block w-full bg-gray-50 text-gray-800 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm custom-scrollbar"
                />
            ) : (
                <input
                    type="text"
                    id={id}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder={placeholder}
                    className="block w-full bg-gray-50 text-gray-800 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            )}
            {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
        </div>
    )
}