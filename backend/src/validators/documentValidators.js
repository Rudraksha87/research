const Joi = require('joi');

const uploadDocumentSchema = Joi.object({
  projectId: Joi.string().allow('', null).optional()
});

module.exports = {
  uploadDocumentSchema
};
