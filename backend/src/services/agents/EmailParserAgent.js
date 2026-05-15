// backend/src/services/agents/EmailParserAgent.js
class EmailParserAgent {
  async parse(emailBody) {
    console.log("📧 [EmailParserAgent] Analyzing patient email...");
    
    const symptoms = emailBody.toLowerCase().match(/\b(headache|blurred vision|fever|pain|nausea|dizziness)\b/g) || [];
    
    return {
      rawSymptoms: symptoms,
      extractedInfo: {
        urgencyHints: symptoms.length > 0 ? "High" : "Low",
        keySymptoms: symptoms
      },
      thinking: "Extracted key symptoms from unstructured email text."
    };
  }
}

module.exports = new EmailParserAgent();
