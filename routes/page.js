const express = require('express')
const router = express.Router()
const pageController = require('../controllers/pageController')

router.post('/', pageController.addPageView)

router.get('/get', pageController.getPageViews)

router.post('/feedback', pageController.sendFeedback)

module.exports = router