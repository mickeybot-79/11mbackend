const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    image: String,
    aboutme: String,
    refreshToken: String,
    createdOn: String,
    userId: String,
    roles: [],
    posts: []
})

module.exports = mongoose.model('User', userSchema)