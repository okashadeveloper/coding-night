const axios = require('axios');

// Graceful fallback for failed AI triage
const getFallbackTriage = (complaint) => {
  return {
    title: complaint.substring(0, 50) + (complaint.length > 50 ? '...' : ''),
    category: 'General',
    priority: 'Medium',
    possibleCauses: [],
    initialChecks: ['A qualified technician will inspect this issue'],
    recurringWarning: null,
    aiGenerated: false,
    error: 'AI service unavailable - manual review recommended'
  };
};

// AI Triage using OpenAI
const triageIssue = async (req, res) => {
  try {
    const { assetCategory, assetLocation, assetCondition, complaint } = req.body;

    // Validate inputs
    if (!complaint || complaint.trim().length === 0) {
      return res.status(400).json({
        message: 'Complaint text is required'
      });
    }

    // Check if API key exists
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn('GROQ_API_KEY not configured - using fallback');
      return res.json(getFallbackTriage(complaint));
    }

    // Build the prompt
    const systemPrompt = `You are a maintenance triage assistant. Given asset information and a complaint, return ONLY valid JSON (no markdown, no code blocks, just raw JSON).
    
Return exactly this JSON structure (no extra text):
{
  "title": "professional short title (max 50 chars)",
  "category": "category name",
  "priority": "Low/Medium/High/Critical",
  "possibleCauses": ["cause 1", "cause 2"],
  "initialChecks": ["safe check 1", "safe check 2"],
  "recurringWarning": "string or null"
}

IMPORTANT: Only suggest safe, non-technical checks. For anything involving electrical, mechanical, chemical, or fire hazards, recommend calling a qualified technician.`;

    const userPrompt = `Asset Category: ${assetCategory || 'Unknown'}
Asset Location: ${assetLocation || 'Unknown'}
Asset Condition: ${assetCondition || 'Unknown'}
Complaint: ${complaint}

Analyze this issue and provide triage JSON.`;

    // Call Groq API (OpenAI-compatible endpoint)
    let triageData;
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      // Extract AI response
      const aiMessage = response.data.choices[0]?.message?.content;
      if (!aiMessage) {
        console.warn('Empty AI response');
        return res.json(getFallbackTriage(complaint));
      }

      // Try to parse JSON from AI response
      let parsedData = JSON.parse(aiMessage);

      // Validate and sanitize response
      triageData = {
        title: (parsedData.title || complaint.substring(0, 50)).substring(0, 100),
        category: parsedData.category || 'General',
        priority: ['Low', 'Medium', 'High', 'Critical'].includes(parsedData.priority) ? parsedData.priority : 'Medium',
        possibleCauses: Array.isArray(parsedData.possibleCauses) ? parsedData.possibleCauses.slice(0, 4) : [],
        initialChecks: Array.isArray(parsedData.initialChecks) ? parsedData.initialChecks.slice(0, 4) : ['A technician will inspect this issue'],
        recurringWarning: parsedData.recurringWarning || null,
        aiGenerated: true
      };
    } catch (aiError) {
      // AI API error or parse error
      console.error('AI triage error:', aiError.message);
      return res.json(getFallbackTriage(complaint));
    }

    res.json(triageData);
  } catch (err) {
    console.error('Triage endpoint error:', err);
    // Return fallback for any unhandled error
    res.json({
      title: 'Issue Review Required',
      category: 'General',
      priority: 'Medium',
      possibleCauses: [],
      initialChecks: ['A qualified technician will inspect this issue'],
      recurringWarning: null,
      aiGenerated: false,
      error: 'Service error - please provide manual details'
    });
  }
};

module.exports = {
  triageIssue
};
