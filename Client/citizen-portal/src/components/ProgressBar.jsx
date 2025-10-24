import React from 'react'

export default function ProgressBar({ value = 0 }) {
  return (
    <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
      <div className="bg-green-500 h-3 rounded" style={{ width: `${value}%` }} />
    </div>
  )
}
