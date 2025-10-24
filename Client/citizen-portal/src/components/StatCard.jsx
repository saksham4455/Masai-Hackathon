import React from 'react'

export default function StatCard({ title, value }) {
  return (
    <div className="bg-white shadow p-4 rounded">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
