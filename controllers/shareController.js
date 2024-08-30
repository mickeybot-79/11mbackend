const Post = require('../model/Post')

const shareTest = async (req, res) => {
    const {post, url, title, description, image} = req.body[0]
    //console.log(req.body)
    const initialText = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="theme-color" content="#000000" /><meta name="og:type" content="object" /><meta name="og:url" content="${url}" /><meta name="og:title" content="${title}" /><meta name="og:description" content="${description}" /><meta name="og:image" content="${image}" /><meta http-equiv="refresh" content="1; ${url}" /></head><body></body></html>`
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