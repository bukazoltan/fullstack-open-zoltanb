const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const testCredentials = {
    "username": "testuser",
    "password": "supersecretpassword"
}

const testCredentials2 = {
    "username": "wrongtestuser",
    "password": "othersupersecretpassword"
}

const initialBlogs = [
    {
        "title": "How to write a blog post: a step-by-step guide",
        "author": "Cecilia Lazzaro Blasbalg",
        "url": "https://www.wix.com/blog/how-to-write-a-blog-post-with-examples",
        "likes": 0
    },
    {
        "title": "10 Tips for Effective Time Management",
        "author": "Alexandra Thompson",
        "url": "https://www.example.com/time-management-tips",
        "likes": 45
    },
    {
        "title": "The Ultimate Guide to Healthy Eating",
        "author": "Michael Johnson",
        "url": "https://www.example.com/healthy-eating-guide",
        "likes": 72
    },
    {
        "title": "The Art of Digital Photography",
        "author": "Sophia Lee",
        "url": "https://www.example.com/digital-photography-tips",
        "likes": 67
    }
]

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const logInTestUser = async (credentials) => {
    const {username} = credentials
    const user = await User.findOne({ username })
    
    const userForToken = {
        username: user.username,
        id: user._id,
    }
    
    const token = jwt.sign(
        userForToken, 
        process.env.SECRET,
        { expiresIn: 60*60 }
    )

    return token
}

module.exports = {
  initialBlogs, blogsInDB, usersInDB, testCredentials, testCredentials2, logInTestUser
}