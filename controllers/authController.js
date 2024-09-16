const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {v4 : uuid} = require('uuid')

const handleNewUser = async (req, res) => {
    const { username, password, image, aboutme } = req.body
    const duplicate = await User.findOne({ username: username }).exec()
    if (duplicate) return res.status(409).json({'error': 'El nombre de usuario ya está en uso.'})
    try {
        if (password) var hashedPwd = await bcrypt.hash(password, 10)
        const today = Date.now()
        const userId = uuid()
        const result = await User.create({
            username,
            password: hashedPwd,
            image,
            aboutme,
            createdOn: today,
            refreshToken: '',
            userId,
            roles: ['User'],
            posts: []
        })
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": username,
                    "id": result.userId,
                    "roles": result.roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
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
            res.status(500).json({'message': er.message})
        }
        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000  * 90, sameSite: 'None', secure: true})
        res.status(200).json({accessToken})
    } catch (err) {
        res.status(500).json({'message': err.message})
    }
}

const handleLogin = async (req,res) => {
    const { username, password } = req.body
    if (!username || !password) return res.sendStatus(400) //'message': 'Username and password are required.'
    const foundUser = await User.findOne({ username: username }).exec()
    if (!foundUser) return res.status(401).json({'error': 'Usuario o contraseña incorrectos'}) //'error': 'Incorrect Username or password'
    const match = await bcrypt.compare(password, foundUser.password)
    if (match) {
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "id": foundUser.userId,
                    "roles": foundUser.roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
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
        res.status(401).json({'error': 'Usuario o contraseña incorrectos'})
    }
}

const handleRefreshToken = async (req,res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401)
    const refreshToken = cookies.jwt
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec()
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure:true})
        return res.sendStatus(403)
    }
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.status(403).json({'error': err})
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "id": foundUser.userId,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1d' }
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

const getUserData = async (req, res) => {
    const userId = req.url.split('/')[2]
    if (userId !== 'noUser') {
        const foundUser = await User.findOne({ userId: userId }).exec()
        if (!foundUser) return res.sendStatus(404)
        const returnData = {
            userId,
            username: foundUser.username,
            password: foundUser.password,
            image: foundUser.image,
            aboutme: foundUser.aboutme,
            roles: foundUser.roles
        }
        res.json(returnData)
    } else {
        res.sendStatus(204)
    }
}

const getUserProfile = async (req, res) => {
    const userId = req.url.split('/')[2]
    const foundUser = await User.findOne({ userId: userId }).exec()
    if (!foundUser) return res.sendStatus(404) //'error': 'User not found'
    const infoToReturn = {
        username: foundUser.username,
        image: foundUser.image,
        aboutme: foundUser.aboutme,
        memberSince: foundUser.createdOn,
        posts: foundUser.posts
    }
    res.status(200).json(infoToReturn)
}

const updateUserData = async (req, res) => {
    const { userData } = req.body
    const foundUser = await User.findOne({ userId: userData.userId }).exec()
    if (!foundUser) return res.sendStatus(404)
    if (userData.password) {
        const hashedPwd = await bcrypt.hash(userData.password, 10)
        foundUser.password = hashedPwd
    }
    foundUser.image = userData.image
    foundUser.aboutme = userData.aboutme
    try {
        const result = await foundUser.save() 
        res.status(200).json(result)
    } catch (err) {
        res.status(401).json({'error': err})
    }
}

const deleteUser = async (req, res) => {
    const { userId } = req.body
    const foundUser = await User.findOne({ userId: userId }).exec()
    if (!foundUser) return res.sendStatus(404)
    await User.deleteOne({ userId: userId })
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure:true})
    res.status(200).json({'message': 'Cuenta eliminada'})
}

module.exports = { 
    handleNewUser,
    handleLogin,
    handleRefreshToken,
    handleLogout,
    getUserData,
    getUserProfile,
    updateUserData,
    deleteUser
}