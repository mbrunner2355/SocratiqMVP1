import { Routes, Route } from 'react-router-dom'
import { SocratIQPlatform } from './components/SocratIQPlatform'
import { EMMEEngageApp } from './components/EMMEEngageApp'
import { ProjectDetails } from './components/ProjectDetails'
import { Toaster } from './components/ui/toast/toaster'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<SocratIQPlatform />} />
        <Route path="/emme/*" element={<EMMEEngageApp />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App