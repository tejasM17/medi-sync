// frontend/src/components/AIAgentsLog.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const AIAgentsLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/ai-logs');
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 2000); // Real-time feel
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🧠 AI Agents Observatory</h1>
          <p className="text-zinc-400">Multi-Agent Collaboration • Live Thinking</p>
        </div>
        <button 
          onClick={() => axios.delete('http://localhost:5000/api/ai-logs')}
          className="text-xs px-4 py-2 bg-zinc-800 hover:bg-red-600 rounded-xl"
        >
          Clear Logs
        </button>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-6 min-h-[600px]">
        {loading ? (
          <p className="text-center py-20 text-zinc-500">Waiting for AI activity...</p>
        ) : logs.length === 0 ? (
          <p className="text-center py-20 text-zinc-500">No activity yet. Simulate a patient email.</p>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="bg-zinc-800 rounded-2xl p-5 border-l-4 border-cyan-500">
                <div className="flex justify-between text-xs mb-2 text-zinc-400">
                  <span className="font-mono text-cyan-400">{log.agent}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-white font-medium">{log.action}</p>
                {log.details && <p className="text-sm text-zinc-400 mt-1">{log.details}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAgentsLog;
