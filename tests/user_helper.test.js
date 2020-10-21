const User = require('../models/user')

const usersInDb = async () => {
    let totalUsers = await User.find({})
    return totalUsers.map(user=>user.toJSON())
}

module.exports = {

    usersInDb
}