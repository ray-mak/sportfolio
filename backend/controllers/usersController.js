const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


//@desc Get all users
//@route GET /api/users
//@access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found'})
    }
    res.json(users)
})

//@desc Create new user
//@route POST /api/users
//@access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, email, displayName} = req.body
    if (!username || !password || !email || !displayName) {
        return res.status(400).json({ message: 'All fields are required'})
    }
    //check for duplicates
    const duplicateUser = await User.findOne({ username }).lean().exec()
    if (duplicateUser) {
        return res.status(409).json({ message: 'Duplicate username'})
    }

    const duplicateEmail = await User.findOne({ email }).lean().exec()
    if (duplicateEmail) {
        return res.status(409).json({ message: 'Duplicate email'})
    }

    const duplicateDisplayName = await User.findOne({displayName}).lean().exec()
    if (duplicateDisplayName) {
        return res.status(409).json({message: 'Duplicate display name'})
    }
    //Hash password
    const hashedPwd = await bcrypt.hash(password, 10) //salt rounds

    //create and store new user
    const userObject = { username, "password": hashedPwd, email, displayName }
    const user = await User.create(userObject)
    
    if (user) {//created
        res.status(201).json({ message: `New user ${username} created`})
    } else {
        res.status(400).json({ message: 'Invalid user data received'})
    }

})

//@desc Update a user
//@route PATCH /api/users
//@access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, displayName, password, email } = req.body
    if (!id || !displayName || !password || !email) {
        return res.status(400).json({ message: 'All fields are required'})
    }
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found'})
    }

    const duplicateEmail = await User.findOne({ email }).lean().exec()
    if (duplicateEmail && duplicateEmail?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate email'})
    }

    const duplicateDisplayName = await User.findOne({displayName}).lean().exec()
    if (duplicateDisplayName && duplicateDisplayName?._id.toString() !== id) {
        return res.status(409).json({message: 'Duplicate display name'})
    }

    user.displayName = displayName
    user.email = email

    if (password) {
        //hash password
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated`})
})

//@desc Delete a user
//@route DELETE /api/users
//@access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID Required'})
    }
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found'})
    }
    const result = await user.deleteOne()
    const reply = `Username ${user.username} with ID ${id} deleted`

    res.json(reply)
})


module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}