const express = require('express')
const router = express.Router()
const postsController = require('../controllers/postsController')

router.get('/', postsController.getPosts)

router.post('/new', postsController.createPost)

module.exports = router