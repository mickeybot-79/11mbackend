//const Share = require('../model/Share')
const Post = require('../model/Post')

const shareTest = async (req, res) => {
    const {post, url, title, description, image} = req.body[0]
    //console.log(req.body)
    const initialText = `<!DOCTYPE html><html lang="en"><head><meta name="og:type" content="object" /><meta name="og:url" content="${url}" /><meta name="og:title" content="${title}" /><meta name="og:description" content="${description.split('\n')[0]}" /><meta name="og:image" content="${image.split('/')[2]}" /><meta http-equiv="refresh" content="1; ${url}" /></head><body></body></html>`
    try {
        const foundPost = await Post.findOne({ searchField: post }).exec()
        foundPost.share = initialText
        const result = await foundPost.save()
        console.log(result)
        //res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({ 'message': err.message })
    }
    res.sendStatus(201)
}

module.exports = { shareTest }