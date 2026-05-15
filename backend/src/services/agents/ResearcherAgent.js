// backend/src/services/agents/ResearcherAgent.js
const axios = require('axios');

class ResearcherAgent {
  async research(symptoms) {
    console.log("🔍 [ResearcherAgent] Searching medical guidelines...");

    // Mock web search (replace with real Tavily/SerpAPI later)
    const research = {
      findings: "Severe headache + blurred vision may indicate migraine, glaucoma, or neurological emergency (e.g., stroke, intracranial pressure).",
      redFlags: ["Sudden onset", "With vision changes", "Persistent >24hrs"],
      source: "Mock - Mayo Clinic / NEJM Guidelines"
    };

    return {
      research,
      thinking: `Researched symptoms: ${symptoms.join(', ')}. Found critical red flags.`
    };
  }
}

module.exports = new ResearcherAgent();
