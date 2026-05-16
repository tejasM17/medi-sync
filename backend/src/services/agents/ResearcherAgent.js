// backend/src/services/agents/ResearcherAgent.js
class ResearcherAgent {
  async research(symptoms, patientEmail, rawBody) {
    console.log(`🔍 [ResearcherAgent] Generating intelligent medical insights...`);

    // Simulate deep reasoning + rich content generation
    const symptomText = symptoms.length > 0 
      ? symptoms.join(", ") 
      : "headache and blurred vision";

    const mockLLMResponse = `
Patient presents with ${symptomText}. 

Key Clinical Considerations:
• Sudden or severe headache combined with blurred vision is a red flag symptom that may indicate:
  - Migraine with aura
  - Acute angle-closure glaucoma
  - Hypertensive emergency
  - Intracranial pathology (raised ICP, stroke, or space-occupying lesion)

Recommended Actions:
1. Urgent in-person evaluation recommended within 4-6 hours.
2. Blood pressure measurement and neurological examination needed.
3. Fundoscopy (eye examination) should be performed.
4. Avoid driving or operating machinery until cleared.
`;

    return {
      research: {
        findings: mockLLMResponse.trim(),
        confidence: "High",
        possibleConditions: ["Migraine", "Glaucoma", "Neurological Emergency", "Hypertensive Crisis"],
        redFlags: ["Blurred vision", "Severe headache", "Sudden onset"]
      },
      thinking: `Analyzed symptoms: ${symptomText}. Generated structured clinical insights based on standard medical protocols.`,
      rawQuery: rawBody
    };
  }
}

module.exports = new ResearcherAgent();
