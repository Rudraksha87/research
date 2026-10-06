const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 100 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters long').optional(),
  organization: z.string().optional().nullable()
}).refine(data => data.name || data.fullName, {
  message: 'Name or full name is required',
  path: ['fullName']
});

const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required')
});

module.exports = {
  registerSchema,
  loginSchema
};
