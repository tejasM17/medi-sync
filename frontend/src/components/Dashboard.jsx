// frontend/src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate Patient Button
  const simulatePatientEmail = async () => {
    try {
      const mockData = {
        from: "patient.test@example.com",
        subject: "Severe headache and blurred vision for 2 days",
        body: "Hello Doctor, I have been suffering from severe headache and blurred vision since yesterday morning. Please help."
      };

      const res = await axios.post('http://localhost:5000/api/webhook/email', mockData);
      alert("✅ Patient email sent successfully!\nCheck Backend Console.");
      fetchEmails();
    } catch (err) {
      alert("Failed to send email: " + err.message);
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

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome back, Doctor</h1>
          <p className="text-zinc-400 mt-2">Real-time Patient Triage System</p>
        </div>
        
        <button
          onClick={simulatePatientEmail}
          className="flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-2xl font-medium transition-all active:scale-95"
        >
          <Plus size={20} />
          Simulate Patient Email
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-red-500/30 rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <AlertTriangle className="text-red-500" size={32} />
            <div>
              <p className="text-sm text-zinc-400">Emergency</p>
              <p className="text-4xl font-bold">03</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-amber-500/30 rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <Clock className="text-amber-500" size={32} />
            <div>
              <p className="text-sm text-zinc-400">Urgent</p>
              <p className="text-4xl font-bold">07</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-emerald-500/30 rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <CheckCircle className="text-emerald-500" size={32} />
            <div>
              <p className="text-sm text-zinc-400">Routine</p>
              <p className="text-4xl font-bold">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Cases */}
      <div className="bg-zinc-900 rounded-3xl p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Patient Messages</h2>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {emails.length === 0 ? (
              <p className="text-zinc-500 text-center py-8">No emails yet. Click "Simulate Patient Email"</p>
            ) : (
              emails.map((email) => (
                <div key={email._id} className="bg-zinc-800 rounded-2xl p-5 flex justify-between items-center hover:bg-zinc-700 transition">
                  <div>
                    <p className="font-medium">{email.subject}</p>
                    <p className="text-sm text-zinc-400">{email.patientId?.email}</p>
                  </div>
                  <div className="text-xs bg-zinc-700 px-3 py-1 rounded-full">
                    {new Date(email.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
