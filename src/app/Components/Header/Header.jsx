import React from 'react'
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import User from './User';

export default function Header() {
  return (
    <header className="text-center mb-10 flex flex-col sm:flex-row justify-between items-center">
      <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-0 flex items-center">
        <FontAwesomeIcon icon={faYoutube} className="text-red-600 text-3xl mr-3 sm:text-6xl" />
        <span className="text-blue-600">AI-Powered</span> <span className="text-gray-700 ml-2">Publisher</span>
      </h1>
      <User />
    </header>
  )
}
