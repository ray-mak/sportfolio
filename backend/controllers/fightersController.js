const Fighter = require("../models/Fighter")
const asyncHandler = require('express-async-handler')
const { create } = require("../models/MMAMLBet")

//@desc Get all fighters
//@route GET /api/fighters
//@access Private

const getAllFighters = asyncHandler(async (req, res) => {
    const fighters = await Fighter.find().lean()

    if (!fighters?.length) {
        return res.status(400).json({ message: 'No fighters found' })
    }
    res.json(fighters)
})

//@desc Create new fighter
//@route POST /api/fighters
//@access Private
const createNewFighter = asyncHandler(async (req, res) => {
    const { name, image } = req.body

    if (!name || !image) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const duplicateFighter = await Fighter.findOne({ name }).lean().exec()
    if (duplicateFighter) {
        return res.status(409).json({ message: 'Duplicate fighter' })
    }

    const fighter = await Fighter.create({ name, image })

    if (fighter) {
        return res.status(201).json({ message: 'Fighter profile created' })
    } else {
        return res.status(400).json({ message: 'Invalid fighter data received' })
    }
})

//@desc Update a fighter
//@route PATCH /api/fighters
//@access Private
const updateFighter = asyncHandler(async (req, res) => {
    const { id, name, image } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Fighter ID is required' })
    }

    const fighter = await Fighter.findById(id).exec()

    if (!fighter) {
        return res.status(400).json({ message: 'Fighter not found' })
    }

    const duplicateFighter = await Fighter.findOne({ name }).lean().exec()
    if (duplicateFighter && duplicateFighter?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate fighter' })
    }

    fighter.name = name
    fighter.image = image

    const updatedFighter = fighter.save()

    res.json({ message: `${updatedFighter.name} updated` })
})


//@desc Delete a fighter
//@route DELETE /api/fighters
//@access Private
const deleteFighter = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Fighter ID Required' })
    }
    const fighter = await Fighter.findById(id).exec()

    if (!fighter) {
        return res.status(400).json({ message: 'Fighter not found' })
    }
    const result = await fighter.deleteOne()

    const reply = `Fighter ${fighter.name} with ID ${id} deleted`

    res.json(reply)
})

module.exports = {
    getAllFighters,
    createNewFighter,
    updateFighter,
    deleteFighter
}