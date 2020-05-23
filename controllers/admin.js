const User = require('../models/User')
const asynErrorWrapper = require('express-async-handler')
const CustomError = require('../helpers/error/CustomError')

const blockUser = asynErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);
    user.blocked = !user.blocked;

    await user.save();

    return res.status(200).json({
        success: true,
        message: 'User Block has been changed'
    })
})
const deleteUser = asynErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);
   
    await user.remove();

    return res.status(200).json({
        success: true,
        message: 'User has been deleted'
    })
})

module.exports = { blockUser, deleteUser }
