'use client'
import { signOut } from 'next-auth/react'
import React from 'react'

export default function LogoutBtn() {
    const handleLogout = () => {
       signOut({
            callbackUrl: '/'})
    }

  return (
    <button id="logout-btn" onClick={handleLogout}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full text-sm transition duration-300 ease-in-out shadow-md cursor-pointer">
           Logout
        </button>
  )
}
