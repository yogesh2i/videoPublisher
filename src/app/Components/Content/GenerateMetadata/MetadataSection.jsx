import React from 'react'

export default function MetadataSection({ children }) {
    return (
        <section id="metadata-section" className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            {children}
        </section>
    );
}
