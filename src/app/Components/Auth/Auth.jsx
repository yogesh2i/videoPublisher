import React from 'react';
import SignupButton from './SignupButton';


export default function Auth() {
    return (
        <div id="auth-page" className="flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-xl text-gray-600 text-center mb-8 max-w-2xl">
                Automate your video publishing workflow with intelligent AI-generated titles, descriptions, and tags.
            </p>
            <section id="auth-section" className="bg-blue-50 p-8 rounded-lg shadow-lg text-center border border-blue-200 w-full max-w-md">
                <h2 className="text-3xl font-bold text-blue-700 mb-6">Connect Your YouTube Account</h2>
                <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded">
                    <strong>Important:</strong>
                    <ul className="list-disc list-inside mt-2 text-left text-sm">
                        <li>
                            This app is accessible <b>only for approved testers</b>. To get access, please email your Google account address to <a href="mailto:yogesh12212071@gmail.com" className="underline text-blue-700">yogesh12212071@gmail.com</a>.
                        </li>
                        <li className="mt-2">
                            <b>Uploading videos requires you to have a YouTube channel created beforehand.</b> Please create a channel on your Google account before connecting.
                        </li>
                    </ul>
                </div>
                <p className="text-gray-600 mb-8">Securely link your YouTube channel to begin automating your uploads.</p>
                <SignupButton />
                <p id="auth-status" className="mt-6 text-sm text-gray-500 hidden">Status: <span className="font-medium">Not Connected</span></p>
            </section>
        </div>
    )
}
