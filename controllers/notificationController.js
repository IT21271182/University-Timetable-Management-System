const asyncHandler = require('express-async-handler');
const Notification = require('../models/notificationModel');
const notificationService = require('../services/notificationService');
const Enrollment = require('../models/enrollmentModel');

//@desc Controller function to retrieve notifications for a specific user
//@route GET /api/notifications
//@access private (logged user)
const getNotificationsByUserId = asyncHandler(async (req, res) => {
    const userId = req.user._id

    // Fetch notifications from the database for the specified user
    // const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
    const notifications = await Notification.find().sort({ createdAt: -1 });    

    res.status(200).json(notifications);
});


//@desc Create an important announcement
//@route POST /api/notifications/announcement
//@access private (faculty member or admin)
const createAnnouncement = asyncHandler(async (req, res) => {
    const { message } = req.body;
   
    // Create notification for the announcement and send it to all users
    const users = await Enrollment.find({}).populate('student');
    const announcementMessage = `Important Announcement: ${message}`;
    for (const user of users) {
        await notificationService.createNotification(user, announcementMessage, 'announcement');
    }

    res.status(201).json({ message: 'Important announcement created successfully' });
});


module.exports = {
    getNotificationsByUserId,
    createAnnouncement,
};
