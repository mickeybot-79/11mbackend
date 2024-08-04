const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    user: String,
    date: String,
    content: String,
    likes: String
})

const postSchema = new Schema({
    title: String,
    content: String,
    summary: String,
    thumbnail: String,
    imgDesc: String,
    imgCredits: String,
    author: String,
    date: String,
    comments: [commentSchema],
    tags: Array,
})

module.exports = mongoose.model('Post', postSchema)