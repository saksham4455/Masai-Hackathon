import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import AuthPage from './pages/AuthPage'
import ReportIssue from './pages/ReportIssue'
import TrackComplaint from './pages/TrackComplaint'
import Dashboard from './pages/Dashboard'
import ComplaintDetail from './pages/ComplaintDetail'
import PublicMap from './pages/PublicMap'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow max-w-6xl w-full mx-auto p-4">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/track" element={<TrackComplaint />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/complaint/:id" element={<ComplaintDetail />} />
            <Route path="/map" element={<PublicMap />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
