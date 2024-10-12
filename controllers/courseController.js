const asyncHandler = require("express-async-handler");

const Course = require("../models/courseModel.js");
const User = require('../models/userModel');


//@desc get all courses
//@route GET /api/courses
//@access private
const getCourses = asyncHandler(async (req, res) => {
  const course = await Course.find({ facultyMemberID: req.user.facultyMemberID });
  res.status(200).json(course);
});

//@desc get a course
//@route GET /api/courses/:id
//@access private
const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res
      .status(404)
      .json({
        title: "Course not found",
        message: "No course found with the provided ID",
      });
    return;
  }

  res.status(200).json(course);
});

//@desc create new course
//@route POST /api/courses
//@access private (facultyMember)
const createCourse = asyncHandler(async (req, res) => {

  const { name, code, description, credits } = req.body;
  if (!name || !code || !description || !credits) {
    res.status(400);
    throw new Error("All fields are required! ");
  }

  const course = await Course.create({
    facultyMemberIDs: req.user.id,
    name,
    code,
    description,
    credits,
  });

  res.status(201).json(course);

  // res.status(201).json({message: `Create course for ${req.params.id} `});
});

//@desc Delete a course
//@route DELETE /api/courses/:id
//@access private (faculty member)
const deleteCourse = asyncHandler(async (req, res) => {
    const courseId = req.params.id;

    // Find the course by ID
    let course = await Course.findById(courseId);
    if (!course) {
        res.status(404);
        throw new Error("Course not found");
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    res.status(200).json({ message: "Course deleted successfully" });
});

//@desc Update a course
//@route PUT /api/courses/:id
//@access private (faculty member)
const updateCourse = asyncHandler(async (req, res) => {
    const courseId = req.params.id;
    const { name, code, description, credits } = req.body;

    // Find the course by ID
    let course = await Course.findById(courseId);
    if (!course) {
        res.status(404);
        throw new Error("Course not found");
    }

    // Update the course fields
    course.name = name;
    course.code = code;
    course.description = description;
    course.credits = credits;

    // Save the updated course
    course = await course.save();

    res.status(200).json(course);
});


//@desc Assign faculty to a course
//@route PUT /api/courses/assignFacultyMemberToCourse
//@access private (admin)
const assignFacultyMemberToCourse = asyncHandler(async (req, res) => {
    const { courseID, facultyMemberID } = req.body;

    // Ensure that the user is an admin
    if (req.user.role !== 'admin') {
        res.status(403);
        throw new Error("Only admins can perform this action");
    }

    // Find the course by ID
    let course = await Course.findById(courseID);
    if (!course) {
        res.status(404);
        throw new Error("Course not found");
    }

    // Find the faculty member by ID
    const faculty = await User.findById(facultyMemberID);
    if (!faculty || faculty.role !== 'facultyMember') {
        res.status(400);
        throw new Error("Invalid faculty member ID");
    }

    // Add faculty member ID to the array if it doesn't already exist
    if (!course.facultyMemberIDs.includes(facultyMemberID)) {
        course.facultyMemberIDs.push(facultyMemberID);
    }

    // Save the updated course
    await course.save();

    res.status(200).json({ message: "Faculty member assigned to course successfully" });
});


module.exports = {
  getCourses,
  getCourse,
  createCourse,
  deleteCourse,
  updateCourse,
  assignFacultyMemberToCourse
};
