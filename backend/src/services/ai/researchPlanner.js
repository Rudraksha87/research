const { generateGeminiContent, parseJsonSafely } = require('./geminiService');

/**
 * Plans a research investigation based on query and domain
 * Follows ResearchLens Section 6 specifications
 */
const createResearchPlan = async (title, query, domain = 'Agriculture & Computer Science') => {
  const prompt = `You are a Principal Scientific Investigator and Academic Research Architect.
Your task is to formulate a structured research and search strategy for this research question:
"${query || title}"

Domain: "${domain}"

Return a valid JSON object ONLY with the following exact keys:
{
  "primaryTopic": "Concise primary topic title",
  "importantConcepts": [
    "Key concept 1",
    "Key concept 2",
    "Key concept 3"
  ],
  "relatedKeywords": [
    "keyword 1",
    "keyword 2",
    "keyword 3",
    "keyword 4"
  ],
  "searchTerms": [
    "term 1 (e.g. crop disease detection AI)",
    "term 2 (e.g. deep learning plant disease detection)",
    "term 3 (e.g. computer vision crop disease)",
    "term 4 (e.g. vision transformers plant disease)",
    "term 5 (e.g. multimodal agriculture AI)"
  ],
  "possibleSubtopics": [
    "Subtopic 1 (e.g. Real-world generalization & wild illumination)",
    "Subtopic 2 (e.g. Early asymptomatic disease detection)",
    "Subtopic 3 (e.g. Edge device and mobile deployment)"
  ],
  "relevantResearchAreas": [
    "Computer Vision & Deep Learning",
    "Precision Agriculture & Plant Pathology",
    "Edge AI & IoT Sensors"
  ],
  "informationToExtract": [
    "Research problem and objective",
    "Deep learning architectures and algorithms",
    "Training and validation datasets",
    "Empirical accuracy and latency metrics",
    "Critical limitations and failure modes",
    "Practical research gaps"
  ],
  "hypothesis": "Testable academic hypothesis concerning the current state and limitations of the field"
}

Do not include any commentary outside the JSON block.`;

  const rawOutput = await generateGeminiContent(prompt, { temperature: 0.2 });
  const parsed = parseJsonSafely(rawOutput);

  if (parsed && Array.isArray(parsed.searchTerms) && parsed.searchTerms.length > 0) {
    // Ensure searchQueries alias is present for downstream services
    parsed.searchQueries = parsed.searchTerms;
    return parsed;
  }

  // Robust domain-aware fallback
  const isAgri = (query || title).toLowerCase().includes('crop') || (query || title).toLowerCase().includes('plant') || (query || title).toLowerCase().includes('disease');

  if (isAgri) {
    return {
      primaryTopic: 'Artificial Intelligence for Crop & Plant Disease Detection',
      importantConcepts: [
        'Convolutional Neural Networks (CNNs)',
        'Vision Transformers (ViTs)',
        'PlantVillage Benchmark vs In-the-Wild Datasets',
        'Foliar Pathogen Classification',
        'Mobile & Edge Diagnostics'
      ],
      relatedKeywords: [
        'plant pathology AI',
        'foliar disease recognition',
        'agricultural computer vision',
        'hyper-spectral crop imaging',
        'edge inference farming'
      ],
      searchTerms: [
        'crop disease detection AI',
        'deep learning plant disease detection',
        'computer vision crop disease',
        'vision transformers plant disease',
        'multimodal agriculture AI'
      ],
      searchQueries: [
        'crop disease detection AI',
        'deep learning plant disease detection',
        'computer vision crop disease',
        'vision transformers plant disease',
        'multimodal agriculture AI'
      ],
      possibleSubtopics: [
        'Overfitting to controlled lab environments',
        'Early-stage asymptomatic disease diagnosis',
        'Multi-disease co-infection recognition',
        'Lightweight neural networks for low-cost mobile phones'
      ],
      relevantResearchAreas: [
        'Precision Agriculture',
        'Deep Learning & Computer Vision',
        'Plant Pathology & Agronomy',
        'Edge Computing in Agriculture'
      ],
      informationToExtract: [
        'Research Problem',
        'Methodology & Architecture',
        'Dataset & Acquisition Setting',
        'Quantitative Results',
        'Real-world Field Limitations',
        'Future Research Directions'
      ],
      hypothesis: 'While contemporary deep learning models achieve >98% accuracy on benchmark datasets, their diagnostic efficacy degrades significantly under uncontrolled outdoor lighting, unseen soil backgrounds, and complex multi-pathogen infestations.'
    };
  }

  return {
    primaryTopic: title || query,
    importantConcepts: ['Machine Learning', 'Empirical Benchmarking', 'Algorithmic Optimization'],
    relatedKeywords: ['deep learning', 'state of the art', 'performance evaluation'],
    searchTerms: [
      `${query.slice(0, 40)} deep learning`,
      `${query.slice(0, 40)} benchmark evaluation`,
      `${query.slice(0, 40)} survey review`
    ],
    searchQueries: [
      `${query.slice(0, 40)} deep learning`,
      `${query.slice(0, 40)} benchmark evaluation`,
      `${query.slice(0, 40)} survey review`
    ],
    possibleSubtopics: ['Algorithmic efficiency', 'Dataset diversity', 'Real-world deployment'],
    relevantResearchAreas: [domain, 'Computer Science', 'Artificial Intelligence'],
    informationToExtract: ['Methodology', 'Dataset', 'Results', 'Limitations', 'Future Work'],
    hypothesis: `Investigating ${title || query} reveals critical engineering tradeoffs and methodological gaps between laboratory validation and real-world deployment.`
  };
};

module.exports = {
  createResearchPlan
};
