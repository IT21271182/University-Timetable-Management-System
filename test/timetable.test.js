const asyncHandler = require('express-async-handler');
const {
    createTimetable,
    updateTimetable,
    deleteTimetable,
    getTimetables
} = require('../controllers/timeTableController');
const Timetable = require('../models/timeTableModel');
const Enrollment = require('../models/enrollmentModel');
const createNotification = require('../services/notificationService');

jest.mock('../models/timeTableModel');
jest.mock('../models/enrollmentModel');
jest.mock('../services/notificationService');

describe('Timetable Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Reset mock calls after each test
    });

    it('should create a new timetable entry', async () => {
        const req = { body: { course: 'courseId', dayOfWeek: 'Monday', startTime: '09:00', endTime: '11:00' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Timetable.create.mockResolvedValueOnce(req.body);

        await createTimetable(req, res);

        expect(Timetable.create).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('should update a timetable entry', async () => {
        const timetableData = { course: 'courseId', dayOfWeek: 'Monday', startTime: '09:00', endTime: '11:00' };
        const req = { params: { id: 'timetableId' }, body: timetableData };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Timetable.findByIdAndUpdate.mockResolvedValueOnce(timetableData);

        await updateTimetable(req, res);

        expect(Timetable.findByIdAndUpdate).toHaveBeenCalledWith('timetableId', req.body, { new: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(timetableData);
        expect(createNotification).toHaveBeenCalled(); // Check if notification is created
    });

    it('should delete a timetable entry', async () => {
        const req = { params: { id: 'timetableId' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Timetable.findByIdAndDelete.mockResolvedValueOnce({ _id: 'timetableId' });

        await deleteTimetable(req, res);

        expect(Timetable.findByIdAndDelete).toHaveBeenCalledWith('timetableId');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Timetable entry deleted successfully' });
    });

    it('should get all timetables', async () => {
        const timetables = [{ course: 'Course 1', dayOfWeek: 'Monday', startTime: '09:00', endTime: '11:00' }];
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Timetable.find.mockResolvedValueOnce(timetables);

        await getTimetables(req, res);

        expect(Timetable.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(timetables);
    });
});
