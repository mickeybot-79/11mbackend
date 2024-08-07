const Post = require('../model/Post')
const {v4 : uuid} = require('uuid')

const getPosts = async (req, res) => {
    const allPosts = await Post.find()
    if (!allPosts) return res.sendStatus(204) //'message': 'No posts found.'
    res.json(allPosts)
}

const createPost = async (req, res) => {
    const { 
        title,
        content,
        heading,
        thumbnail,
        imgDesc,
        imgCred,
        author,
        tags
    } = req.body
    const duplicate = await Post.findOne({ title: title }).exec()
    if (duplicate) return res.status(400).json({ 'message': `La publicación ${title} ya existe.` })
    const today = Date.now()
    const searchField = uuid()
    try {
        const result = await Post.create({
            title,
            content,
            heading,
            thumbnail,
            imgDesc,
            imgCred,
            author,
            date: today,
            comments: [],
            tags,
            searchField
        })
        res.status(201).json({'message': `Publicación ${result.title} creada con éxito.`})
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
}

module.exports = { getPosts, createPost }