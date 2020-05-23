const CustomError = require('../../helpers/error/CustomError')
const asyncErrorWrapper = require('express-async-handler')
const jwt = require('jsonwebtoken')
const { isTokenIncluded, getAccessTokenFromHeader } = require('../../helpers/authorization/tokenHelpers')
const User = require('../../models/User')

const getAccessToRoute = (req,res,next) => {
    const { JWT_SECRET_KEY } = process.env;
    if(!isTokenIncluded(req)){
        // 401 unauthorization
        // 403 forbidden
        return next(
            new CustomError('You are not authorized to access the route', 401)
        )
    }
    const accessToken = getAccessTokenFromHeader(req);
    jwt.verify(accessToken,JWT_SECRET_KEY, (err, decoded) => {

        if(err){
            return next(
                new CustomError('You are not authorized to access the route', 401)
            ) 
        }
        req.user = {
            id: decoded.id,
            name: decoded.name
        }
        next()
    })
    
}

const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.user;
    
    const user = await User.findById(id);

    if(!user) {
        return next( new CustomError('There is no user', 400))
    }
    
    if(user.role !== 'admin') {
        return next(new CustomError(`You don't have a access permission`,403))
    }

    next()
})

const getQuestionOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.user;
    const user_id = req.question.user;
    if(user_id.toString() !== id.toString()) {
        return next( new CustomError(`You don't have a access permission`, 403))
    }
    next()
})

const getAnswerOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.user;
    const user_id = req.answer.user;
    if(user_id != id) {
        return next( new CustomError(`You don't have a access permission`, 403))
    }
    next()
})

module.exports = { getAccessToRoute, getAdminAccess, getQuestionOwnerAccess, getAnswerOwnerAccess }