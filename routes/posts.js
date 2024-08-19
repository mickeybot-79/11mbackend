const express = require('express')
const router = express.Router()
const postsController = require('../controllers/postsController')

router.get('/', postsController.getPosts)

router.post('/new', postsController.createPost)

router.put('/comment', postsController.addComment)

router.put('/comment/like', postsController.likeComment)

module.exports = router