class AppError extends Error {
    constructor(message, statusCode){
        // Call the parent class (Error) constructor with the message parameter
        super(message);   
        // Assign the statusCode parameter to the instance's statusCode property
        this.statusCode = statusCode;       
        // Capture the stack trace (line of code where the error was instantiated) and attach it to this instance
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
