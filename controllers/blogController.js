const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        return authorization.substring(7)
    }
    return null
}

blogRouter.get('/', async (req, res) => {
    let totalBlogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    res.json(totalBlogs)

})

blogRouter.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if (blog) {
        res.json(blog)
    }
    else {
        res.status(404).end()
    }
})

blogRouter.delete('/:id', async (req, res) =>{
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
})

blogRouter.put('/:id', async (req, res)=> {
    const updatedBlog = {
        likes: req.body.likes
    }

    let ans = await Blog.findByIdAndUpdate(req.params.id, updatedBlog, {new: true} )
    res.json(ans)
})



blogRouter.post('/', async (req, res) => {
    
    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    if(!req.token || !decodedToken.id){
        return res.status(401).json({
            error: 'token missing or invalid'
        })
    }

    let foundUser = await User.findById(decodedToken.id)

    const newBlog = new Blog({
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        likes: req.body.likes === undefined ? 0 : req.body.likes,
        user: foundUser._id
    })

    const savedBlog = await newBlog.save()
    foundUser.blogs = foundUser.blogs.concat(savedBlog._id)
    await foundUser.save()

    res.json(savedBlog)

})

blogRouter.delete('/:id', async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)


    if(!req.token || !decodedToken.id){
        return res.status(401).json({
            error: 'token missing or invalid'
        })
    }

    const blogToDelete = await Blog.findById(req.params.id)
    if(!blogToDelete) return res.status(404).end()

    if(blogToDelete.user.toString() === decodedToken.id){
        await blogToDelete.remove()
        return res.status(204).end()
    }

})

module.exports = blogRouter