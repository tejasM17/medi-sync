// frontend/src/components/AIAgentsLog.jsx
import { useState, useEffect } from 'react';

const AIAgentsLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const eventSource = new EventSource(`${apiBaseUrl}/api/ai-logs`);
    
    eventSource.onmessage = (event) => {
      try {
        const log = JSON.parse(event.data);
        setLogs((prev) => [log, ...prev].slice(0, 50)); // Keep newest at top
      } catch (err) {
        console.error("Error parsing SSE log:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🧠 AI Agents Observatory</h1>
          <p className="text-zinc-400">Multi-Agent Collaboration • Live Thinking (SSE)</p>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-6 min-h-[600px]">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-zinc-500 space-y-4">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <p>Listening for AI Agent activity...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log, index) => (
              <div 
                key={index} 
                className="bg-zinc-800 rounded-2xl p-5 border-l-4 border-cyan-500 animate-in slide-in-from-left duration-300"
              >
                <div className="flex justify-between text-xs mb-2 text-zinc-400">
                  <span className="font-mono text-cyan-400 px-2 py-0.5 bg-cyan-400/10 rounded-md">
                    {log.agent}
                  </span>
                  <span>{log.timestamp}</span>
                </div>
                <p className="text-white font-medium">{log.message || log.action}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAgentsLog;
