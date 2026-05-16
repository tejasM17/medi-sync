// frontend/src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, AlertTriangle, Clock, CheckCircle, Eye, Loader } from 'lucide-react';
import CaseDetail from './CaseDetail';

const Dashboard = () => {
  const [emails, setEmails] = useState([]);
  const [aiLogs, setAiLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const simulatePatientEmail = async () => {
    setIsProcessing(true);
    try {
      const mockData = {
        from: "patient.test@example.com",
        subject: "Severe headache and blurred vision for 2 days",
        body: "Hello Doctor, I have been suffering from severe headache and blurred vision since yesterday morning. Feeling very dizzy."
      };

      const res = await axios.post('http://localhost:5000/api/webhook/email', mockData);
      
      // Simulate Grok-like thinking
      setAiLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        agent: "Orchestrator",
        action: "Received patient email → Starting Multi-Agent Pipeline",
        status: "thinking"
      }]);

      setTimeout(() => fetchEmails(), 1500);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchEmails = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/webhook/emails');
      setEmails(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAiLogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/ai-logs');
      setAiLogs(res.data.logs || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmails();
    fetchAiLogs();
    
    const interval = setInterval(() => {
      fetchEmails();
      fetchAiLogs();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Medi-Sync Doctor Dashboard</h1>
          <p className="text-zinc-400 mt-2">Multi-Agent AI Triage System</p>
        </div>
        
        <button
          onClick={simulatePatientEmail}
          disabled={isProcessing}
          className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-3.5 rounded-2xl font-medium transition-all disabled:opacity-70"
        >
          {isProcessing ? <Loader className="animate-spin" size={20} /> : <Plus size={22} />}
          {isProcessing ? "AI Processing..." : "Simulate Patient Email"}
        </button>
      </div>
      

      {/* Recent Cases */}
      <div className="bg-zinc-900 rounded-3xl p-6">
        <h2 className="text-2xl font-semibold mb-6">Recent Patient Cases</h2>
        
        {emails.length === 0 ? (
          <p className="text-center py-12 text-zinc-500">No cases yet. Click "Simulate Patient Email"</p>
        ) : (
          <div className="space-y-4">
            {emails.map((email) => (
              <div 
                key={email._id} 
                className="bg-zinc-800 hover:bg-zinc-700 p-5 rounded-2xl flex items-center justify-between cursor-pointer transition-all group"
                onClick={() => setSelectedCase(email)}
              >
                <div className="flex-1">
                  <p className="font-medium">{email.subject}</p>
                  <p className="text-sm text-zinc-400">{email.patientId?.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  {email.triage && (
                    <span className={`px-4 py-1 text-sm rounded-xl font-medium ${
                      email.triage.urgency === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {email.triage.urgency}
                    </span>
                  )}
                  <Eye size={20} className="opacity-0 group-hover:opacity-100 transition text-cyan-400" />
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
