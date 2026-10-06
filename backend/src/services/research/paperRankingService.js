/**
 * Scores and ranks papers based on query relevance, recency, and citation authority
 */
const rankPapers = (papers, query, targetMetrics = []) => {
  const queryTokens = new Set(
    query
      .toLowerCase()
      .split(/\W+/)
      .filter(w => w.length > 3)
  );

  const currentYear = new Date().getFullYear();

  const scoredPapers = papers.map(paper => {
    let score = 5.0; // Base score

    const combinedText = `${paper.title} ${paper.abstract || ''}`.toLowerCase();

    // 1. Token keyword match
    let matches = 0;
    queryTokens.forEach(token => {
      if (combinedText.includes(token)) matches++;
    });
    score += Math.min(matches * 0.8, 3.0);

    // 2. Citation velocity
    if (paper.citation_count) {
      if (paper.citation_count > 1000) score += 1.5;
      else if (paper.citation_count > 200) score += 1.0;
      else if (paper.citation_count > 50) score += 0.5;
    }

    // 3. Recency boost (last 3 years)
    if (paper.year) {
      const age = currentYear - paper.year;
      if (age <= 1) score += 0.8;
      else if (age <= 3) score += 0.4;
    }

    // 4. Metric alignment
    targetMetrics.forEach(metric => {
      if (combinedText.includes(metric.toLowerCase())) {
        score += 0.3;
      }
    });

    // Clamp score to 1.0 - 10.0
    const finalScore = parseFloat(Math.min(Math.max(score, 1.0), 10.0).toFixed(2));

    return {
      ...paper,
      score: finalScore
    };
  });

  // Sort descending by score
  return scoredPapers.sort((a, b) => b.score - a.score);
};

module.exports = {
  rankPapers
};
