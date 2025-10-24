import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-blue-600 text-white">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold">Citizen Portal</Link>
          <nav className="flex gap-4">
            <Link to="/report" className="hover:text-blue-100">Report Issue</Link>
            <Link to="/track" className="hover:text-blue-100">Track Complaint</Link>
            <Link to="/map" className="hover:text-blue-100">Public Map</Link>
            <Link to="/dashboard" className="hover:text-blue-100">Dashboard</Link>
            <Link to="/auth" className="hover:text-blue-100">Sign In</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
