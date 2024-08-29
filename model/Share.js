const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shareSchema = new Schema({
    content: String,
    postId: String
})

module.exports = mongoose.model('Share', shareSchema)