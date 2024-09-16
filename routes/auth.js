const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/register', authController.handleNewUser)

router.post('/', authController.handleLogin)

router.get('/refresh', authController.handleRefreshToken)

router.post('/logout', authController.handleLogout)

router.get('/user/:id', authController.getUserData)

router.get('/profile/:id', authController.getUserProfile)

router.put('/update', authController.updateUserData)

router.delete('/delete', authController.deleteUser)

module.exports = router