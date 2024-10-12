const asyncHandler = require('express-async-handler');
const Enrollment = require('../models/enrollmentModel');
const Course = require('../models/courseModel');
const User = require('../models/userModel');
const Timetable = require('../models/timeTableModel');

//@desc  Enroll in a course
//@route POST api/enrollments/enroll
//@access private (student)
const enrollCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.body;
    const studentId = req.user.id;

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    // Check if the student is already enrolled in the course
    const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existingEnrollment) {
        res.status(400);
        throw new Error('Student is already enrolled in this course');
    }

    // Create the enrollment
    const enrollment = await Enrollment.create({
        student: studentId,
        course: courseId,
        enrollmentDate: Date.now()
    });

    res.status(201).json({ message: 'Enrollment created successfully', enrollment });
});


// //@desc  Get student's timetable
// //@route GET api/enrollments/timetable
// //@access private (student)
// const getTimetable = asyncHandler(async (req, res) => {
//     // Fetch timetable entries from the database
//     const timetableEntries = await Timetable.find()
//         .populate('course', 'name')
//         .sort({ startTime: 1 }); // Sort by start time in ascending order

//     // Map the timetable entries to include course name, start time, end time, and location
//     const formattedTimetable = timetableEntries.map(entry => ({
//         courseName: entry.course.name,
//         startTime: entry.startTime,
//         endTime: entry.endTime,
//         location: entry.location
//     }));

//     res.status(200).json(formattedTimetable);
// });


//@desc Get timetable entries with course details
//@route GET /api/timetable
//@access public
const getStudentTimetable = asyncHandler(async (req, res) => {
    // Fetch timetable entries from the database
    const timetableEntries = await Timetable.find()
        .populate('course', 'name')
        .sort({ startTime: 1 }); // Sort by start time in ascending order

    // Map the timetable entries to include course name, start time, end time, and location
    const formattedTimetable = timetableEntries.map(entry => ({
        courseName: entry.course.name,
        day: entry.dayOfWeek,
        startTime: entry.startTime,
        endTime: entry.endTime,
        location: entry.location
    }));

    res.status(200).json(formattedTimetable);
});


//@desc   Get all enrollments
//@route GET api/enrollments/enrollments
//@access private (facultymember or admin
const getAllEnrollments = asyncHandler(async (req, res) => {
    // Find all enrollments
    const enrollments = await Enrollment.find().populate('student').populate('course');
    res.status(200).json(enrollments);
});


//@desc  remove an enrollment
//@route DELETE api/enrollments/enrollments/:id'
//@access private (faculty memeber)
const deleteEnrollment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the enrollment exists
        const enrollment = await Enrollment.findById(id);
        if (!enrollment) {
            res.status(404);
            throw new Error('Enrollment not found');
        }

        // Delete the enrollment
        await Enrollment.findByIdAndDelete(id);

        // Return success message
        res.status(200).json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});


module.exports = { enrollCourse, getStudentTimetable, getAllEnrollments, deleteEnrollment };
