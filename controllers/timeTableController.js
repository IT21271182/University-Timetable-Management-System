const asyncHandler = require('express-async-handler');
const Timetable = require('../models/timeTableModel');
const createNotification = require('../services/notificationService');
const Enrollment = require('../models/enrollmentModel')

//@desc create new timetable entry
//@route POST /api/tiemtables
//@access private (facultyMember or admin)
const createTimetable = asyncHandler(async (req, res) => {
    const { course, dayOfWeek, startTime, endTime } = req.body;

    // Check for overlap before creating a new entry
    const hasOverlap = await checkForOverlap(req.body);
    if (hasOverlap) {
        res.status(400);
        throw new Error('Timetable entry overlaps with an existing entry');
    }

    const timetable = await Timetable.create(req.body);
    res.status(201).json(timetable);
});

//@desc Update a timetable entry
//@route PUT /api/tiemtable/:id
//@access private (faculty member or admin)
const updateTimetable = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { course, dayOfWeek, startTime, endTime } = req.body;

    // Check for overlap before updating the entry
    const hasOverlap = await checkForOverlap(req.body);
    if (hasOverlap) {
        res.status(400);
        throw new Error('Timetable update results in overlap with an existing entry');
    }

    const timetable = await Timetable.findByIdAndUpdate(id, req.body, { new: true });
    if (!timetable) {
        res.status(404);
        throw new Error('Timetable entry not found');
    }
    res.status(200).json(timetable);

    //Create notification 
    // Retrieve the list of students enrolled in the course
    const enrollments = await Enrollment.find({ course: timetable.course }).populate('student');
    const students = enrollments.map(enrollment => enrollment.student);

    // Create notification for timetable change and send it to each student
    const message = `Timetable entry updated for ${timetable.course} on ${timetable.dayOfWeek}.`;
    for (const student of students) {
        await createNotification(student, message, 'timetable');
    }
});

//@desc Delete a timetable entry
//@route DELETE /api/timetables/:id
//@access private (faculty member and admin)
const deleteTimetable = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const timetable = await Timetable.findByIdAndDelete(id);
    if (!timetable) {
        res.status(404);
        throw new Error('Timetable not found');
    }
    res.status(200).json({ message: 'Timetable entry deleted successfully' });
});

//@desc get all timetables
//@route GET /api/timetables
//@access private
const getTimetables = asyncHandler(async (req, res) => {
    const timetables = await Timetable.find();
    res.status(200).json(timetables);
});


// Check if there is any overlap in the timetable schedule
const checkForOverlap = async (timetableData) => {
    const { course, dayOfWeek, startTime, endTime } = timetableData;
    const existingTimetableEntries = await Timetable.find({ course, dayOfWeek });

    for (const entry of existingTimetableEntries) {
        if ((startTime >= entry.startTime && startTime < entry.endTime) ||
            (endTime > entry.startTime && endTime <= entry.endTime) ||
            (startTime <= entry.startTime && endTime >= entry.endTime)) {
            return true; // Overlap detected
        }
    }
    return false; // No overlap
};

module.exports = { createTimetable, updateTimetable, deleteTimetable, getTimetables };
