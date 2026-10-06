const { z } = require('zod');

const createResearchSchema = z.object({
  query: z.string().min(5, 'Research question must be at least 5 characters long'),
  title: z.string().optional(),
  domain: z.string().optional().default('Agricultural & Computer Science'),
  paperCount: z.union([z.number(), z.string()]).transform(val => Number(val)).pipe(
    z.number().min(3).max(30).default(10)
  ).optional().default(10),
  depth: z.enum(['Quick', 'Standard', 'Deep']).optional().default('Standard'),
  includeSearch: z.boolean().optional().default(true)
});

const addPaperSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  title: z.string().min(1, 'Paper title is required'),
  authors: z.array(z.string()).optional().default([]),
  abstract: z.string().optional().default(''),
  year: z.number().int().optional().default(() => new Date().getFullYear()),
  journalOrVenue: z.string().optional().default(''),
  doi: z.string().optional().default(''),
  url: z.string().optional().default(''),
  citationCount: z.number().int().nonnegative().optional().default(0),
  source: z.string().optional().default('Manual')
});

module.exports = {
  createResearchSchema,
  addPaperSchema
};
