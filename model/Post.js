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
    heading: String,
    thumbnail: String,
    imgDesc: String,
    imgCred: String,
    author: String,
    date: String,
    comments: [commentSchema],
    tags: Array,
    searchField: String
})

module.exports = mongoose.model('Post', postSchema)