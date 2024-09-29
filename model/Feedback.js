const mongoose = require('mongoose')
const Schema = mongoose.Schema

const feedbackSchema = new Schema({
    userId: String,
    type: String,
    content: String,
    date: Number
})

module.exports = mongoose.model('Feedback', feedbackSchema)