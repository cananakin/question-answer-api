const CustomError = require('../../helpers/error/CustomError')
const customErrorHandler = (err, req, res, next) => {
    
    let customError = err;

    if(err.name === 'SyntaxError') {
        customError = new CustomError('Unexpected Syntax', 400)
    }
    if(err.name === 'ValidationError') {
        customError = new CustomError(err.message, 400)
    }
    if(err.name === 'CastError') {
        customError = new CustomError('Please provide a valid id', 400)
    }
    if(err.code === 11000) {
        // duplicate key
        customError = new CustomError('Duplicate Key Found : Check Your Input', 400)
    }
    console.log(err);
    
    res.status(customError.status || 500)
        .json({
            message: customError.message,
            success: false
        })
}

module.exports = customErrorHandler;