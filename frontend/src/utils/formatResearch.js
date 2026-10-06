/**
 * Truncates text cleanly with ellipsis
 */
export const truncateText = (text, maxLength = 160) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Returns color classes based on impact level
 */
export const getImpactColor = (impact) => {
  switch ((impact || '').toLowerCase()) {
    case 'high':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case 'medium':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'low':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    default:
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  }
};

/**
 * Returns color classes based on project status
 */
export const getStatusBadge = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'completed':
      return {
        label: 'Synthesized',
        className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      };
    case 'running':
      return {
        label: 'Pipeline Running',
        className: 'bg-blue-500/10 text-blue-400 border-blue-500/30 animate-pulse'
      };
    case 'failed':
      return {
        label: 'Failed',
        className: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
      };
    default:
      return {
        label: 'Draft',
        className: 'bg-slate-500/10 text-slate-400 border-slate-500/30'
      };
  }
};

/**
 * Formats author lists
 */
export const formatAuthors = (authors) => {
  if (!authors || !Array.isArray(authors) || authors.length === 0) return 'Unknown Authors';
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
  return `${authors[0]} et al.`;
};
