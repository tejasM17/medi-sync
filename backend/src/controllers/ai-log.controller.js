// backend/src/controllers/ai-log.controller.js
let aiLogs = []; // In-memory store (use DB in production)

const addLog = (agent, action, details) => {
  const log = {
    id: Date.now() + Math.random(),
    timestamp: new Date().toISOString(),
    agent,
    action,
    details,
    status: "completed"
  };
  aiLogs.unshift(log); // Add to top
  if (aiLogs.length > 50) aiLogs.pop();
  return log;
};

const getLogs = (req, res) => {
  res.json({ success: true, logs: aiLogs });
};

const clearLogs = (req, res) => {
  aiLogs = [];
  res.json({ success: true, message: "Logs cleared" });
};

const externalLog = (req, res) => {
  const { agent, action, details } = req.body;
  const log = addLog(agent, action, details);
  res.json({ success: true, log });
};

module.exports = { addLog, getLogs, clearLogs, externalLog };
