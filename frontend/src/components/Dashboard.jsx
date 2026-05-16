// frontend/src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Eye, Loader } from 'lucide-react';
import CaseDetail from './CaseDetail';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const handleStartTriage = async () => {
    setIsProcessing(true);
    try {
      const mockData = {
        email_body: "Hello Doctor, I have been suffering from severe headache and blurred vision since yesterday morning. Feeling very dizzy."
      };

      // POST to Python Backend
      const res = await axios.post(`${apiBaseUrl}/api/incoming-patient`, mockData);
      console.log("Task created:", res.data.task_id);

      // Refresh tasks after a short delay to see the new task
      setTimeout(() => fetchTasks(), 1000);
    } catch (err) {
      alert("Error initiating triage: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchTasks = async () => {
    try {
      // GET all cases from Python Backend
      const res = await axios.get(`${apiBaseUrl}/api/incoming-patient`);
      const tasksArray = Object.values(res.data.tasks || {}).sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      setTasks(tasksArray);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Medi-Sync Doctor Dashboard</h1>
          <p className="text-zinc-400 mt-2">Multi-Agent AI Triage System (Python API)</p>
        </div>
        
        <button
          onClick={handleStartTriage}
          disabled={isProcessing}
          className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-3.5 rounded-2xl font-medium transition-all disabled:opacity-70 shadow-lg shadow-blue-500/20"
        >
          {isProcessing ? <Loader className="animate-spin" size={20} /> : <Plus size={22} />}
          {isProcessing ? "AI Processing..." : "Simulate Patient Email"}
        </button>
      </div>

      {/* Recent Cases */}
      <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
        <h2 className="text-2xl font-semibold mb-6">Recent Patient Cases</h2>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-cyan-500" size={32} />
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-center py-12 text-zinc-500 italic">No cases yet. Click "Simulate Patient Email"</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div 
                key={task.task_id} 
                className="bg-zinc-800 hover:bg-zinc-700 p-5 rounded-2xl flex items-center justify-between cursor-pointer transition-all group border border-zinc-700 hover:border-cyan-500/30"
                onClick={() => setSelectedCase(task)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
                      #{task.task_id}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                      {new Date(task.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 line-clamp-1">{task.email_body}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-4 py-1 text-[10px] rounded-full font-black tracking-tighter uppercase ${
                    task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                    task.status === 'failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                    'bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse'
                  }`}>
                    {task.status}
                  </span>
                  
                  {task.triage_report && (
                    <span className={`px-4 py-1 text-[10px] rounded-full font-black tracking-tighter uppercase ${
                      task.triage_report.urgency === 'High' ? 'bg-red-500 text-white' : 
                      task.triage_report.urgency === 'Medium' ? 'bg-amber-500 text-black' : 'bg-zinc-600 text-white'
                    }`}>
                      {task.triage_report.urgency}
                    </span>
                  )}
                  <div className="p-2 bg-zinc-900 rounded-xl group-hover:bg-cyan-500 transition-all group-hover:scale-110">
                    <Eye size={18} className="text-zinc-400 group-hover:text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCase && (
        <CaseDetail data={selectedCase} onClose={() => setSelectedCase(null)} />
      )}
    </div>
  );
};

export default Dashboard;
