const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((acc, curr) => acc + curr.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.toSorted((a, b) => b.likes - a.likes)[0]
}

const mostBlogs = (blogs) => {
    const countByAuthor = _.countBy(blogs, 'author')
    const restructured = _.map(countByAuthor, (blogs, author) => ({
        author: author,
        blogs: blogs
    })).toSorted((a, b) => b.blogs - a.blogs)
    return restructured[0]
}

const mostLikes = (blogs) => {
    const postsPerAuthor = _.groupBy(blogs, 'author')
    const likesPerAuthor = _.map(postsPerAuthor, (blogList, author) => {
        const likeCount = _.reduce(blogList, (acc, current) => acc + current.likes, 0)
        return ({
            author: author,
            likes: likeCount
        })
    }).toSorted((a, b) => b.likes - a.likes)[0]
    return likesPerAuthor
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}