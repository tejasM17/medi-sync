// frontend/src/components/Reports.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Send, Eye } from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      // For now, we'll fetch from GeneratedReport (we'll add route later)
      const res = await axios.get('http://localhost:5000/api/reports'); // We'll create this route next
      setReports(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDownload = async (report) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/reports/download/${report._id}`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', report.pdfFileName || 'triage-report.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    alert("Download failed: " + err.message);
  }
};

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Generated Reports</h1>

      <div className="bg-zinc-900 rounded-3xl p-6">
        {loading ? (
          <p>Loading reports...</p>
        ) : reports.length === 0 ? (
          <p className="text-center py-12 text-zinc-500">No reports generated yet. Simulate a patient email first.</p>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report._id} className="bg-zinc-800 p-5 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="font-medium">{report.title}</p>
                  <p className="text-sm text-zinc-400">{new Date(report.createdAt).toLocaleString()}</p>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleDownload(report)}
                    className="flex items-center gap-2 bg-zinc-700 hover:bg-blue-600 px-4 py-2 rounded-xl transition"
                  >
                    <Download size={18} /> Download PDF
                  </button>
                  <button className="flex items-center gap-2 bg-zinc-700 hover:bg-emerald-600 px-4 py-2 rounded-xl transition">
                    <Send size={18} /> Send to Patient
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
