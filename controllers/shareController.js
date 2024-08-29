const fsPromises = require('fs').promises

const shareTest = async (req, res) => {
    const {post, url, title, description, image} = req.body[0]
    //console.log(req.body)
    const initialText = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#000000" />
            <meta name="og:type" content="object" />
            <meta name="og:url" content="${url}" />
            <meta name="og:title" content="${title}" />
            <meta name="og:description" content="${description}" />
            <meta name="og:image" content="${image}" />
            <meta http-equiv="refresh" content="1; ${url}" />
        </head>
        <body>
        </body>
        </html>`
    try {
        const data = await fsPromises.writeFile(`C:/Users/micha/Desktop/Mat Project/Backend/public/${post}.html`, initialText)
        console.log(data)
    } catch (err) {
        console.log(err)
    }
    res.sendStatus(201)
}

module.exports = { shareTest }