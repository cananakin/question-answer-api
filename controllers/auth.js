const User = require('../models/User')
const asynErrorWrapper = require('express-async-handler')
const { sendJwtToClient } = require('../helpers/authorization/tokenHelpers')
const { validationUserInput, compareassword } = require('../helpers/input/inputHelpers')
const CustomError = require('../helpers/error/CustomError')
const sendEmail = require('../helpers/libraries/sendEmail')

const register = asynErrorWrapper(async (req, res, next) => {
    const userData = req.body;

    const user = await User.create({
        ...userData
    })
    
    sendJwtToClient(user, res);

})
const login = asynErrorWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if(!validationUserInput(email, password)){
        return next(new CustomError('Please check your inputs', 400))
    }

    // check user
    const user = await User.findOne({email}).select("+password")
    
    if(!compareassword(password, user.password)){
        return next(new CustomError('Please check your password', 400)) 
    }
    
    sendJwtToClient(user, res);
   
})

const getUser = (req, res, next) => {
    res.status(200)
        .json({
            success: true,
            data: {
                id: req.user.id,
                name: req.user.name
            }
        })
}
const editUser = asynErrorWrapper(async (req, res, next) => {
    const { id } = req.user;
    const editInformation = req.body;
    const user = await User.findByIdAndUpdate(id, editInformation,{
        new: true,
        runValidators: true
    })
    res.status(200)
        .json({
            success: true,
            message: 'User information has been updated',
            data: user
        })    
})

const logout = asynErrorWrapper(async (req, res, next) => {
    const { JWT_COOKIE_EXPIRE, NODE_ENV } = process.env
    return res.status(200)
        .cookie({
            httpOnly: true,
            expires: new Date(Date.now()),
            secure: NODE_ENV === 'development' ? false : true
        })
        .json({
            success: true,
            message: 'Logout Successful'
        })
})

const imageUpload = asynErrorWrapper(async (req, res, next) => {
    
    const user = await User.findByIdAndUpdate(req.user.id, {
        "profile_image": req.savedProfileImage
    }, {
        new: true,
        runValidators: true
    })
    // Image Upload Success
    res.status(200)
        .json({
            success: true,
            message: 'Image Upload Successful',
            data: user
        })
})

const forgotPassword = asynErrorWrapper(async (req, res, next) => {
    const resetEmail = req.body.email;

    const user = await User.findOne({email: resetEmail});

    if(!user){
        return next(new CustomError('There is no user with that email',400))
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    await user.save()

    const resetPasswordUrl = `http://localhost:5000/api/auth/reset-password?resetPasswordToken=${resetPasswordToken}`
    
    const emailTemplate = `
        <h3>Reset Your Password</h3>
        <p>This <a href="${resetPasswordUrl}" target="_blank">link</a> will expire in 1 hour<p/>
    `;
    
    try {
        await sendEmail({
            from: process.env.SMTP_USER,
            to: resetEmail,
            subject: "Reset Your Password",
            html: emailTemplate
        })

        return res.status(200).json({
            success: true,
            message: "Token Sent To Your Email"
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return next(new CustomError('Email Could Not Be Sent', 500))
    }    
})

const resetPassword = asynErrorWrapper(async (req, res, next) => {
    
    const { resetPasswordToken } = req.query;
    const { password } = req.body;

    if(!resetPasswordToken) {
        return next( new CustomError('Please provide a valid token',400) )
    }

    let user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if(!user) {
        return next( new CustomError('Invalid Token or Session Expired',400) )
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save(); 
    
    return res.status(200)
        .json({
            success: true,
            message: 'Reset Password Process Successful'
        })
})
// const tokentest = (req, res, next) => {
//     res.status(200)
//         .json({
//             success: true,
            
//         })
// }

module.exports = { register, login, forgotPassword, getUser, logout, imageUpload, resetPassword, editUser  }