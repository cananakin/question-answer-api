const User = require('../models/User')
const asynErrorWrapper = require('express-async-handler')
const CustomError = require('../helpers/error/CustomError')

const getSingleUser = asynErrorWrapper(async (req, res, next) => {
    
    res.status(200)
        .json({
            success: true,
            user: req.user
        })
});

const getAllUsers = asynErrorWrapper((req, res, next) => {
    
    return res.status(200)
        .json(res.queryResults)
});

module.exports = { getSingleUser, getAllUsers }
