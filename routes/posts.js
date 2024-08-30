const express = require('express')
const router = express.Router()
const postsController = require('../controllers/postsController')
const shareController = require('../controllers/shareController')

router.get('/', postsController.getPosts)

router.post('/new', postsController.createPost)

router.put('/comment', postsController.addComment)

router.put('/comment/reply', postsController.addReply)

router.post('/tags/new', postsController.addTag)

router.get('/tags', postsController.getTags)

router.post('/share', shareController.shareTest)

router.get('/share', postsController.sendShareContent)

module.exports = router