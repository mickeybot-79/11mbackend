const Post = require('../model/Post')
const Tag = require('../model/Tags')
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
        authorName,
        authorId,
        tags,
        insPost
    } = req.body
    const duplicate = await Post.findOne({ title: title }).exec()
    if (duplicate) return res.status(400).json({ 'message': `La publicación "${title}" ya existe.` })
    const today = Date.now()
    const searchField = uuid()
    //const extension = thumbnail.split('/')[1].split(';')[0]
    //const fileExtension = extension === 'jpeg' ? 'jpg' : extension === 'png' ? 'png' : 'webp'
    const shareText = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="theme-color" content="#000000" /><meta name="og:type" content="object" /><meta name="og:url" content="https://oncemetros.onrender.com/post/${searchField}" /><meta name="og:title" content="${title}" /><meta name="og:description" content="${heading.split('\n')[0]}" /><meta name="og:image" content="${thumbnail.split('/')[2]}" /><meta http-equiv="refresh" content="1; https://oncemetros.onrender.com/post/${searchField}" /></head><body></body></html>`
    try {
        const result = await Post.create({
            title,
            content,
            heading,
            //thumbnail: `../Images/${searchField}.${fileExtension}`,
            thumbnail,
            imgDesc,
            imgCred,
            authorName,
            authorId,
            date: today,
            comments: [],
            tags,
            searchField,
            insPost,
            share: shareText,
            views: 0
        })
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
        replies: [],
        searchField
    })
    const result = await currentPost.save()
    res.status(200).json(result)
}

const addReply = async (req, res) => {
    const {
        post,
        comment,
        user,
        content,
        replyTo
    } = req.body
    const currentPost = await Post.findOne({ searchField: post }).exec()
    const currentComment = currentPost.comments.filter(comm => comm.searchField === comment)[0]
    const commentIndex = currentPost.comments.indexOf(currentComment)
    currentPost.comments[commentIndex].replies.push({
        user,
        date: Date.now(),
        content,
        replyTo
    })
    const result = await currentPost.save()
    res.status(200).json(result)
}

const addTag = async (req, res) => {
    const { tag } = req.body
    const allTags = await Tag.findOne({ _id: '66c8f92830fcefbdcbea7e13'}).exec()
    if (!allTags.allTags.includes(tag)) {
        allTags.allTags.push(tag)
        try {
            const result = await allTags.save()
            res.status(200).json(result)
        } catch (err) {
            res.status(500).json({ 'message': err.message })
        }
    } else {
        res.status(201).json({ 'message': 'La etiqueta ya existe' })
    }
}

const getTags = async (req, res) => {
    const allTags = await Tag.find()
    if (!allTags) return res.sendStatus(204) //'message': 'No posts found.'
    res.json(allTags)
}

module.exports = { getPosts, createPost, addComment, addReply, addTag, getTags }