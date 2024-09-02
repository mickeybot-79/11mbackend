const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleNewUser = async (req, res) => {
    const { username, password, image, aboutme } = req.body
    const duplicate = await User.findOne({ usrnme: username }).exec()
    if (duplicate) return res.sendStatus(409) //'error': `User ${user} already exists.`
    try {
        if (password) var hashedPwd = await bcrypt.hash(password, 10)
        const today = Date.now()
        const result = await User.create({
            usrnme: username,
            password: hashedPwd,
            image,
            aboutme,
            createdOn: today,
            refreshToken: ''
        })
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": username,
                    "id": result._id
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        )
        const refreshToken = jwt.sign(
            { "username": username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '90d' }
        )
        result.refreshToken = refreshToken
        try {
            await result.save()
        } catch (er) {
            res.status(500).json({'message': err.message})
        }
        res.status(201).json({accessToken}) //'success': `New user ${user} created!`
    } catch (err) {
        res.status(500).json({'message': err.message})
    }
}

const handleLogin = async (req,res) => {
    const { user, pwd } = req.body
    if (!user || !pwd) return res.sendStatus(400) //'message': 'Username and password are required.'
    const foundUser = await User.findOne({ username: user }).exec()
    if (!foundUser) return res.sendStatus(401) //'error': 'Incorrect Username or password'
    const match = await bcrypt.compare(pwd, foundUser.password)
    if (match) {
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "id": foundUser._id
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        )
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '90d' }
        )
        foundUser.refreshToken = refreshToken
        await foundUser.save()
        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000  * 90, sameSite: 'None', secure: true})
        res.json({ accessToken })
    } else {
        res.sendStatus(401) //'error': 'Incorrect Username or password'
    }
}

const handleRefreshToken = async (req,res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401)
    const refreshToken = cookies.jwt
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec()
    if (!foundUser) return res.sendStatus(403) //'error': 'User not found'
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.status(403).json({'error': err})
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "id": foundUser._id
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
            )
            res.json({ accessToken })
        }
    )
}

const handleLogout = async (req,res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec()
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure:true})
        return res.sendStatus(204)
    }    
    foundUser.refreshToken = ''
    await foundUser.save()
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure:true})
    res.sendStatus(204)
}

module.exports = { 
    handleNewUser,
    handleLogin,
    handleRefreshToken,
    handleLogout
}