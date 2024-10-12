const asyncHandler = require('express-async-handler');
const ClassRoom = require('../models/classRoomModel');

//@desc get all rooms
//@route GET /api/classRoooms
//@access private (logged in user)
const getAllRooms = asyncHandler(async (req, res) => {
    const rooms = await ClassRoom.find();
    res.status(200).json(rooms);
});

//@desc get a room
//@route GET /api/classRoooms/:id
//@access private (logged in user)
const getRoomById = asyncHandler(async (req, res) => {
    const room = await ClassRoom.findById(req.params.id);
    if (!room) {
        res.status(404);
        throw new Error('Room not found');
    }
    res.status(200).json(room);
});

//@desc add new room
//@route GET api/classRoooms
//@access private (admin)
const createRoom = asyncHandler(async (req, res) => {
    const { name, capacity, resources } = req.body;

    // Ensure that the user is an admin
    if (req.user.role !== 'admin') {
        res.status(403);
        throw new Error("Only admins can perform this action");
    }

    const room = await ClassRoom.create({ name, capacity, resources });
    res.status(201).json(room);
});

//@desc update a room
//@route GET api/classRoooms/:id
//@access private (admin)
const updateRoom = asyncHandler(async (req, res) => {
    const { name, capacity, resources } = req.body;

    // Ensure that the user is an admin
    if (req.user.role !== 'admin') {
        res.status(403);
        throw new Error("Only admins can perform this action");
    }

    const room = await ClassRoom.findByIdAndUpdate(req.params.id, { name, capacity, resources }, { new: true });
    if (!room) {
        res.status(404);
        throw new Error('Room not found');
    }
    res.status(200).json(room);
});

//@desc delete a room
//@route GET api/classRoooms/:id
//@access private (admin)
const deleteRoom = asyncHandler(async (req, res) => {
    const room = await ClassRoom.findById(req.params.id);

    // Ensure that the user is an admin
    if (req.user.role !== 'admin') {
        res.status(403);
        throw new Error("Only admins can perform this action");
    }

    if (!room) {
        res.status(404);
        throw new Error('Room not found');
    }
    await ClassRoom.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Room deleted successfully' });
});



module.exports = {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom
};
