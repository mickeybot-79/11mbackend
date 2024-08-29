const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shareSchema = new Schema({
    postId: String,
    content: String
})

module.exports = mongoose.model('Share', shareSchema)