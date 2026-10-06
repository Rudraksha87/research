/**
 * Zod validation middleware for Express
 * Validates req.body, req.query, or req.params and formats clean error messages
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    if (!schema) return next();

    // Support Zod schemas
    if (typeof schema.safeParse === 'function') {
      const result = schema.safeParse(req[property]);
      if (!result.success) {
        const errorDetails = result.error.errors
          .map(err => `${err.path.join('.') || property}: ${err.message}`)
          .join('; ');

        return res.status(400).json({
          success: false,
          message: `Validation error: ${errorDetails}`,
          errors: result.error.errors
        });
      }
      req[property] = result.data;
      return next();
    }

    // Support legacy Joi schemas if present
    if (typeof schema.validate === 'function') {
      const { error, value } = schema.validate(req[property], {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errorDetails = error.details.map(d => d.message).join(', ');
        return res.status(400).json({
          success: false,
          message: `Validation error: ${errorDetails}`
        });
      }
      req[property] = value;
      return next();
    }

    next();
  };
};

module.exports = {
  validate
};
