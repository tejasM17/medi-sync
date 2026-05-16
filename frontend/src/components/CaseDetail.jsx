// frontend/src/components/CaseDetail.jsx
import { X, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const CaseDetail = ({ data, onClose }) => {
  // Python backend structure
  const triage = data.triage_report || {};

  const getUrgencyColor = (urgency) => {
    if (urgency === 'High') return 'text-red-500 border-red-500';
    if (urgency === 'Medium') return 'text-amber-500 border-amber-500';
    return 'text-emerald-500 border-emerald-500';
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-zinc-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 p-6 bg-zinc-900/50">
          <div>
            <h2 className="text-2xl font-bold">Clinical Case Analysis</h2>
            <p className="text-zinc-500 font-mono text-xs mt-1">UUID: {data.task_id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-xl transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[75vh] space-y-8">
          {/* Urgency Banner */}
          <div className={`p-8 rounded-2xl border-2 bg-zinc-900 ${getUrgencyColor(triage.urgency)}`}>
            <div className="flex items-center gap-6">
              {triage.urgency === 'High' && <AlertTriangle size={48} />}
              {triage.urgency === 'Medium' && <Clock size={48} />}
              {triage.urgency === 'Low' && <CheckCircle size={48} />}
              
              <div>
                <p className="text-xs font-bold tracking-widest opacity-60 uppercase">AI Clinical Urgency</p>
                <p className="text-5xl font-black">{triage.urgency?.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Patient Complaint */}
          <div className="bg-zinc-800/30 p-6 rounded-2xl border border-zinc-800">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Original Patient Message</h3>
            <p className="text-lg italic text-zinc-300 leading-relaxed">"{data.email_body}"</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Symptoms */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-1.5 h-6 bg-cyan-500 rounded-full" />
                Detected Symptoms
              </h3>
              <div className="flex flex-wrap gap-2">
                {triage.symptoms_list?.map((symptom, i) => (
                  <span key={i} className="bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-xl text-sm font-medium">
                    {symptom}
                  </span>
                ))}
              </div>
            </div>

            {/* Medical Guidance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                Medical Guidance
              </h3>
              <div className="bg-zinc-800/50 p-5 rounded-2xl text-sm leading-relaxed border border-zinc-800">
                {triage.medical_guidance}
              </div>
            </div>
          </div>

          {/* Research Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
              Agent Research Insights
            </h3>
            <div className="bg-zinc-800/50 p-6 rounded-2xl text-sm leading-relaxed text-zinc-400 border border-zinc-800">
              {data.research_facts}
            </div>
          </div>

          {/* Reflection */}
          {data.reflection && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-400">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full" />
                Clinical Reflection & Critique
              </h3>
              <div className="bg-purple-500/5 border border-purple-500/20 p-6 rounded-2xl text-sm italic text-purple-200/70 leading-relaxed">
                {data.reflection}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 flex justify-end bg-zinc-900">
          <button
            onClick={onClose}
            className="px-10 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-bold transition-all"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;
