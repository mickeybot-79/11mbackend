const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: String,
    password: String,
    image: String,
    aboutme: String,
    refreshToken: String,
    createdOn: String,
    userId: String,
    roles: []
})

module.exports = mongoose.model('User', userSchema)