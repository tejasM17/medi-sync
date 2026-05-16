// frontend/src/components/Reports.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, FileText, ChevronRight, Loader } from 'lucide-react';

const Reports = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [fetchingReport, setFetchingReport] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/incoming-patient`);
      const tasksArray = Object.values(res.data.tasks || {}).filter(t => t.status === 'completed');
      setTasks(tasksArray);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const viewDetailedReport = async (taskId) => {
    setFetchingReport(true);
    try {
      const res = await axios.get(`${apiBaseUrl}/api/reports/${taskId}`);
      setSelectedReport(res.data);
    } catch (err) {
      alert("Failed to fetch structured report: " + err.message);
    } finally {
      setFetchingReport(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clinical AI Reports</h1>
        <p className="text-zinc-400 bg-zinc-800 px-4 py-1 rounded-full text-sm border border-zinc-700">
          Source: Python AI Service
        </p>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-6 min-h-[500px]">
        {loading ? (
          <p className="text-center py-20">Loading available cases...</p>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p>No completed triage reports yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <div 
                key={task.task_id} 
                className="bg-zinc-800 p-6 rounded-2xl hover:bg-zinc-700 transition-all cursor-pointer border border-zinc-700 hover:border-cyan-500/50 group"
                onClick={() => viewDetailedReport(task.task_id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-cyan-500/10 text-cyan-400 text-xs px-2 py-1 rounded font-mono">
                    #{task.task_id}
                  </div>
                  <ChevronRight size={20} className="text-zinc-500 group-hover:text-cyan-400 transition" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Patient Triage Case</h3>
                <p className="text-zinc-400 text-sm line-clamp-2 mb-4">{task.email_body}</p>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    task.triage_report?.urgency === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {task.triage_report?.urgency}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {new Date(task.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Structured Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-zinc-700 flex flex-col">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="text-cyan-400" />
                  {selectedReport.header.report_id}
                </h2>
                <p className="text-xs text-zinc-500">Case Ref: {selectedReport.header.patient_case_ref}</p>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-zinc-800 rounded-xl transition">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              {/* Clinical Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold border-b border-zinc-800 pb-2">Clinical Summary</h3>
                  <div className="bg-zinc-800/50 p-5 rounded-2xl border border-zinc-800 leading-relaxed">
                    {selectedReport.clinical_summary.initial_assessment}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b border-zinc-800 pb-2">Identified Symptoms</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedReport.clinical_summary.identified_symptoms.map((s, i) => (
                      <span key={i} className="bg-zinc-800 px-3 py-1.5 rounded-lg text-sm border border-zinc-700">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className={`p-4 rounded-xl border font-bold text-center ${
                    selectedReport.clinical_summary.urgency_level === 'High' ? 'border-red-500/50 text-red-400 bg-red-500/5' : 'border-amber-500/50 text-amber-400 bg-amber-500/5'
                  }`}>
                    {selectedReport.clinical_summary.urgency_level} PRIORITY
                  </div>
                </div>
              </div>

              {/* Medical Guidance */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b border-zinc-800 pb-2">Medical Guidance</h3>
                <div className="bg-cyan-500/5 border border-cyan-500/20 p-5 rounded-2xl text-cyan-100/90 leading-relaxed">
                  {selectedReport.medical_guidance}
                </div>
              </div>

              {/* Research Background */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b border-zinc-800 pb-2">Research Background</h3>
                <div className="bg-zinc-800/30 p-5 rounded-2xl text-sm text-zinc-400 leading-relaxed">
                  {selectedReport.research_background}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-600 text-center">
                {selectedReport.disclaimer}
              </div>
            </div>

            <div className="p-6 border-t border-zinc-800 bg-zinc-900 flex justify-end">
              <button 
                onClick={() => setSelectedReport(null)}
                className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {fetchingReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] backdrop-blur-sm">
          <div className="bg-zinc-900 p-6 rounded-2xl flex items-center gap-4 border border-zinc-700 shadow-2xl">
            <Loader className="animate-spin text-cyan-400" />
            <p>Generating Structured Report...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
