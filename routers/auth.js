const express = require("express")
const { register, login, forgotPassword, resetPassword, getUser, logout, imageUpload, editUser } = require("../controllers/auth")
const { getAccessToRoute } = require('../middlewares/authorization/auth')
const profileImageUpload = require('../middlewares/libraries/profileImageUpload')

const router = express.Router()

router.get('/', (req, res) => {
    res.send('Auth Home Page')
})
router.post('/register', register)
router.post('/login', login)
router.get('/profile', getAccessToRoute, getUser)
router.put('/edit', getAccessToRoute, editUser)
router.get('/logout', getAccessToRoute, logout)
router.get('/upload', [getAccessToRoute, profileImageUpload.single('profile_image')], imageUpload)
router.post('/forgot-password',forgotPassword)
router.put('/reset-password',resetPassword)
module.exports = router;
