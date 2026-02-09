import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './routes/Home'
import Dashboard from './routes/Dashboard'
import RobotControl from './routes/RobotControl'
import Orders from './routes/Orders'
import Analytics from './routes/Analytics'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 ml-64 mt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/robot-control" element={<RobotControl />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
