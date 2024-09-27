const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/register', authController.handleNewUser)

router.post('/', authController.handleLogin)

router.get('/refresh', authController.handleRefreshToken)

router.post('/logout', authController.handleLogout)

router.get('/user/:userId', authController.getUserData)

router.get('/profile/:userId', authController.getUserProfile)

router.put('/update', authController.updateUserData)

router.delete('/delete', authController.deleteUser)

router.post('/pass', authController.resetPassword)

router.post('/reset', authController.updateUserPassword)

router.post('/verify', authController.verifyResetToken)

module.exports = router