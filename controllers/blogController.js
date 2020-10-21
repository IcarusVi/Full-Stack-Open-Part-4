const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (req, res) => {
    let totalBlogs = await Blog.find({})
    res.json(totalBlogs.map(blog => blog.toJSON()))

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
    const newBlog = new Blog({
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        likes: req.body.likes === undefined ? 0 : req.body.likes
    })

    const savedBlog = await newBlog.save()
    res.json(savedBlog)

})

module.exports = blogRouter