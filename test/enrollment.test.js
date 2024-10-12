const asyncHandler = require('express-async-handler');
const Enrollment = require('../models/enrollmentModel');
const Course = require('../models/courseModel');
const User = require('../models/userModel');
const Timetable = require('../models/timeTableModel');
const {
    enrollCourse,
    getStudentTimetable,
    getAllEnrollments,
    deleteEnrollment
} = require('../controllers/enrollmentController');

jest.mock('../models/enrollmentModel');
jest.mock('../models/courseModel');
jest.mock('../models/userModel');
jest.mock('../models/timeTableModel');

describe('Enrollment Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Reset mock calls after each test
    });

    it('should enroll in a course', async () => {
        const req = { body: { courseId: 'courseId' }, user: { id: 'userId' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Course.findById.mockResolvedValueOnce({ _id: 'courseId' });
        Enrollment.findOne.mockResolvedValueOnce(null);
        Enrollment.create.mockResolvedValueOnce({ message: 'Enrollment created successfully' });

        await enrollCourse(req, res);

        expect(Course.findById).toHaveBeenCalledWith('courseId');
        expect(Enrollment.findOne).toHaveBeenCalledWith({ student: 'userId', course: 'courseId' });
        expect(Enrollment.create).toHaveBeenCalledWith({ student: 'userId', course: 'courseId', enrollmentDate: expect.any(Date) });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Enrollment created successfully', enrollment: { message: 'Enrollment created successfully' } });
    });

    it('should get student timetable', async () => {
        const timetableEntries = [{ course: { name: 'Course 1' }, dayOfWeek: 'Monday', startTime: '09:00', endTime: '11:00', location: 'Room A' }];
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Timetable.find.mockResolvedValueOnce(timetableEntries);

        await getStudentTimetable(req, res);

        expect(Timetable.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{
            courseName: 'Course 1',
            day: 'Monday',
            startTime: '09:00',
            endTime: '11:00',
            location: 'Room A'
        }]);
    });

    it('should get all enrollments', async () => {
        const enrollments = [{ student: { name: 'John Doe' }, course: { name: 'Math' } }];
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Enrollment.find.mockResolvedValueOnce(enrollments);

        await getAllEnrollments(req, res);

        expect(Enrollment.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(enrollments);
    });

    it('should delete an enrollment', async () => {
        const req = { params: { id: 'enrollmentId' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Enrollment.findById.mockResolvedValueOnce({ _id: 'enrollmentId' });
        Enrollment.findByIdAndDelete.mockResolvedValueOnce();

        await deleteEnrollment(req, res);

        expect(Enrollment.findById).toHaveBeenCalledWith('enrollmentId');
        expect(Enrollment.findByIdAndDelete).toHaveBeenCalledWith('enrollmentId');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Enrollment deleted successfully' });
    });
});
