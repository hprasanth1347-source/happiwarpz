import { sendError } from "../utils/response.js";

/**
 * Express Middleware for validating requests with Zod schemas.
 * 
 * Supports:
 * - validateBody(schema)
 * - validateQuery(schema)
 * - validateParams(schema)
 * - validate(schemas) where schemas is { body?: schema, query?: schema, params?: schema }
 */
export const validate = ({ body, query, params } = {}) => {
  return (req, res, next) => {
    try {
      if (body) {
        req.body = body.parse(req.body);
      }
      if (query) {
        req.query = query.parse(req.query);
      }
      if (params) {
        req.params = params.parse(req.params);
      }
      next();
    } catch (error) {
      if (error.name === "ZodError") {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        const primaryMessage = error.errors[0]?.message || "Invalid input data provided.";
        return res.status(400).json({
          success: false,
          error: "VALIDATION_ERROR",
          message: primaryMessage,
          errors: formattedErrors,
        });
      }
      next(error);
    }
  };
};

export const validateBody = (schema) => validate({ body: schema });
export const validateQuery = (schema) => validate({ query: schema });
export const validateParams = (schema) => validate({ params: schema });
