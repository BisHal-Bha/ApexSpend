exports.errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  let statusCode = err.statusCode || 500;
  let message = process.env.NODE_ENV === 'production'
    ? 'Internal Server Error'
    : err.message || 'Internal Server Error';

  // Handle MongoDB Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    message = 'A record with this information already exists';
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  // Handle Mongoose Cast Error (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found';
  }

  res.status(statusCode).json({ message });
};