const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');
const ClassRoom = require('../models/classRoomModel');

//@desc get all bokings
//@route GET /api/bookings
//@access private 
const getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
});


// @desc Book a room
// @route /api/bookings
// @access private (facultyMember or admin)
// Book a room
const bookRoom = asyncHandler(async (req, res) => {
    const { roomId, startTime, endTime, courseId } = req.body;

    // Check if the room exists
    const room = await ClassRoom.findById(roomId);
    if (!room) {
        res.status(404);
        throw new Error('Room not found');
    }

    // Check if there are any overlapping bookings for the same room
    const overlappingBooking = await Booking.findOne({
        room: roomId,
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // Check for overlapping time slots
            { startTime: { $gte: startTime, $lte: endTime } },
            { endTime: { $gte: startTime, $lte: endTime } }
        ]
    });

    if (overlappingBooking) {
        res.status(400);
        throw new Error('Booking overlaps with existing booking');
    }

    // Create the booking
    const booking = await Booking.create({
        room: roomId,
        startTime,
        endTime,
        course: courseId
    });

    // Add the booking ID to the room's bookings array
    room.bookings.push(booking._id);
    await room.save();

    res.status(201).json({ message: 'Booking created successfully', booking });
});


// @desc Delete a booking by ID
// @route /api/bookings/:id
// @access private (facultyMember or admin)
const deleteBooking = asyncHandler(async (req, res) => {
    const { id: bookingId } = req.params;

    // Find the booking
    const booking = await Booking.findByIdAndDelete(bookingId);
    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    // Find the room associated with the booking
    const room = await ClassRoom.findById(booking.room);
    if (!room) {
        res.status(404);
        throw new Error('Room not found');
    }

    // Remove the booking ID from the room's bookings array
    room.bookings = room.bookings.filter(id => id.toString() !== bookingId);
    await room.save();

    res.status(200).json({ message: 'Booking deleted successfully' });
});




module.exports = {
    getAllBookings,
    bookRoom,
    deleteBooking
};
