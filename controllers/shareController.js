const Post = require('../model/Post')

const shareTest = async (req, res) => {
    const {post, title, heading, thumbnail} = req.body[0]
    //console.log(req.body)
    // const initialText = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><meta name="theme-color" content="#000000"/><meta property="og:url" content="https://oncemetros.onrender.com/post/${post}"/><meta property="og:type" content="article"/><meta property="og:title" content="${title}"/><meta property="og:description" content="${heading}"/><meta property="og:image" content="${thumbnail}"/><meta http-equiv="refresh" content="1; https://oncemetros.onrender.com/post/${post}"/></head><body></body></html>`
    const initialText = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><meta name="theme-color" content="#000000"/><meta property="og:url" content="https://oncemetros.onrender.com/post/${post}"/><meta property="og:title" content="${title}"/><meta property="og:description" content="${heading}"/><meta property="og:image" content="${thumbnail}"/><meta http-equiv="refresh" content="1; https://oncemetros.onrender.com/post/${post}"/></head><body></body></html>`
    try {
        const foundPost = await Post.findOne({ searchField: post }).exec()
        foundPost.share = initialText
        const result = await foundPost.save()
        console.log(result?.title)
        //res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({ 'message': err.message })
    }
    res.sendStatus(201)
}

module.exports = { shareTest }