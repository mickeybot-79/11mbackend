const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    usrnme: String,
    password: String,
    image: String,
    aboutme: String,
    refreshToken: String,
    createdOn: String
})

module.exports = mongoose.model('User', userSchema)