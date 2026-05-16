// frontend/src/components/CaseDetail.jsx
import { X, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const CaseDetail = ({ data, onClose }) => {
  const triage = data.triage_report || {};

  const getUrgencyColor = (urgency) => {
    if (urgency === 'High') return 'text-red-500 border-red-500';
    if (urgency === 'Medium') return 'text-amber-500 border-amber-500';
    return 'text-emerald-500 border-emerald-500';
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-zinc-700">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-700 p-6">
          <div>
            <h2 className="text-2xl font-bold">AI Triage Analysis</h2>
            <p className="text-zinc-400">Task ID: {data.task_id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-xl">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-auto max-h-[80vh]">
          {/* Urgency Banner */}
          <div className={`p-6 rounded-2xl border-2 mb-6 ${getUrgencyColor(triage.urgency)}`}>
            <div className="flex items-center gap-4">
              {triage.urgency === 'High' && <AlertTriangle size={40} />}
              {triage.urgency === 'Medium' && <Clock size={40} />}
              {triage.urgency === 'Low' && <CheckCircle size={40} />}
              
              <div>
                <p className="text-sm opacity-75">AI DETERMINED URGENCY</p>
                <p className="text-4xl font-bold">{triage.urgency}</p>
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Symptoms Detected</h3>
            <div className="flex flex-wrap gap-2">
              {triage.symptoms_list?.map((symptom, i) => (
                <span key={i} className="bg-zinc-800 px-4 py-2 rounded-xl text-sm">
                  {symptom}
                </span>
              ))}
            </div>
          </div>

          {/* Medical Guidance */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Medical Guidance</h3>
            <div className="bg-zinc-800 p-5 rounded-2xl leading-relaxed whitespace-pre-wrap">
              {triage.medical_guidance}
            </div>
          </div>

          {/* Doctor Notes */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Doctor Notes</h3>
            <div className="bg-zinc-800 p-5 rounded-2xl leading-relaxed">
              {triage.doctor_notes}
            </div>
          </div>

          {/* Research Facts */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Research Summary</h3>
            <div className="bg-zinc-800/70 p-5 rounded-2xl text-sm leading-relaxed text-zinc-300">
              {data.research_facts}
            </div>
          </div>

          {/* Reflection (AI Thinking) */}
          {data.reflection && (
            <div>
              <h3 className="text-lg font-semibold mb-3">AI Reflection / Critique</h3>
              <div className="bg-zinc-900 border border-zinc-700 p-5 rounded-2xl text-sm italic text-zinc-400">
                {data.reflection}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;
