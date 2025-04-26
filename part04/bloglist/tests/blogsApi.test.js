const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../utils/testHelper')
const bcrypt = require('bcryptjs')

const api = supertest(app)

describe('when there is intially some blogs saved', async () => {
    beforeEach(async() => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash(helper.testCredentials.password, 10)
        const user = new User({ username: helper.testCredentials.username, passwordHash})
        const testUser = await user.save()

        const secondaryTestUserpasswordHash = await bcrypt.hash(helper.testCredentials2.password, 10)
        const secondaryTestUser = new User({ username: helper.testCredentials2.username, passwordHash: secondaryTestUserpasswordHash})
        await secondaryTestUser.save()

        const testUserId = testUser._id.toString()

        let testUserRefetched = await User.findById(testUserId)
        
        await Blog.deleteMany({})
        let blogObject = await new Blog({...helper.initialBlogs[0], "user": testUserId})
        let savedBlog1 = await blogObject.save()
        testUserRefetched.blogs = await testUserRefetched.blogs.concat(savedBlog1._id.toString())

        blogObject = await new Blog({...helper.initialBlogs[1], "user": testUserId})
        let savedBlog2 = await blogObject.save()
        testUserRefetched.blogs = await testUserRefetched.blogs.concat(savedBlog2._id.toString())

        blogObject = await new Blog({...helper.initialBlogs[2], "user": testUserId})
        let savedBlog3 = await blogObject.save()
        testUserRefetched.blogs = await testUserRefetched.blogs.concat(savedBlog3._id.toString())

        blogObject = await new Blog({...helper.initialBlogs[3], "user": testUserId})
        let savedBlog4 = await blogObject.save()
        testUserRefetched.blogs = await testUserRefetched.blogs.concat(savedBlog4._id.toString())
        await testUserRefetched.save()

    })

    test('notes are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test(`there are ${helper.initialBlogs.length} notes`, async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
    
    test('the unique identifier property is named id', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual('id' in response.body[0], true)
    })

    test('the HTTP POST request successfully creates a new blog post', async() => {
        const token = await helper.logInTestUser(helper.testCredentials)

        const newBlog = {
            "title": "Mastering Python: A Beginner's Guide",
            "author": "Emily Davis",
            "url": "https://www.example.com/python-beginners-guide",
            "likes": 0
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
        
        const response = await api.get('/api/blogs')
        
        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    })
    
    test('the likes property is defaulting to 0 if not specified', async() => {
        const token = await helper.logInTestUser(helper.testCredentials)

        const newBlog = {
            "title": "Mastering Python: A Beginner's Guide",
            "author": "Emily Davis",
            "url": "https://www.example.com/python-beginners-guide"
        }
        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
        
        assert.strictEqual(response.body.likes, 0)
    })
    
    test('if title or url is missing from the request, we receive 400', async() => {
        const token = await helper.logInTestUser(helper.testCredentials)

        const newBlogWithoutTitle = {
            "author": "Emily Davis",
            "url": "https://www.example.com/python-beginners-guide"
        }
    
        const newBlogWithoutAuthor = {
            "title": "Mastering Python: A Beginner's Guide",
            "url": "https://www.example.com/python-beginners-guide"
        }
    
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlogWithoutTitle)
            .expect(400)
    
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlogWithoutAuthor)
            .expect(400)
    })
    
    test('logged in user who created the blog can delete a blog', async () => {
        const blogsAtStart = await helper.blogsInDB()

        const token = await helper.logInTestUser(helper.testCredentials)
    
        const idToDelete = blogsAtStart[0].id
        
        await api.delete(`/api/blogs/${blogsAtStart[0]['id']}`).set('Authorization', `Bearer ${token}`).expect(204)
    
        const blogsAtEnd = await helper.blogsInDB()
        const ids = blogsAtEnd.map(n => n.id)
    
        assert(!ids.includes(idToDelete))
    
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    
    })
    
    test('logged in user who created the blog can update a blog', async () => {
        const blogsAtStart = await helper.blogsInDB()
        const token = await helper.logInTestUser(helper.testCredentials)
        
        const blogToUpdate = blogsAtStart[0]
        const updatedBlog = {...blogToUpdate, likes: blogToUpdate.likes + 1}
    
        await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).set('Authorization', `Bearer ${token}`).expect(204)
        const contentAfterUpdate = await helper.blogsInDB()
        
        assert.strictEqual(contentAfterUpdate[0].likes, blogToUpdate.likes + 1)
    })

    test('blog cannot be updated without token', async () => {
        const blogsAtStart = await helper.blogsInDB()
        
        const blogToUpdate = blogsAtStart[0]
        const updatedBlog = {...blogToUpdate, likes: blogToUpdate.likes + 1}
    
        await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(401)
        const contentAfterUpdate = await helper.blogsInDB()
        
        assert.strictEqual(contentAfterUpdate[0].likes, blogToUpdate.likes)
    })

    test('blog cannot be deleted without token', async () => {
        const blogsAtStart = await helper.blogsInDB()
    
        const idToDelete = blogsAtStart[0].id
        
        await api.delete(`/api/blogs/${blogsAtStart[0]['id']}`).expect(401)
    
        const blogsAtEnd = await helper.blogsInDB()
        const ids = blogsAtEnd.map(n => n.id)
    
        assert(ids.includes(idToDelete))
    
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('logged in user who did not create the blog cannot delete a blog', async () => {
        const blogsAtStart = await helper.blogsInDB()

        const token = await helper.logInTestUser(helper.testCredentials2)
    
        const idToDelete = blogsAtStart[0].id
        
        await api.delete(`/api/blogs/${blogsAtStart[0]['id']}`).set('Authorization', `Bearer ${token}`).expect(401)
    
        const blogsAtEnd = await helper.blogsInDB()
        const ids = blogsAtEnd.map(n => n.id)
    
        assert(ids.includes(idToDelete))
    
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    
    })
    
    test('logged in user who did not create the blog cannot update a blog', async () => {
        const blogsAtStart = await helper.blogsInDB()
        const token = await helper.logInTestUser(helper.testCredentials2)

        console.log(token)
        
        const blogToUpdate = blogsAtStart[0]
        const updatedBlog = {...blogToUpdate, likes: blogToUpdate.likes + 1}
    
        await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).set('Authorization', `Bearer ${token}`).expect(401)
        const contentAfterUpdate = await helper.blogsInDB()
        
        assert.strictEqual(contentAfterUpdate[0].likes, blogToUpdate.likes)
    })

    
})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash(helper.testCredentials.password, 10)
        const user = new User({ username: helper.testCredentials.username, passwordHash})

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDB()
        
        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api.post('/api/users')
                 .send(newUser)
                 .expect(201)
                 .expect('Content-Type', /application\/json/)
        const usersAtEnd = await helper.usersInDB()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails when same username', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            username: 'testuser',
            name: 'Matti Luukkainen',
            password: 'salainen'
        }

        const result = await api.post('/api/users')
                 .send(newUser)
                 .expect(400)
                 .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDB()

        const userAtEnd = await helper.usersInDB()

        assert(result.body.error.includes('expected `username` to be unique'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails when the username is too short', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            username: 'ab',
            name: 'Matti Luukkainen',
            password: 'salainen'
        }

        const result = await api.post('/api/users')
                 .send(newUser)
                 .expect(400)
                 .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDB()

        const userAtEnd = await helper.usersInDB()

        assert(result.body.error.includes('validation error'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails when the password is too short', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            username: 'abcd',
            name: 'Matti Luukkainen',
            password: 'ab'
        }

        const result = await api.post('/api/users')
                 .send(newUser)
                 .expect(400)
                 .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDB()

        const userAtEnd = await helper.usersInDB()

        assert(result.body.error.includes('password is shortern than 3 characters'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})