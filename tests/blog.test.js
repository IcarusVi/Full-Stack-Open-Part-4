const supertest = require('supertest')
const mongoose = require('mongoose')
const blogHelper = require('./blog_helper.test')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

describe('Retrieving saved blogs', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})

        for (let blog of blogHelper.initialBlogList) {
            let blogObject = new Blog(blog)
            await blogObject.save()
        }
    })

    test('Blogs are being returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('Correct amount of blogs are being', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(blogHelper.initialBlogList.length)

    })

    test('Blogs have a unique id', async () => {
        const response = await api.get(`/api/blogs/${blogHelper.initialBlogList[0]._id}`)
        expect(response.body.id).toBeDefined()
    })

})

describe('Posting a new blog', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})

        for (let blog of blogHelper.initialBlogList) {
            let blogObject = new Blog(blog)
            await blogObject.save()
        }
    })

    test('Database blog length should increase by 1 with new base', async () => {
        const newBlog = {
            title: 'postedTitle',
            author: 'posterAuthor',
            url: 'postUrl',
            likes: 10
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(blogHelper.initialBlogList.length + 1)

    })

    test('Blog entry with no likes should default to 0', async () =>{
        const noLikes = {
            "title": "noLikes",
            "author": "authortest", 
            "url": "fakeurl.conm/blog2"
        }

        let newPost = await api
            .post('/api/blogs')
            .send(noLikes)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(newPost.body.likes).toBe(0)

    })

    test('Blog entry with no title or url return status 400', async () => {
        const noUrl = {
            "author": "authortest"
        }

        await api
            .post('/api/blogs')
            .send(noUrl)
            .expect(400)
    })

    describe('deletion of a blog entry', () => {

        test('succeeds with status code 204 if id is valid', async () => {
            const blogsAtStart = await blogHelper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/notes${blogToDelete.id}`)
                .expect(204)
            const blogAtEnd = await blogHelper.blogsInDb()

            expect(blogAtEnd).toHaveLength(blogHelper.initialBlogList.length - 1)
        })

    })
})

afterAll(() => {
    mongoose.connection.close()
})