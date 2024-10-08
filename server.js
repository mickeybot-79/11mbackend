require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const PORT = process.env.PORT || 3500

const Post = require('./model/Post')
const jwt = require('jsonwebtoken')

connectDB()

app.use('/share/:post', async (req, res) => {
   //const post = req.url.split('/')[2].split('?')[0]
   const { post } = req.params
   //console.log(post)
   try {
      const selectedPost = await Post.findOne({ searchField: post }).exec()
      res.send(selectedPost.share)
   } catch (err) {
      res.send(err)
   }
})

app.use(credentials)

//app.use(cors())
app.use(cors(corsOptions))

app.use(express.json({limit: "500mb", extended: true}))
app.use(express.urlencoded({limit: "500mb", extended: true, parameterLimit: 50000}))

app.use(cookieParser())

app.use('/auth', require('./routes/auth'))
app.use('/posts', require('./routes/posts'))
app.use('/page', require('./routes/page'))

mongoose.connection.once('open', () => {
   console.log('Connected to MongoDB')
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})