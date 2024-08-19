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
    const extension = thumbnail.split('/')[1].split(';')[0]
    const fileExtension = extension === 'jpeg' ? 'jpg' : extension === 'png' ? 'png' : 'webp'
    try {
        const result = await Post.create({
            title,
            content,
            heading,
            thumbnail: `../Images/${searchField}.${fileExtension}`,
            imgDesc,
            imgCred,
            author,
            date: today,
            comments: [],
            tags,
            searchField,
            views: 0
        })
        //res.status(201).json({'message': `Publicación ${result.title} creada con éxito.`})
        res.status(201).json(result)
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
}

const addComment = async (req, res) => {
    const {
        post,
        user,
        content,
    } = req.body
    const currentPost = await Post.findOne({ searchField: post }).exec()
    const searchField = uuid()
    currentPost.comments.push({
        user,
        date: Date.now(),
        content,
        likes: 0,
        replies: [],
        searchField
    })
    const result = await currentPost.save()
    res.status(200).json(result)
}

const likeComment = async (req, res) => {
    const {
        post,
        comment
    } = req.body
    const currentPost = await Post.findOne({ searchField: post }).exec()
    const foundComment = currentPost.comments.filter(com => com.searchField === comment)[0]
    const commentIndex = currentPost.comments.indexOf(foundComment)
    foundComment.likes = foundComment.likes + 1
    currentPost.comments.splice(commentIndex, 1, foundComment)
    const result = await currentPost.save()
    res.status(200).json(result)
}

module.exports = { getPosts, createPost, addComment, likeComment }