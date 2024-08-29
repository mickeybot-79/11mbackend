require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser')
//const credentials = require('./middleware/credentials')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const PORT = process.env.PORT || 3500

const Share = require('./model/Share')

connectDB()

//app.use(credentials)

app.use(cors())
//app.use(cors(corsOptions))

app.use(express.static(__dirname + '/public'))

app.get('/share/:id', async (req, res) => {
   const post = req.url.split('/')[2].split('?')[0]
   console.log(post)
   //res.sendFile(`public/${post}.html`, {root: __dirname})
   const selectedPost = await Share.findOne({ postId: post }).exec()
   console.log(selectedPost)
   res.json(selectedPost.content)
})

app.use(express.json({limit: "500mb", extended: true}))
app.use(express.urlencoded({limit: "500mb", extended: true, parameterLimit: 50000}))

app.use(cookieParser())

app.use('/register', require('./routes/auth'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/auth'))
app.use('/logout', require('./routes/auth'))
app.use('/posts', require('./routes/posts'))

mongoose.connection.once('open', () => {
   console.log('Connected to MongoDB')
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})