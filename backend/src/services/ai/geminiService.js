const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../../config/env');
const { logInfo, logWarn, logError } = require('../../utils/logger');

let genAI = null;

if (env.GEMINI_API_KEY && !env.GEMINI_API_KEY.includes('your-google-gemini')) {
  try {
    genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    logInfo('Gemini AI client configured successfully.');
  } catch (error) {
    logWarn('Failed to initialize Gemini AI client:', error.message);
  }
} else {
  logInfo('Gemini API key not configured or set to default. Running with built-in heuristic synthesis engines.');
}

/**
 * Generate text or structured JSON using Gemini
 * @param {string} prompt
 * @param {object} options
 */
const generateGeminiContent = async (prompt, options = {}) => {
  const modelName = options.model || 'gemini-1.5-flash';
  const temperature = options.temperature ?? 0.3;

  if (!genAI) {
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature,
        maxOutputTokens: options.maxOutputTokens || 4096,
        ...(options.responseMimeType ? { responseMimeType: options.responseMimeType } : {})
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    logError('Gemini generation error:', error.message);
    return null;
  }
};

/**
 * Clean and parse JSON from LLM output
 */
const parseJsonSafely = (text, fallback = null) => {
  if (!text) return fallback;
  try {
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/```\s*$/i, '');
    }
    return JSON.parse(clean);
  } catch (err) {
    logWarn('JSON parse failed for LLM output, extracting brackets regex fallback.');
    try {
      const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch (nestedErr) {
      logError('Regex fallback also failed:', nestedErr.message);
    }
    return fallback;
  }
};

module.exports = {
  generateGeminiContent,
  parseJsonSafely
};
