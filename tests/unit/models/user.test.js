const { User } = require('../../../models/user')
const jwt = require('jsonwebtoken')
const config = require('config')
const mongoose= require('mongoose')

describe('User.generateAuthToken', () => {
    it('should return a valid jsonwebtoken of the user', () => {
        const id = new mongoose.Types.ObjectId().toHexString()
        const user = new User({ _id: id, isAdmin: true })
        const token = user.generateAuthToken()
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
    
        expect(decoded).toMatchObject({ _id: id, isAdmin: true })
    })
})