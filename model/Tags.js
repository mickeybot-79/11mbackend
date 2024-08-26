const mongoose = require('mongoose')
const Schema = mongoose.Schema

// const tagsSchema = new Schema({
//     displayName: String,
//     searchTerm: String
// })

const tagsSchema = new Schema({
    allTags: []
})

module.exports = mongoose.model('Tag', tagsSchema)