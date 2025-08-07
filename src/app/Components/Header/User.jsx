'use client'
import { useSession } from 'next-auth/react'
import React from 'react'
import LogoutBtn from './LogoutBtn';
import Link from 'next/link';
export default function User() {
    const { data } = useSession();
    return (
        <div id="user-info-header" className={`flex items-center space-x-4 mt-4 sm:mt-0 ${!data && 'hidden'}`}>
              <Link href="/dashboard" className="text-blue-600 text-lg font-semibold">Home</Link>
            <p className="text-lg text-gray-700">Welcome,  <span id="username-display" className="font-semibold text-blue-600">{data?.user?.name || "User"}</span> </p>
            <LogoutBtn />
        </div>

    )
}
