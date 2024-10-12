const Notification = require('../models/notificationModel');

async function createNotification(user, message, type) {
  try {
    // Create a new notification object
    const notification = new Notification({
      recipient: user._id, // Assuming user._id is the recipient's ID
      message,
      type
    });

    // Save the notification to the database
     await notification.save();
   

    console.log('Notification saved to the database:', notification);
    return notification; // Return the saved notification object if needed
  } catch (error) {
    console.error('Error saving notification:', error);
    throw error; // Throw the error for handling at the caller level
  }
}

module.exports = {
  createNotification
};
