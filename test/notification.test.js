const asyncHandler = require('express-async-handler');
const { getNotificationsByUserId, createAnnouncement } = require('../controllers/notificationController');
const Notification = require('../models/notificationModel');
const notificationService = require('../services/notificationService');
const Enrollment = require('../models/enrollmentModel');

jest.mock('../models/notificationModel');
jest.mock('../services/notificationService');
jest.mock('../models/enrollmentModel');

describe('Notification Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Reset mock calls after each test
    });

    it('should retrieve notifications for a specific user', async () => {
        const req = { user: { _id: 'userId' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const notifications = [{ message: 'Notification 1' }, { message: 'Notification 2' }];

        Notification.find.mockResolvedValueOnce(notifications);

        await getNotificationsByUserId(req, res);

        expect(Notification.find).toHaveBeenCalledWith({ recipient: 'userId' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(notifications);
    });

    it('should create an important announcement', async () => {
        const req = { body: { message: 'Important Message' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const users = [{ _id: 'userId1' }, { _id: 'userId2' }];
        const announcementMessage = 'Important Announcement: Important Message';

        Enrollment.find.mockResolvedValueOnce(users);
        notificationService.createNotification.mockResolvedValueOnce({});

        await createAnnouncement(req, res);

        expect(Enrollment.find).toHaveBeenCalled();
        expect(notificationService.createNotification).toHaveBeenCalledTimes(2);
        expect(notificationService.createNotification).toHaveBeenCalledWith(users[0], announcementMessage, 'announcement');
        expect(notificationService.createNotification).toHaveBeenCalledWith(users[1], announcementMessage, 'announcement');
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Important announcement created successfully' });
    });
});
