// frontend/src/App.jsx
import { useState } from 'react';
import { Menu, X, Bell, User } from 'lucide-react';
import Dashboard from './components/Dashboard';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <div className={`bg-zinc-900 border-r border-zinc-800 w-64 flex-shrink-0 transition-all ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold">M</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Medi-Sync</h1>
          </div>

          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-zinc-800 rounded-xl text-cyan-400">
              <Menu size={20} /> Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 rounded-xl">
              Live Cases
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 rounded-xl">
              Reports
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 rounded-xl">
              Traces
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="border-b border-zinc-800 bg-zinc-900 p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold">Doctor Dashboard</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-zinc-800 rounded-lg">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 bg-zinc-800 px-4 py-2 rounded-2xl">
              <User size={20} />
              <span>Dr. Chidananda</span>
            </div>
          </div>
        </header>

        <main className="p-8">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default App;
