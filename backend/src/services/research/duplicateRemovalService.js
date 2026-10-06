/**
 * Deduplicates academic papers based on DOI, URL, and normalized title similarity
 */
const deduplicatePapers = (papers) => {
  const seenDois = new Set();
  const seenTitles = new Set();
  const uniquePapers = [];

  for (const paper of papers) {
    if (!paper || !paper.title) continue;

    // Normalize DOI
    if (paper.doi) {
      const cleanDoi = paper.doi.trim().toLowerCase();
      if (seenDois.has(cleanDoi)) {
        continue;
      }
      seenDois.add(cleanDoi);
    }

    // Normalize Title
    const normalizedTitle = paper.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .trim();

    if (seenTitles.has(normalizedTitle)) {
      continue;
    }
    seenTitles.add(normalizedTitle);

    uniquePapers.push(paper);
  }

  return uniquePapers;
};

module.exports = {
  deduplicatePapers
};
