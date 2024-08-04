const Post = require('../model/Post')

const getPosts = async (req, res) => {
    const allPosts = await Post.find()
    if (!allPosts) return res.sendStatus(204) //'message': 'No posts found.'
    res.json(allPosts)
}

module.exports = { getPosts }