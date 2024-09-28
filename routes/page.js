const express = require('express')
const router = express.Router()
const pageController = require('../controllers/pageController')

router.post('/', pageController.addPageView)

router.get('/get', pageController.getPageViews)

module.exports = router