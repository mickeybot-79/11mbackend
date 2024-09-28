const mongoose = require('mongoose')
const Schema = mongoose.Schema

const viewsSchema = new Schema({
    allViews: Number
})

module.exports = mongoose.model('View', viewsSchema)