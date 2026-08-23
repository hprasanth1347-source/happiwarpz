/**
 * Format standard success response for API endpoints.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {object|array|null} data
 * @param {number} statusCode
 */
export const sendSuccess = (res, message = "Success", data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Format standard error response for API endpoints.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {string} error
 * @param {number} statusCode
 */
export const sendError = (res, message = "Internal Server Error", error = "SERVER_ERROR", statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};
