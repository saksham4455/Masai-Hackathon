import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-6">
      <div className="max-w-6xl mx-auto p-4 text-sm">© {new Date().getFullYear()} Citizen Portal</div>
    </footer>
  )
}
