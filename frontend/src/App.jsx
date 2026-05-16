// frontend/src/App.jsx
import { useState } from 'react';
import { Menu } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import AIAgentsLog from './components/AIAgentsLog';   // New Component

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <div className={`bg-zinc-900 border-r border-zinc-800 w-64 flex-shrink-0 transition-all ${sidebarOpen ? '' : 'hidden md:block'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-cyan-500 rounded-2xl flex items-center justify-center text-black font-bold text-xl">M</div>
            <h1 className="text-3xl font-bold tracking-tight">Medi-Sync</h1>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl ${activeTab === 'dashboard' ? 'bg-zinc-800 text-cyan-400' : 'hover:bg-zinc-800'}`}
            >
              Dashboard
            </button>

            <button 
              onClick={() => setActiveTab('ai-agents')}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl ${activeTab === 'ai-agents' ? 'bg-zinc-800 text-cyan-400' : 'hover:bg-zinc-800'}`}
            >
            AI Agents
            </button>

            <button 
              onClick={() => setActiveTab('reports')}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl ${activeTab === 'reports' ? 'bg-zinc-800 text-cyan-400' : 'hover:bg-zinc-800'}`}
            >
              Reports
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-zinc-900 border-b border-zinc-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
              <Menu size={24} />
            </button>
            <h2 className="text-2xl font-semibold">
              {activeTab === 'dashboard' && 'Live Dashboard'}
              {activeTab === 'ai-agents' && 'AI Agents Observatory'}
              {activeTab === 'reports' && 'Generated Reports'}
            </h2>
          </div>
          <div className="text-sm text-zinc-400">Dr. Chidananda • Bengaluru</div>
        </header>

        <main className="p-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'ai-agents' && <AIAgentsLog />}
          {activeTab === 'reports' && <Reports />}
        </main>
      </div>
    </div>
  );
}

export default App;
