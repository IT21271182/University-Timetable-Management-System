const mongoose = require('mongoose');
const { mockRequest, mockResponse } = require('express-async-handler');
const {
  getCourses,
  getCourse,
  createCourse,
  deleteCourse,
  updateCourse,
} = require('../controllers/courseController');
const Course = require('../models/courseModel');

// Mocking the User model to simulate authentication
jest.mock('../models/userModel', () => ({
  findById: jest.fn().mockResolvedValue({
    _id: mongoose.Types.ObjectId(), // Simulate a valid user ID
    role: 'facultyMember', // Simulate the user's role
  }),
}));

describe('Course Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock calls before each test
  });

  it('should get all courses', async () => {
    // Mock the request and response objects
    const req = mockRequest({ user: { _id: mongoose.Types.ObjectId() } }); // Simulate an authenticated user
    const res = mockResponse();

    await getCourses(req, res);

    expect(Course.find).toHaveBeenCalledWith({ facultyMemberIDs: req.user._id });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });



  it('should get all courses', async () => {
    // Create sample courses in the database
    await Course.create([
      {
        name: 'IP',
        code: 'IT1010',
        description: 'Introduction to Programming',
        credits: 3,
      },
      {
        name: 'CA',
        code: 'IT1020',
        description: 'Computer Architecture',
        credits: 3,
      },
    ]);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getCourses(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    expect(res.json.mock.calls[0][0].length).toBe(2); // Assuming there are two courses created
  });

  it('should get a single course', async () => {
    const course = await Course.create({
      name: 'IP',
      code: 'IT1010',
      description: 'Introduction to Programming',
      credits: 3,
    });

    const req = { params: { id: course._id } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    expect(res.json.mock.calls[0][0]).toMatchObject(course.toObject());
  });

  it('should delete a course', async () => {
    const course = await Course.create({
      name: 'IP',
      code: 'IT1010',
      description: 'Introduction to Programming',
      credits: 3,
    });

    const req = { params: { id: course._id } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();

    const deletedCourse = await Course.findById(course._id);
    expect(deletedCourse).toBeNull();
  });

  it('should update a course', async () => {
    const course = await Course.create({
      name: 'IP',
      code: 'IT1010',
      description: 'Introduction to Programming',
      credits: 3,
    });

    const updatedCourseData = {
      name: 'IP',
      code: 'IT1010',
      description: 'Introduction to Programming part 2',
      credits: 3,
    };

    const req = {
      params: { id: course._id },
      body: updatedCourseData,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();

    const updatedCourse = await Course.findById(course._id);
    expect(updatedCourse.toObject()).toMatchObject(updatedCourseData);
  });
});
