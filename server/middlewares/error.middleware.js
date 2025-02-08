const errorMiddleware = (err, req, res, next) => { // Error-Handling Middleware Functions: These are special middleware functions that are defined with four arguments: err, req, res, and next. When next(err) is called, Express skips all remaining non-error-handling middleware and routes and jumps directly to the error-handling middleware.
    err.statusCode= err.statusCode || 500;
    err.message= err.message || "Something went wrong!";

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        stack: err.stack
    })
}

export default errorMiddleware;