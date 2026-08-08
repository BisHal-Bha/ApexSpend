exports.errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  const statusCode = err.statusCode || 500;

  // Handle PostgreSQL specific errors
  if (err.code === '23505') {
    return res.status(409).json({
      error: {
        message: 'A record with this information already exists',
        status: 409,
      },
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      error: {
        message: 'Referenced record does not exist',
        status: 400,
      },
    });
  }

  if (err.code === '22P02') {
    return res.status(400).json({
      error: {
        message: 'Invalid input format',
        status: 400,
      },
    });
  }

  res.status(statusCode).json({
    error: {
      message: process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message || 'Internal Server Error',
      status: statusCode,
    },
  });
};