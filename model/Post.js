const mongoose = require('mongoose')
const Schema = mongoose.Schema

const replySchema = new Schema({
    userId: String,
    username: String,
    image: String,
    date: String,
    content: String,
    replyTo: String
})

const commentSchema = new Schema({
    userId: String,
    username: String,
    image: String,
    date: String,
    content: String,
    replies: [replySchema],
    searchField: String,
})

const postSchema = new Schema({
    title: String,
    content: String,
    heading: String,
    thumbnail: String,
    imgDesc: String,
    imgCred: String,
    authorName: String,
    authorId: String,
    date: String,
    comments: [commentSchema],
    tags: Array,
    searchField: String,
    views: Number,
    insPost: String,
    share: String,
    viewedBy: []
})

module.exports = mongoose.model('Post', postSchema)