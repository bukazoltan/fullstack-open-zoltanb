const blogsRouter = require('express').Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require('jsonwebtoken')



blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.status(200).json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    if (!request.token) return response.status(401).json({error: 'token not provided'})
    const user = await User.findById(request.user.id)
    const blog = new Blog({...request.body, "user": user.id})
    const newBlog = await blog.save()
    user.blogs = user.blogs.concat(newBlog.id)
    await user.save()
    response.status(201).json(newBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    if (!request.token) return response.status(401).json({error: 'token not provided'})
    const user = await User.findById(request.user.id)
    const blogToBeDeleted = await Blog.findById(request.params.id).populate('user')

    if (blogToBeDeleted?.user?.id !== user.id) {
        return response.status(401).json({error: "the post cannot be deleted by user"}).end()
    }

    await blogToBeDeleted.deleteOne()
    return response.status(204).end()
})

blogsRouter.put("/:id", async (request, response) => {
    if (!request.token) return response.status(401).json({error: 'token not provided'})
    const user = await User.findById(request.user.id)
    const updatedInfo = request.body;

    const blogToBeUpdated = await Blog.findById(request.params.id).populate('user')

    if (blogToBeUpdated?.user?.id !== user.id) {
        return response.status(401).json({error: "the post cannot be updated by user"}).end()
    }

    await blogToBeUpdated.updateOne(updatedInfo)
    response.status(204).end()
})

module.exports = blogsRouter