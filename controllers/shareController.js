const fsPromises = require('fs').promises

const shareTest = async (req, res) => {
    const {url, title, description, image} = req.body[0]
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
            <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
            <title>Los 11 Metros</title>
        </head>
        <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root">
            </div>
        </body>
        </html>`
        // <meta http-equiv="refresh" content="1; ${url}" />
    try {
        const data = await fsPromises.writeFile('C:/Users/micha/Desktop/Mat Project/Backend/public/index.html', initialText)
        console.log(data)
    } catch (err) {
        console.log(err)
    }
    res.sendStatus(201)
}

module.exports = { shareTest }