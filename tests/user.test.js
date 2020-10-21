const supertest = require('supertest')
const mongoose = require('mongoose')
const blogHelper = require('./blog_helper.test')
const bcrypt = require('bcrypt')
const userHelper = require('./user_helper.test')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('password', 10)

        const user = new User({
            username: 'TestUserName',
            name: 'Real Name',
            passwordHash
        })

        await user.save()
    })

    test('invalid users are not created and returns 400', async () => {
        let usersAtStart = await userHelper.usersInDb()
        
        let invalidUser = {
            username: '23',
            password: 'a',
            name: 'Chris'
        }

        let result = await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
        
        expect(result.body.error).toContain(
            'password must be at least 3 characters long'
        )

        const usersAtEnd = await userHelper.usersInDb()

        expect(usersAtEnd).toHaveLength(usersAtStart.length)

        expect(usersAtEnd).not.toContain(invalidUser)

    
    })
})

afterAll(() => {
    mongoose.connection.close()
})