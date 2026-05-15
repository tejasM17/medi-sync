// backend/src/services/ai.service.js
const axios = require('axios');

class AIService {
  async analyzeSymptoms(body) {
    try {
      // Mock AI Analysis (Replace with real LLM call later)
      const symptoms = body.toLowerCase();

      let urgencyLevel = "Routine";
      let urgencyScore = 50;
      let isEmergency = false;

      if (symptoms.includes("severe headache") && symptoms.includes("blurred vision")) {
        urgencyLevel = "Emergency";
        urgencyScore = 92;
        isEmergency = true;
      } else if (symptoms.includes("fever") || symptoms.includes("pain")) {
        urgencyLevel = "Urgent";
        urgencyScore = 75;
      }

      return {
        urgencyLevel,
        urgencyScore,
        summary: `Patient reports: ${body.substring(0, 150)}...`,
        detailedReasoning: "Based on symptoms described, this case requires attention.",
        researchFindings: { source: "Mock Medical Guidelines" },
        recommendations: [
          "Consult doctor immediately",
          "Monitor symptoms",
          "Rest and hydrate"
        ],
        isEmergency
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      throw error;
    }
  }
}

module.exports = new AIService();
