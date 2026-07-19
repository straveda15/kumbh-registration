import { ApiError } from '../utils/ApiError.js';

/**
 * Validates req.body / req.query / req.params against Zod schemas and
 * replaces them with the parsed (typed, defaulted) values.
 */
export const validate = (schemas) => (req, _res, next) => {
  const targets = ['body', 'query', 'params'];

  for (const target of targets) {
    const schema = schemas[target];
    if (!schema) continue;

    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      throw ApiError.badRequest('Validation failed', errors);
    }

    req[target] = result.data;
  }

  next();
};

export default validate;
