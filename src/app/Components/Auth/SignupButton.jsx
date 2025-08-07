'use client'
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

export default function SignupButton() {
    const [loading, setLoading] = useState(false);
    
    // Function to handle sign-in with Google
    // This function will be called when the user clicks the button
    const handleSignIn = async () => {
        setLoading(true);
        await signIn("google", { redirect: true, callbackUrl: '/dashboard' });
        setLoading(false);
    }
    return (
        <button id="connect-youtube-btn" onClick={handleSignIn} type="submit"
            className={`bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center cursor-pointer mx-auto ${loading && 'animate-pulse'}`}>
            <FontAwesomeIcon icon={faYoutube} className="text-xl mr-3" />  {loading ? 'Logging In...' : "Login with YouTube"}
        </button>
    )
}
