import React from 'react'
import StatCard from '../components/StatCard'

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <StatCard title="Open" value={12} />
        <StatCard title="Closed" value={34} />
        <StatCard title="Pending" value={5} />
      </div>
    </div>
  )
}
