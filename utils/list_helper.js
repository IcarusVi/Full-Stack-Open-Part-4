const dummy = (blogs) => {
    if (blogs) {
        return 1
    }
}

const totalLikes = (listOfBlogs) => {
    let total = 0;
    listOfBlogs.forEach(blog => {
        total += blog.likes
    })
    return total
}

const favoriteBlog = (listOfBlogs) => {
    let bestBlog = listOfBlogs.reduce((currentBest, blog) => {
        return currentBest.likes > blog.likes ? currentBest : blog
    })

    let favorite = {
        title: bestBlog.title,
        author: bestBlog.author,
        likes: bestBlog.likes
    }
    return favorite
}

const blogs = [{ _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0 }, { _id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0 }, { _id: "5a422b3a1b54a676234d17f9", title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12, __v: 0 }, { _id: "5a422b891b54a676234d17fa", title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10, __v: 0 }, { _id: "5a422ba71b54a676234d17fb", title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0, __v: 0 }, { _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0 }
]


const mostBlogs = (listOfBlogs) => {
    let bestAuthor = listOfBlogs.reduce((currentBest, blog) => {
        const testRegex = new RegExp(currentBest.author)
        const secondBlogRegex = new RegExp(blog.author)
        return currentBest.author.match(testRegex).length > blog.author.match(secondBlogRegex).length ? currentBest : blog
    })
    let totalBlogs = 0
    listOfBlogs.forEach(author => {
        if (author.author === bestAuthor.author) {
            totalBlogs++
        }
    })

    return bestAuthor = {
        name: bestAuthor.author,
        blogs: totalBlogs

    }
}

const mostLikes = (listOfBlogs) => {
    let placeHolder = {};
  
    listOfBlogs.forEach((blog) => {
      if (placeHolder.hasOwnProperty(blog.author)) {
        placeHolder[blog.author] = placeHolder[blog.author] + blog.likes;
      } else {
        placeHolder[blog.author] = blog.likes;
      }
    });
  
    let collection = [];
  
    for (var prop in placeHolder) {
      collection.push({ author: prop, likes: placeHolder[prop] });
    }
    return collection.reduce((currentBest, blog) => {
      return currentBest.likes > blog.likes ? currentBest : blog;
    });
  };
  



module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}