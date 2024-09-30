const express = require('express')
const router = express.Router()
const pageController = require('../controllers/pageController')

router.post('/view', pageController.addPageView)

router.get('/view/get', pageController.getPageViews)

router.post('/feedback', pageController.sendFeedback)

router.get('/feedback/get', pageController.getFeedback)

module.exports = router