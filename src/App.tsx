import { useState } from 'react'

function App() {
  const [activeView, setActiveView] = useState('home')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EMME Engage</h1>
              <p className="text-sm text-gray-600">Strategic Intelligence Platform</p>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => setActiveView('home')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeView === 'home' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => setActiveView('projects')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeView === 'projects' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Projects
              </button>
              <button 
                onClick={() => setActiveView('intelligence')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeView === 'intelligence' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Intelligence
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'home' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">EMME Engage Dashboard</h2>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Projects</h3>
                <p className="text-3xl font-bold text-blue-600">24</p>
                <p className="text-sm text-gray-600">Projects in progress</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Launch Success Rate</h3>
                <p className="text-3xl font-bold text-green-600">89%</p>
                <p className="text-sm text-gray-600">Above industry average</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cost Reduction</h3>
                <p className="text-3xl font-bold text-purple-600">55%</p>
                <p className="text-sm text-gray-600">Marketing spend optimization</p>
              </div>
            </div>

            {/* Recent Intelligence Updates */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Intelligence Updates</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                  <span className="text-gray-900">Market Analysis Update - Oncology Therapeutics</span>
                  <span className="text-sm text-gray-600">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                  <span className="text-gray-900">Competitive Intelligence - Regulatory Pathway Analysis</span>
                  <span className="text-sm text-gray-600">4 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                  <span className="text-gray-900">Stakeholder Engagement Metrics - Q3 Results</span>
                  <span className="text-sm text-gray-600">6 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'projects' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Project Management</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Oncology Launch Strategy</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Active</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">78%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-09-15</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Market Access Analysis</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">In Review</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">92%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-08-30</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Competitive Intelligence Study</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Planning</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">23%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-10-01</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'intelligence' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Strategic Intelligence</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Therapeutic Area Performance</h4>
                    <p className="text-sm text-blue-700 mt-1">Oncology segment showing 15% growth potential</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Regulatory Landscape</h4>
                    <p className="text-sm text-green-700 mt-1">FDA breakthrough designations increased 8% YoY</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">Payer Dynamics</h4>
                    <p className="text-sm text-purple-700 mt-1">Value-based contracts up 22% in key markets</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-900">Market Competition Risk</span>
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">Medium</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-900">Regulatory Risk</span>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Low</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-900">Market Access Risk</span>
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">High</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-900">Commercial Risk</span>
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">Medium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App